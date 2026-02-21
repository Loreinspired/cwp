-- ─────────────────────────────────────────────────────────────────────────────
-- CWI Sessions Table
-- Run this once in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → paste + Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists cwi_sessions (
    id            bigserial primary key,
    session_id    text unique not null,
    messages      jsonb default '[]'::jsonb,
    name          text,
    email         text,
    phone         text,
    lead_captured boolean default false,
    created_at    timestamptz default now(),
    updated_at    timestamptz default now()
);

-- Index for fast lookups by email and lead status
create index if not exists idx_cwi_email on cwi_sessions(email);
create index if not exists idx_cwi_lead_captured on cwi_sessions(lead_captured);
create index if not exists idx_cwi_created_at on cwi_sessions(created_at desc);

-- Allow anonymous inserts and upserts from the browser (anon key)
alter table cwi_sessions enable row level security;

create policy "Allow anon insert" on cwi_sessions
    for insert with check (true);

create policy "Allow anon update own session" on cwi_sessions
    for update using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Useful queries once data comes in:
-- ─────────────────────────────────────────────────────────────────────────────

-- All leads captured:
-- select session_id, name, email, phone, created_at from cwi_sessions where lead_captured = true order by created_at desc;

-- Total sessions vs leads:
-- select count(*) as total_sessions, count(*) filter (where lead_captured) as leads from cwi_sessions;

-- Most recent 10 conversations:
-- select session_id, email, jsonb_array_length(messages) as turns, created_at from cwi_sessions order by created_at desc limit 10;
