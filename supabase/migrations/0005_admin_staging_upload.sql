-- Admin "staged upload" flow (see src/lib/supabase/staging-types.ts).
--
-- Large report/policy PDFs are uploaded straight from the browser to Storage
-- (bypassing Vercel's 4.5 MB Server-Action body cap, which otherwise 413s).
-- The browser uses the publishable key + the admin's auth session, so it needs
-- an RLS INSERT policy — but ONLY into the private `_staging/` prefix. The
-- Server Actions then read/move/delete the object with the service-role key,
-- which bypasses RLS, so no other policy is required.
--
-- Idempotent. Adjust the email if ADMIN_EMAIL changes.

drop policy if exists "admin can stage uploads" on storage.objects;
create policy "admin can stage uploads"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('annual-reports', 'policies')
    and (storage.foldername(name))[1] = '_staging'
    and auth.jwt() ->> 'email' = 'a.ranjan.tech@gmail.com'
  );
