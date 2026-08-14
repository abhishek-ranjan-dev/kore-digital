import { getSupabaseAdmin } from "./server";
import type { StagedRef } from "./staging-types";

/*
  Server-side handling of staged uploads (see staging-types.ts). All operations
  use the service-role key and run inside Server Actions, so they bypass Storage
  RLS. Callers MUST pass a ref that has already been through `parseStagedRef`, so
  these never touch anything outside the `_staging/` area.
*/

/** Read a staged object into memory. Throws on any storage error. */
export async function downloadStagedFile(ref: StagedRef): Promise<Buffer> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase client unavailable.");
  const { data, error } = await supabase.storage
    .from(ref.bucket)
    .download(ref.path);
  if (error || !data) throw new Error(error?.message ?? "Download failed.");
  return Buffer.from(await data.arrayBuffer());
}

/** Best-effort delete of a staged object. A leftover is swept on schedule. */
export async function removeStagedFile(ref: StagedRef): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  try {
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
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase client unavailable.");
  await supabase.storage.from(ref.bucket).remove([toPath]);
  const { error } = await supabase.storage
    .from(ref.bucket)
    .move(ref.path, toPath);
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(ref.bucket).getPublicUrl(toPath);
  return data.publicUrl;
}
