-- Statutory policies: a taxonomy of categories + the policy documents filed
-- under each. Mirrors the annual_reports design (public read, service-role
-- writes). Run in the Supabase SQL editor, or via the Supabase CLI. Idempotent.

create extension if not exists pgcrypto;

-- Reuse the shared updated_at trigger fn (also defined in 0001); redefine so
-- this migration is self-contained and safe to run standalone.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Categories ──────────────────────────────────────────────────────────
-- One row per statutory subject area. `sort_order` fixes the display order on
-- the IR page; new categories (a future 4th, 5th…) simply get a higher value.
create table if not exists public.policy_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Policy documents ────────────────────────────────────────────────────
create table if not exists public.policy_documents (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  category_id     uuid not null references public.policy_categories(id) on delete restrict,
  mandatory_under text,                       -- e.g. "SEBI LODR Regulation 46"
  description     text,
  pdf_url         text not null,              -- public URL (Storage or /public)
  pdf_filename    text,
  sort_order      integer not null default 0, -- ordering within a category
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists policy_documents_category_idx
  on public.policy_documents (category_id);

drop trigger if exists policy_documents_set_updated_at on public.policy_documents;
create trigger policy_documents_set_updated_at
  before update on public.policy_documents
  for each row execute function public.set_updated_at();

-- ── RLS: policies are public disclosures → anyone may read; writes only via
-- the service-role key (which bypasses RLS). No public insert/update policy.
alter table public.policy_categories enable row level security;
alter table public.policy_documents  enable row level security;

drop policy if exists "policy_categories public read" on public.policy_categories;
create policy "policy_categories public read"
  on public.policy_categories for select
  to anon, authenticated
  using (true);

drop policy if exists "policy_documents public read" on public.policy_documents;
create policy "policy_documents public read"
  on public.policy_documents for select
  to anon, authenticated
  using (true);

-- ── Storage bucket for uploaded policy PDFs (public read) ────────────────
insert into storage.buckets (id, name, public)
values ('policies', 'policies', true)
on conflict (id) do nothing;

drop policy if exists "policies public read" on storage.objects;
create policy "policies public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'policies');

-- ── Seed: the 3 statutory categories only ────────────────────────────────
-- Policy DOCUMENTS are uploaded through /admin to Supabase Storage — they are
-- deliberately NOT seeded here, so a fresh database never depends on bundled
-- PDFs under public/. Admins add the documents after applying this migration.
insert into public.policy_categories (name, sort_order) values
  ('Core Governance & Conduct', 0),
  ('Operations & Materiality',   1),
  ('Securities Compliance',      2)
on conflict (name) do nothing;
