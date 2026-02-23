-- ============================================================
-- Clearwater Intelligence (CWI) — Migration 002
-- Switch embedding provider: OpenAI (1536-dim) → Gemini (768-dim)
--
-- IMPORTANT: If you have existing data in cwp_documents, truncate
-- the table first (or use --force with ingest.py to re-ingest).
-- You cannot cast a vector(1536) to vector(768) — they are different
-- dimensional spaces.
--
-- Run this in Supabase Dashboard → SQL Editor.
-- ============================================================

-- 1. Drop the old IVFFlat index (dimension-specific)
drop index if exists public.cwp_documents_embedding_idx;

-- 2. Drop the old match_documents function (typed to vector(1536))
drop function if exists match_documents(vector(1536), int, float);

-- 3. Replace the embedding column with the correct dimension
--    If the table is empty this is instant; if not, truncate first.
alter table public.cwp_documents
    drop column if exists embedding;

alter table public.cwp_documents
    add column embedding vector(768);   -- Gemini text-embedding-004

-- 4. Recreate IVFFlat index for 768-dim vectors
--    NOTE: Create this AFTER ingesting at least 100 documents.
--    Until then, Postgres uses a sequential scan (correct but slower).
create index if not exists cwp_documents_embedding_idx
    on public.cwp_documents
    using ivfflat (embedding vector_cosine_ops)
    with (lists = 100);

-- 5. Recreate match_documents for 768-dim
create or replace function match_documents(
    query_embedding  vector(768),
    match_count      int     default 5,
    match_threshold  float   default 0.65
)
returns table (
    id              bigint,
    content         text,
    file_name       text,
    folder_path     text,
    partner_author  text,
    similarity      float
)
language plpgsql
as $$
begin
    return query
    select
        d.id,
        d.content,
        d.file_name,
        d.folder_path,
        d.partner_author,
        1 - (d.embedding <=> query_embedding) as similarity
    from public.cwp_documents d
    where 1 - (d.embedding <=> query_embedding) > match_threshold
    order by d.embedding <=> query_embedding
    limit match_count;
end;
$$;

-- 6. Update comment on documents table
comment on column public.cwp_documents.embedding is
    'Gemini text-embedding-004 — 768-dimensional vector';
