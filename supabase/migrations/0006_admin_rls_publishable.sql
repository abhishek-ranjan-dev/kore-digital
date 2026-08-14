-- Move the /admin write path off the service-role key and onto the signed-in
-- admin (publishable key + auth session) under RLS. The Server Actions now run
-- as the admin user, so they need explicit RLS grants. Only the daily cleanup
-- cron (/api/staging-sweep) still uses the service-role key.
--
-- Everything below is gated on the admin's email claim, so ONLY the single
-- admin identity gets write access; anonymous visitors keep read-only access
-- through the existing public-read policies. Idempotent. Supersedes 0005.
--
-- Update the email in all four policies if ADMIN_EMAIL changes.

-- ── Tables: full CRUD for the admin ──────────────────────────────────────
-- `for all` covers SELECT/INSERT/UPDATE/DELETE. The admin SELECT also lets the
-- actions read soft-deleted rows (the public-read policies hide is_deleted=true),
-- which `updateAnnualReport` / soft-delete `.select()` rely on.

drop policy if exists "annual_reports admin write" on public.annual_reports;
create policy "annual_reports admin write"
  on public.annual_reports for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'a.ranjan.tech@gmail.com')
  with check (auth.jwt() ->> 'email' = 'a.ranjan.tech@gmail.com');

drop policy if exists "policy_categories admin write" on public.policy_categories;
create policy "policy_categories admin write"
  on public.policy_categories for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'a.ranjan.tech@gmail.com')
  with check (auth.jwt() ->> 'email' = 'a.ranjan.tech@gmail.com');

drop policy if exists "policy_documents admin write" on public.policy_documents;
create policy "policy_documents admin write"
  on public.policy_documents for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'a.ranjan.tech@gmail.com')
  with check (auth.jwt() ->> 'email' = 'a.ranjan.tech@gmail.com');

-- ── Storage: full CRUD for the admin on the two document buckets ─────────
-- Replaces the narrow _staging-only insert policy from 0005. The admin needs
-- INSERT (browser stages to _staging/), SELECT (download the staged bytes),
-- UPDATE (move staged → final), and DELETE (cleanup) — so grant all four,
-- scoped to these buckets and the admin email. Public download is unaffected
-- (the buckets stay public via the existing "* public read" policies).

drop policy if exists "admin can stage uploads" on storage.objects;
drop policy if exists "admin manages report and policy files" on storage.objects;
create policy "admin manages report and policy files"
  on storage.objects for all
  to authenticated
  using (
    bucket_id in ('annual-reports', 'policies')
    and auth.jwt() ->> 'email' = 'a.ranjan.tech@gmail.com'
  )
  with check (
    bucket_id in ('annual-reports', 'policies')
    and auth.jwt() ->> 'email' = 'a.ranjan.tech@gmail.com'
  );
