"use client";

import { createAuthBrowserClient } from "./auth-browser";
import { STAGING_PREFIX, type StagedRef, type StorageBucketName } from "./staging-types";

/*
  Stage a PDF for admin ingestion by uploading it DIRECTLY to Supabase Storage
  from the browser — not through a Server Action. Vercel caps serverless request
  bodies at 4.5 MB, so a big report/policy sent through a Server Action 413s;
  this leg goes browser → Supabase and has no such cap.

  Auth: the publishable (anon) key + the admin's cookie session. A Storage RLS
  policy permits the signed-in admin to write ONLY under the `_staging/` prefix
  of these buckets — nothing else. The service-role key never touches the
  browser. The returned {bucket, path} is handed to a Server Action, which reads
  the bytes with the service key and then deletes them (extract) or moves them
  to the final document path (submit).
*/
export async function stageAdminUpload(
  bucket: StorageBucketName,
  file: File
): Promise<StagedRef> {
  const supabase = createAuthBrowserClient();
  const path = `${STAGING_PREFIX}${crypto.randomUUID()}.pdf`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: "application/pdf",
    upsert: false,
  });
  if (error) throw new Error(error.message || "Upload failed.");
  return { bucket, path };
}
