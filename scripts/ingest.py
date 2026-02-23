#!/usr/bin/env python3
"""
Clearwater Intelligence — Document Ingestion Pipeline
======================================================
Crawls a OneDrive folder (or a local directory) for PDF and DOCX files,
chunks them using a legal-optimised strategy, generates Gemini embeddings
(text-embedding-004, 768-dim), and upserts them into the Supabase
cwp_documents table.

Usage:
    # OneDrive mode (requires Azure app registration):
    python ingest.py --source onedrive

    # Local directory mode (useful for testing or bulk uploads):
    python ingest.py --source local --dir ./documents

    # Force re-ingest already-ingested files:
    python ingest.py --source local --dir ./documents --force

Run `python ingest.py --help` for all options.
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Generator

import requests
from dotenv import load_dotenv

load_dotenv()

# ─── Configuration ────────────────────────────────────────────────────────────

ONEDRIVE_CLIENT_ID     = os.getenv("ONEDRIVE_CLIENT_ID")
ONEDRIVE_CLIENT_SECRET = os.getenv("ONEDRIVE_CLIENT_SECRET")
ONEDRIVE_TENANT_ID     = os.getenv("ONEDRIVE_TENANT_ID")
ONEDRIVE_FOLDER_PATH   = os.getenv("ONEDRIVE_FOLDER_PATH", "/CWP Precedents")

GEMINI_API_KEY         = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
SUPABASE_URL           = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_SERVICE_KEY   = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

EMBEDDING_MODEL        = "text-embedding-004"   # Gemini — 768-dim
EMBEDDING_DIMENSION    = 768
CHUNK_SIZE             = 1000   # characters (~250 tokens)
CHUNK_OVERLAP          = 200    # characters — ensures clauses don't get cut
BATCH_SIZE             = 100    # embeddings per Gemini batchEmbedContents request
TMP_DIR                = "/tmp/cwp_ingestion"

GEMINI_EMBED_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"{EMBEDDING_MODEL}:batchEmbedContents"
)

# Partner name lookup by folder keyword
PARTNER_MAP = {
    "tpa":       "Temidayo P. Akeredolu",
    "temidayo":  "Temidayo P. Akeredolu",
    "ezealaji":  "Endurance C. Ezealaji-Ayodele",
    "adeogun":   "Tamilore T. Adeogun",
    "adeyemi":   "Emmanuel O. Adeyemi",
}

# ─── Imports (validated at runtime) ──────────────────────────────────────────

def check_dependencies():
    missing = []
    for pkg in ["supabase", "langchain_community", "unstructured", "docx2txt", "dotenv", "requests"]:
        try:
            __import__(pkg.replace("-", "_"))
        except ImportError:
            missing.append(pkg)
    if missing:
        print(f"[error] Missing packages: {', '.join(missing)}")
        print("Run: pip install -r requirements.txt")
        sys.exit(1)

# ─── Document Loading ─────────────────────────────────────────────────────────

def load_pdf(path: str) -> str:
    from langchain_community.document_loaders import UnstructuredPDFLoader
    loader = UnstructuredPDFLoader(path, mode="elements", strategy="fast")
    docs = loader.load()
    return "\n\n".join(d.page_content for d in docs if d.page_content.strip())


def load_docx(path: str) -> str:
    from langchain_community.document_loaders import Docx2txtLoader
    loader = Docx2txtLoader(path)
    docs = loader.load()
    return "\n\n".join(d.page_content for d in docs if d.page_content.strip())


def load_txt(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def load_document(path: str) -> str:
    """Load and extract text from a PDF, DOCX, or TXT file."""
    suffix = Path(path).suffix.lower()
    if suffix == ".pdf":
        return load_pdf(path)
    elif suffix in (".docx", ".doc"):
        return load_docx(path)
    elif suffix == ".txt":
        return load_txt(path)
    raise ValueError(f"Unsupported file type: {suffix}")

# ─── Legal Chunking ───────────────────────────────────────────────────────────

def chunk_text(text: str) -> list[str]:
    """
    Legal-optimised chunking strategy:
    - Splits on paragraph breaks first, then sentences, then words.
    - 1000-char chunks with 200-char overlap to preserve clause context.
    - Skips chunks that are mostly whitespace or too short to be meaningful.
    """
    from langchain.text_splitter import RecursiveCharacterTextSplitter

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n\n", "\n\n", "\n", ". ", " ", ""],
        length_function=len,
        is_separator_regex=False,
    )
    chunks = splitter.split_text(text)
    return [c.strip() for c in chunks if len(c.strip()) > 80]

# ─── Embedding via Gemini ─────────────────────────────────────────────────────

def embed_batch(texts: list[str]) -> list[list[float]]:
    """
    Embed a batch of texts using Gemini text-embedding-004.
    Uses batchEmbedContents REST endpoint. Retries once on rate-limit (429).
    Returns a list of 768-dim embedding vectors.
    """
    payload = {
        "requests": [
            {
                "model": f"models/{EMBEDDING_MODEL}",
                "content": {"parts": [{"text": t}]},
                "taskType": "RETRIEVAL_DOCUMENT",
            }
            for t in texts
        ]
    }

    for attempt in range(2):
        resp = requests.post(
            GEMINI_EMBED_URL,
            params={"key": GEMINI_API_KEY},
            json=payload,
            timeout=60,
        )
        if resp.status_code == 429 and attempt == 0:
            print("    [rate limit] Waiting 30s...")
            time.sleep(30)
            continue
        resp.raise_for_status()
        data = resp.json()
        return [e["values"] for e in data["embeddings"]]

    raise RuntimeError("Gemini embedding request failed after retry.")


def embed_all(chunks: list[str]) -> list[list[float]]:
    """Embed all chunks in batches."""
    all_embeddings = []
    for i in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[i : i + BATCH_SIZE]
        all_embeddings.extend(embed_batch(batch))
        if i + BATCH_SIZE < len(chunks):
            time.sleep(0.3)
    return all_embeddings

# ─── Supabase Upsert ─────────────────────────────────────────────────────────

def is_already_ingested(file_name: str, supabase) -> bool:
    """Check if a file has already been ingested (deduplication)."""
    result = supabase.rpc(
        "file_already_ingested", {"p_file_name": file_name}
    ).execute()
    return result.data is True


def upsert_chunks(
    chunks: list[str],
    embeddings: list[list[float]],
    metadata: dict,
    supabase,
) -> int:
    """Insert document chunks into Supabase. Returns number of rows inserted."""
    rows = [
        {
            "content": chunk,
            "embedding": embedding,
            "file_name": metadata["file_name"],
            "folder_path": metadata["folder_path"],
            "date_created": metadata.get("date_created"),
            "partner_author": metadata.get("partner_author"),
            "chunk_index": i,
            "metadata": json.dumps(metadata),
        }
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))
    ]

    inserted = 0
    for i in range(0, len(rows), 100):
        batch = rows[i : i + 100]
        supabase.table("cwp_documents").insert(batch).execute()
        inserted += len(batch)

    return inserted

# ─── Partner Author Inference ─────────────────────────────────────────────────

def infer_partner_author(file_name: str, folder_path: str) -> str | None:
    combined = (file_name + " " + folder_path).lower()
    for keyword, name in PARTNER_MAP.items():
        if keyword in combined:
            return name
    return None

# ─── Source: Local Directory ──────────────────────────────────────────────────

def iter_local_files(directory: str) -> Generator[dict, None, None]:
    """Recursively yield all supported files from a local directory."""
    supported = {".pdf", ".docx", ".doc", ".txt"}
    for path in Path(directory).rglob("*"):
        if path.suffix.lower() in supported and path.is_file():
            stat = path.stat()
            yield {
                "file_name": path.name,
                "folder_path": str(path.parent),
                "local_path": str(path),
                "date_created": datetime.fromtimestamp(
                    stat.st_ctime, tz=timezone.utc
                ).isoformat(),
            }

# ─── Source: OneDrive ─────────────────────────────────────────────────────────

def iter_onedrive_files(folder_path: str) -> Generator[dict, None, None]:
    """Authenticate with OneDrive and recursively yield all supported files."""
    try:
        from O365 import Account, FileSystemTokenBackend
    except ImportError:
        print("[error] O365 package not installed. Run: pip install O365")
        sys.exit(1)

    credentials = (ONEDRIVE_CLIENT_ID, ONEDRIVE_CLIENT_SECRET)
    token_backend = FileSystemTokenBackend(
        token_path=".", token_filename="cwp_o365_token.txt"
    )
    account = Account(
        credentials,
        tenant_id=ONEDRIVE_TENANT_ID,
        token_backend=token_backend,
    )

    if not account.is_authenticated:
        print("OneDrive: Starting authentication flow...")
        account.authenticate(scopes=["basic", "onedrive_all"])

    drive = account.storage().get_default_drive()
    root = drive.get_item_by_path(folder_path)
    supported = {".pdf", ".docx", ".doc", ".txt"}
    os.makedirs(TMP_DIR, exist_ok=True)

    def crawl(folder):
        for item in folder.get_items():
            if item.is_folder:
                yield from crawl(item)
            elif Path(item.name).suffix.lower() in supported:
                tmp_path = os.path.join(TMP_DIR, item.name)
                item.download(tmp_path)
                yield {
                    "file_name": item.name,
                    "folder_path": item.parent_path,
                    "local_path": tmp_path,
                    "date_created": item.created.isoformat() if item.created else None,
                }

    yield from crawl(root)

# ─── Main ─────────────────────────────────────────────────────────────────────

def main(args):
    check_dependencies()

    from supabase import create_client

    # Validate config
    errors = []
    if not GEMINI_API_KEY:
        errors.append("GEMINI_API_KEY is not set (also checks VITE_GEMINI_API_KEY)")
    if not SUPABASE_URL:
        errors.append("SUPABASE_URL is not set (also checks VITE_SUPABASE_URL)")
    if not SUPABASE_SERVICE_KEY:
        errors.append("SUPABASE_SERVICE_ROLE_KEY is not set")
    if args.source == "onedrive" and not all([ONEDRIVE_CLIENT_ID, ONEDRIVE_CLIENT_SECRET, ONEDRIVE_TENANT_ID]):
        errors.append("OneDrive credentials are incomplete (CLIENT_ID, CLIENT_SECRET, TENANT_ID)")
    if errors:
        for e in errors:
            print(f"[config error] {e}")
        sys.exit(1)

    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    print()
    print("=" * 60)
    print("  Clearwater Intelligence — Document Ingestion")
    print(f"  Source    : {args.source.upper()}")
    print(f"  Embeddings: Gemini {EMBEDDING_MODEL} ({EMBEDDING_DIMENSION}-dim)")
    print(f"  Chunks    : {CHUNK_SIZE} chars / {CHUNK_OVERLAP} overlap")
    print("=" * 60)
    print()

    if args.source == "onedrive":
        file_iter = iter_onedrive_files(ONEDRIVE_FOLDER_PATH)
    else:
        if not args.dir or not os.path.isdir(args.dir):
            print(f"[error] --dir must point to a valid directory (got: {args.dir})")
            sys.exit(1)
        file_iter = iter_local_files(args.dir)

    total_files = 0
    total_chunks = 0
    skipped = 0

    for file_info in file_iter:
        file_name = file_info["file_name"]
        folder_path = file_info["folder_path"]
        local_path = file_info["local_path"]

        print(f"→ {folder_path}/{file_name}")

        if not args.force and is_already_ingested(file_name, supabase):
            print("  [skip] Already ingested — use --force to re-ingest\n")
            skipped += 1
            continue

        try:
            raw_text = load_document(local_path)
            if len(raw_text.strip()) < 100:
                print("  [skip] Too little content extracted\n")
                continue

            chunks = chunk_text(raw_text)
            if not chunks:
                print("  [skip] No usable chunks after splitting\n")
                continue

            print(f"  {len(chunks)} chunks extracted")

            embeddings = embed_all(chunks)
            print(f"  {len(embeddings)} embeddings generated ({EMBEDDING_DIMENSION}-dim)")

            metadata = {
                "file_name": file_name,
                "folder_path": folder_path,
                "date_created": file_info.get("date_created"),
                "partner_author": infer_partner_author(file_name, folder_path),
            }
            inserted = upsert_chunks(chunks, embeddings, metadata, supabase)
            print(f"  ✓ {inserted} rows upserted to Supabase\n")

            total_files += 1
            total_chunks += inserted

        except Exception as e:
            print(f"  ✗ Error: {e}\n")
            continue

        finally:
            if args.source == "onedrive" and os.path.exists(local_path):
                os.remove(local_path)

    print("=" * 60)
    print(f"  Done: {total_files} files ingested, {total_chunks} chunks stored")
    if skipped:
        print(f"  Skipped: {skipped} already-ingested files")
    print("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="CWI Document Ingestion Pipeline — OneDrive or local directory"
    )
    parser.add_argument(
        "--source",
        choices=["onedrive", "local"],
        default="local",
        help="Document source: 'onedrive' or 'local' (default: local)",
    )
    parser.add_argument(
        "--dir",
        default="./documents",
        help="Local directory path (required when --source=local)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Re-ingest files even if already in the database",
    )
    main(parser.parse_args())
