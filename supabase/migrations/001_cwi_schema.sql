-- ============================================================
-- Clearwater Intelligence (CWI) — Supabase Schema
-- Migration 001: pgvector document store + session capture
-- ============================================================
-- PREREQUISITES (run once in Supabase Dashboard → Extensions):
--   1. Enable the `vector` extension
--   2. Enable the `pg_trgm` extension (for text search)
-- ============================================================

-- 1. Enable extensions
create extension if not exists vector;
create extension if not exists pg_trgm;

-- ============================================================
-- 2. Documents Table
-- Stores chunked text from the firm's OneDrive precedents,
-- along with OpenAI embeddings for similarity search.
-- ============================================================
create table if not exists public.cwp_documents (
    id            bigserial primary key,
    content       text        not null,
    embedding     vector(1536),           -- text-embedding-3-small
    file_name     text,
    folder_path   text,
    date_created  timestamptz,
    partner_author text,
    chunk_index   int          default 0,
    metadata      jsonb        default '{}'::jsonb,
    created_at    timestamptz  default now()
);

-- Vector similarity index (IVFFlat — efficient for 1536-dim)
-- NOTE: Run this AFTER you have ingested at least 100 documents.
-- Until then, Postgres will do a sequential scan (slower but correct).
create index if not exists cwp_documents_embedding_idx
    on public.cwp_documents
    using ivfflat (embedding vector_cosine_ops)
    with (lists = 100);

-- Text search index on content (for keyword fallback)
create index if not exists cwp_documents_content_idx
    on public.cwp_documents
    using gin (content gin_trgm_ops);

-- Index on file_name for deduplication checks
create index if not exists cwp_documents_file_name_idx
    on public.cwp_documents (file_name);

-- ============================================================
-- 3. CWI Sessions Table
-- Every interaction with the Intelligence Desk is logged here
-- for partner review, lead qualification, and follow-up.
-- ============================================================
create table if not exists public.cwi_sessions (
    id              uuid         primary key default gen_random_uuid(),
    email           text,
    query           text         not null,
    clarifications  text,                   -- answers to drilling questions
    response        text,                   -- full AI response
    sources_cited   text[]       default '{}',
    action_items    text[]       default '{}',
    created_at      timestamptz  default now(),
    reviewed        boolean      default false,
    partner_notes   text,
    matter_type     text,                   -- inferred from query (optional)
    session_origin  text         default 'web'  -- 'web' | 'api'
);

-- Index for partner dashboard queries
create index if not exists cwi_sessions_email_idx     on public.cwi_sessions (email);
create index if not exists cwi_sessions_created_idx   on public.cwi_sessions (created_at desc);
create index if not exists cwi_sessions_reviewed_idx  on public.cwi_sessions (reviewed) where reviewed = false;

-- ============================================================
-- 4. Row-Level Security
-- ============================================================
alter table public.cwp_documents  enable row level security;
alter table public.cwi_sessions   enable row level security;

-- Documents: only service role (ingestion script + Edge Functions)
create policy "Service role manages documents"
    on public.cwp_documents for all
    using (auth.role() = 'service_role');

-- Sessions: public can INSERT (form submissions), service role has full access
create policy "Public can log sessions"
    on public.cwi_sessions for insert
    with check (true);

create policy "Service role manages sessions"
    on public.cwi_sessions for all
    using (auth.role() = 'service_role');

-- ============================================================
-- 5. Similarity Search Function
-- Called from the Edge Function with a query embedding.
-- Returns top-N most relevant document chunks.
-- ============================================================
create or replace function match_documents(
    query_embedding  vector(1536),
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

-- ============================================================
-- 6. Helper: check if a file has already been ingested
-- Used by the Python ingestion script for deduplication.
-- ============================================================
create or replace function file_already_ingested(p_file_name text)
returns boolean
language sql
as $$
    select exists (
        select 1 from public.cwp_documents
        where file_name = p_file_name
        limit 1
    );
$$;
