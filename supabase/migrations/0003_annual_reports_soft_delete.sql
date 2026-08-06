-- Soft delete for annual reports: hide a row from the site without losing it.
-- Run after 0001. Idempotent.

alter table public.annual_reports
  add column if not exists is_deleted boolean not null default false;

-- Public read now excludes soft-deleted rows (anon/authenticated). Service-role
-- writes bypass RLS, so the admin can still see, restore, or hard-delete them.
drop policy if exists "annual_reports public read" on public.annual_reports;
create policy "annual_reports public read"
  on public.annual_reports for select
  to anon, authenticated
  using (is_deleted = false);
