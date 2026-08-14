import { createAuthServerClient } from "./auth-server";
import type { StagedRef } from "./staging-types";

/*
  Server-side handling of staged uploads (see staging-types.ts). Operations run
  as the SIGNED-IN ADMIN (publishable key + session), so Storage RLS applies —
  the admin policy (migration 0006) grants full CRUD on the two buckets. These
  run only inside Server Actions that have already passed `requireAdmin()`, and
  callers MUST pass a ref that has been through `parseStagedRef`, so nothing
  outside the `_staging/` area is ever touched here.
*/

/** Read a staged object into memory. Throws on any storage error. */
export async function downloadStagedFile(ref: StagedRef): Promise<Buffer> {
  const supabase = await createAuthServerClient();
  const { data, error } = await supabase.storage
    .from(ref.bucket)
    .download(ref.path);
  if (error || !data) throw new Error(error?.message ?? "Download failed.");
  return Buffer.from(await data.arrayBuffer());
}

/** Best-effort delete of a staged object. A leftover is swept on schedule. */
export async function removeStagedFile(ref: StagedRef): Promise<void> {
  try {
    const supabase = await createAuthServerClient();
    await supabase.storage.from(ref.bucket).remove([ref.path]);
  } catch {
    // Non-fatal — never let cleanup failure surface to the user.
  }
}

/*
  Commit a staged object to its final document path and return the public URL.
  `move` deletes the source, so a successful submit leaves nothing in staging.
  The destination is cleared first because `move` has no upsert (preserves the
  old `upload({ upsert: true })` semantics for a re-submitted fiscal year).
*/
export async function commitStagedFile(
  ref: StagedRef,
  toPath: string
): Promise<string> {
  const supabase = await createAuthServerClient();
  await supabase.storage.from(ref.bucket).remove([toPath]);
  const { error } = await supabase.storage
    .from(ref.bucket)
    .move(ref.path, toPath);
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(ref.bucket).getPublicUrl(toPath);
  return data.publicUrl;
}
