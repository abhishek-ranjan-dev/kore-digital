/*
  Shared types + validation for the admin "staged upload" flow.

  Large PDFs (annual reports / policies) are uploaded straight from the browser
  to Supabase Storage under a private `_staging/` prefix — bypassing the 4.5 MB
  cap Vercel enforces on Server-Action request bodies (which otherwise 413s).
  A Server Action then reads the object by {bucket, path} to run Gemini
  auto-extract (transient) or to commit it to its final name on submit.

  Pure module (no "use client"/"use server", no SDK imports) so it is safe to
  import from BOTH the browser helper and the server actions.
*/
export type StorageBucketName = "annual-reports" | "policies";

export interface StagedRef {
  bucket: StorageBucketName;
  path: string;
}

/** All staged objects live under this prefix; never a final document path. */
export const STAGING_PREFIX = "_staging/";

// A staged path is ALWAYS `_staging/<uuid>.pdf`. This is validated server-side
// before any download/move/remove, so a caller can never point those storage
// operations at a real (final) object outside the staging area.
const STAGED_PATH_RE =
  /^_staging\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$/i;

/** Validate an untrusted {bucket, path} from the client. Null if it's not a
 *  well-formed reference to an object inside the staging area. */
export function parseStagedRef(raw: unknown): StagedRef | null {
  if (!raw || typeof raw !== "object") return null;
  const bucket = (raw as { bucket?: unknown }).bucket;
  const path = (raw as { path?: unknown }).path;
  if (bucket !== "annual-reports" && bucket !== "policies") return null;
  if (typeof path !== "string" || !STAGED_PATH_RE.test(path)) return null;
  return { bucket, path };
}
