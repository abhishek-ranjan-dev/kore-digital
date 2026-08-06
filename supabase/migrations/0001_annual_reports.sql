-- Annual reports: one row per fiscal year, holding both standalone and
-- consolidated figures (each nullable). Run in the Supabase SQL editor, or
-- via the Supabase CLI. Idempotent.

create extension if not exists pgcrypto;

create table if not exists public.annual_reports (
  id                    uuid primary key default gen_random_uuid(),
  fiscal_year           text unique not null,       -- "FY24-25"
  fiscal_year_end       date,                        -- ordering / display
  -- standalone (₹ Cr)
  revenue               numeric,
  net_worth             numeric,
  long_term_borrowings  numeric,
  work_in_progress      numeric,
  -- consolidated (₹ Cr / %)
  total_income          numeric,
  operational_ebitda    numeric,
  pat                   numeric,
  ebitda_margin         numeric,
  pat_margin            numeric,
  -- document
  pdf_url               text,                        -- public URL (Storage or /public)
  pdf_filename          text,
  is_projected          boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Keep updated_at fresh on upsert.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists annual_reports_set_updated_at on public.annual_reports;
create trigger annual_reports_set_updated_at
  before update on public.annual_reports
  for each row execute function public.set_updated_at();

-- RLS: figures are public disclosures → anyone may read; writes only via the
-- service-role key (which bypasses RLS). No public insert/update policy.
alter table public.annual_reports enable row level security;

drop policy if exists "annual_reports public read" on public.annual_reports;
create policy "annual_reports public read"
  on public.annual_reports for select
  to anon, authenticated
  using (true);

-- Storage bucket for report PDFs (public read).
insert into storage.buckets (id, name, public)
values ('annual-reports', 'annual-reports', true)
on conflict (id) do nothing;

drop policy if exists "annual-reports public read" on storage.objects;
create policy "annual-reports public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'annual-reports');
