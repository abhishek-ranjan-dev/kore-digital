-- Move admin RLS off a hardcoded email and onto a ROLE flag stored in
-- Supabase's own auth.users table (raw_app_meta_data->>'role' = 'admin').
--
-- WHY: RLS can't read the app's ADMIN_EMAIL env var, so the policies used to
-- hardcode the email in SQL — which drifted from the real admin and rejected
-- the browser staging upload ("new row violates row-level security policy"),
-- surfacing as "Upload failed". With a role claim, the admin identity lives in
-- one place (auth.users); changing/adding an admin is a row update, no
-- migration. app_metadata is service-role-only, so users can't self-promote.
--
-- NOTE: the app layer (proxy.ts / requireAdmin) still gates on ADMIN_EMAIL by
-- design — this migration only changes the DATABASE side. A write therefore
-- requires BOTH: session email == ADMIN_EMAIL AND the user's role == 'admin'.
--
-- Self-contained, idempotent. Supersedes the email-based 0005/0006 policies.

-- ── Helper: is the current user an admin? ───────────────────────────────
-- Reads auth.users LIVE (not the JWT), so a role change takes effect without
-- forcing re-login. SECURITY DEFINER lets it read auth.users; STABLE lets the
-- planner cache it within a statement. Empty search_path = no shadowing.
create or replace function public.is_admin()
  returns boolean
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select exists (
    select 1
    from auth.users
    where id = auth.uid()
      and raw_app_meta_data ->> 'role' = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- ── Bootstrap: flag the current admin account ───────────────────────────
-- One-time; the email here only SEEDS the role, it is not used by the policies
-- below. No-op if the user doesn't exist yet — set the role then (see README).
update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'chaitanya.r.doshi@gmail.com';

-- ── Tables: full CRUD for the admin ──────────────────────────────────────
drop policy if exists "annual_reports admin write" on public.annual_reports;
create policy "annual_reports admin write"
  on public.annual_reports for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "policy_categories admin write" on public.policy_categories;
create policy "policy_categories admin write"
  on public.policy_categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "policy_documents admin write" on public.policy_documents;
create policy "policy_documents admin write"
  on public.policy_documents for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Storage: full CRUD for the admin on the two document buckets ─────────
drop policy if exists "admin can stage uploads" on storage.objects;
drop policy if exists "admin manages report and policy files" on storage.objects;
create policy "admin manages report and policy files"
  on storage.objects for all
  to authenticated
  using (
    bucket_id in ('annual-reports', 'policies')
    and public.is_admin()
  )
  with check (
    bucket_id in ('annual-reports', 'policies')
    and public.is_admin()
  );
