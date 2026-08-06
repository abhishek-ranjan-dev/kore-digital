-- Soft delete for statutory policies: hide a policy from the site without
-- losing it. Run after 0002. Idempotent.

alter table public.policy_documents
  add column if not exists is_deleted boolean not null default false;

-- Public read now excludes soft-deleted rows (anon/authenticated). Service-role
-- writes bypass RLS, so the admin can still see or hard-delete them.
drop policy if exists "policy_documents public read" on public.policy_documents;
create policy "policy_documents public read"
  on public.policy_documents for select
  to anon, authenticated
  using (is_deleted = false);
