"use server";

import { promises as fs } from "node:fs";
import path from "node:path";

/*
  ── Admin document management — Server Actions ──────────────────────
  Handles PDF ingestion into `public/documents/{annual-reports|policies}`
  from the /admin portal.

  Security posture:
    • The client-side gate on /admin is UX only. Every action here
      re-verifies the access key server-side because a direct POST
      to a Server Action bypasses any client check.
    • Access key falls back to a hard-coded default so this works
      locally out of the box, but should be set via ADMIN_ACCESS_KEY
      environment variable in real deployments.
    • Filenames are sanitised (path traversal blocked, whitelist chars).
    • Only application/pdf MIME accepted.
    • Upload size capped at 25 MB.

  Runtime caveat:
    • fs.writeFile on `public/` works with `next dev` and `next start`
      on a writable filesystem. Serverless targets (Vercel functions,
      Cloudflare Workers) have read-only FS — swap for object storage
      before deploying there.
*/

const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY ?? "KoreAdmin2026";
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export type DocumentType = "annual-report" | "policy-doc";

const TARGET_DIRS: Record<DocumentType, string> = {
  "annual-report": "public/documents/annual-reports",
  "policy-doc": "public/documents/policies",
};

const TYPE_LABELS: Record<DocumentType, string> = {
  "annual-report": "Annual Report",
  "policy-doc": "Statutory Policy",
};

export interface UploadResult {
  ok: boolean;
  message: string;
  savedAs?: string;
}

export interface DocumentEntry {
  type: DocumentType;
  typeLabel: string;
  filename: string;
  sizeBytes: number;
  modifiedAt: string;
  publicPath: string;
}

/* ─── Passcode verification ─────────────────────────────────────── */

export async function verifyAccess(key: string): Promise<boolean> {
  return key === ADMIN_ACCESS_KEY;
}

/* ─── Helpers ───────────────────────────────────────────────────── */

function sanitizeFilename(raw: string): string | null {
  // 1. Strip any directory components — defends against ../../etc/passwd
  const base = path.basename(raw);
  // 2. Whitelist alphanumerics, dash, underscore, dot; collapse repeats
  const clean = base.replace(/[^\w.\-]/g, "_").replace(/_{2,}/g, "_");
  // 3. Require .pdf extension and a non-empty stem
  if (!clean.toLowerCase().endsWith(".pdf")) return null;
  if (clean.length < 5) return null; // at least "a.pdf"
  return clean;
}

function publicPathFor(dir: string, filename: string): string {
  return `/${dir.replace(/^public\//, "")}/${filename}`;
}

/* ─── Upload action ─────────────────────────────────────────────── */

export async function uploadDocument(
  formData: FormData
): Promise<UploadResult> {
  const submittedKey = formData.get("accessKey");
  if (submittedKey !== ADMIN_ACCESS_KEY) {
    return { ok: false, message: "Unauthorised. Access key rejected." };
  }

  const documentType = formData.get("documentType");
  const file = formData.get("file");

  if (
    documentType !== "annual-report" &&
    documentType !== "policy-doc"
  ) {
    return { ok: false, message: "Invalid document type." };
  }

  if (!(file instanceof File)) {
    return { ok: false, message: "No file provided." };
  }

  if (file.size === 0) {
    return { ok: false, message: "File is empty." };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (MAX_UPLOAD_BYTES / (1024 * 1024)).toFixed(0);
    return { ok: false, message: `File exceeds ${mb} MB limit.` };
  }

  if (file.type !== "application/pdf") {
    return {
      ok: false,
      message: `Only PDF files are allowed (got ${file.type || "unknown"}).`,
    };
  }

  const cleanName = sanitizeFilename(file.name);
  if (!cleanName) {
    return {
      ok: false,
      message: "Invalid filename. Must be a .pdf with safe characters.",
    };
  }

  const targetDirRel = TARGET_DIRS[documentType];
  const targetDirAbs = path.resolve(process.cwd(), targetDirRel);

  try {
    await fs.mkdir(targetDirAbs, { recursive: true });
    const outPath = path.join(targetDirAbs, cleanName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(outPath, buffer);

    return {
      ok: true,
      message: `Saved as ${cleanName}`,
      savedAs: publicPathFor(targetDirRel, cleanName),
    };
  } catch (err) {
    console.error("[admin/upload] Filesystem error:", err);
    return {
      ok: false,
      message: "Server could not write the file. Check filesystem permissions.",
    };
  }
}

/* ─── Directory listing ─────────────────────────────────────────── */

export async function listDocuments(): Promise<DocumentEntry[]> {
  const entries: DocumentEntry[] = [];

  for (const [type, dir] of Object.entries(TARGET_DIRS) as [
    DocumentType,
    string,
  ][]) {
    const absDir = path.resolve(process.cwd(), dir);
    try {
      const files = await fs.readdir(absDir);
      for (const filename of files) {
        if (!filename.toLowerCase().endsWith(".pdf")) continue;
        const stat = await fs.stat(path.join(absDir, filename));
        entries.push({
          type,
          typeLabel: TYPE_LABELS[type],
          filename,
          sizeBytes: stat.size,
          modifiedAt: stat.mtime.toISOString(),
          publicPath: publicPathFor(dir, filename),
        });
      }
    } catch {
      // Directory doesn't exist yet — first-run state. Silently skip.
    }
  }

  // Newest first
  return entries.sort((a, b) =>
    b.modifiedAt.localeCompare(a.modifiedAt)
  );
}
