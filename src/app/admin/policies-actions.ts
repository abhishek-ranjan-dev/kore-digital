"use server";

import { revalidatePath } from "next/cache";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { parseStagedRef } from "@/lib/supabase/staging-types";
import { commitStagedFile, removeStagedFile } from "@/lib/supabase/staging";
import { SEED_CATEGORIES } from "@/lib/policies-data";

/*
  Statutory-policy submission — Server Actions.

  Persists a policy (title, category, optional "mandatory under") to the
  Supabase `policy_documents` table and uploads its PDF to the `policies`
  Storage bucket. The category is resolved by NAME via get-or-create, so
  picking an existing category and typing a brand-new one share one code
  path — that's how a future 4th category gets created. On success it
  revalidates the IR page so the change shows immediately.

  Auth: NONE — /admin is unauthenticated; protect it at the deployment layer.
  Writes use the service-role key, which never reaches the browser.
*/
export interface PolicySubmitResult {
  ok: boolean;
  message: string;
}

export interface AdminPolicyRow {
  id: string;
  title: string;
  category: string;
  mandatoryUnder: string | null;
  pdfUrl: string | null;
  updatedAt: string;
}

const SUPABASE_UNCONFIGURED =
  "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.";

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "policy"
  );
}

/* ─── Categories (dropdown source) ──────────────────────────────────────
   Always offers the 3 seed categories, plus any others created since.
   Seed order first, then DB extras — deduped by name. */
export async function listPolicyCategories(): Promise<string[]> {
  const merged = [...SEED_CATEGORIES] as string[];
  if (!isSupabaseAdminConfigured) return merged;
  const supabase = getSupabaseAdmin();
  if (!supabase) return merged;

  const { data } = await supabase
    .from("policy_categories")
    .select("name, sort_order")
    .order("sort_order", { ascending: true });
  if (!data) return merged;

  const seen = new Set(merged);
  for (const row of data) {
    const name = String(row.name);
    if (!seen.has(name)) {
      merged.push(name);
      seen.add(name);
    }
  }
  return merged;
}

/** Get-or-create a category by name; returns its id (or null on failure). */
async function resolveCategoryId(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  rawName: string
): Promise<string | null> {
  const name = rawName.trim();
  if (!name) return null;

  const { data: existing } = await supabase
    .from("policy_categories")
    .select("id")
    .eq("name", name)
    .maybeSingle();
  if (existing?.id) return String(existing.id);

  // New category — append after the current highest sort_order.
  const { data: last } = await supabase
    .from("policy_categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSort = (last?.sort_order != null ? Number(last.sort_order) : -1) + 1;

  const { data: inserted, error } = await supabase
    .from("policy_categories")
    .insert({ name, sort_order: nextSort })
    .select("id")
    .single();
  if (error || !inserted?.id) return null;
  return String(inserted.id);
}

/* ─── Submit a policy ───────────────────────────────────────────────── */
export async function submitPolicy(
  formData: FormData
): Promise<PolicySubmitResult> {
  await requireAdmin();
  if (!isSupabaseAdminConfigured) {
    return { ok: false, message: SUPABASE_UNCONFIGURED };
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase client unavailable." };

  // The PDF was uploaded straight to Storage from the browser (bypassing the
  // 4.5 MB Server-Action body cap); we get only a reference to it here. Every
  // failure below removes the staged object so an abandoned submit leaves
  // nothing behind — a policy is stored ONLY when this action succeeds.
  const ref = parseStagedRef({
    bucket: formData.get("stagingBucket"),
    path: formData.get("stagingPath"),
  });
  if (!ref) {
    return { ok: false, message: "The policy PDF is required." };
  }
  const fail = async (message: string): Promise<PolicySubmitResult> => {
    await removeStagedFile(ref);
    return { ok: false, message };
  };

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const mandatoryUnder =
    String(formData.get("mandatoryUnder") ?? "").trim() || null;

  if (!title) return fail("Policy title is required.");
  if (!category) return fail("A category is required.");

  const categoryId = await resolveCategoryId(supabase, category);
  if (!categoryId) {
    return fail("Could not resolve or create the category.");
  }

  // Commit the staged PDF to a unique, readable final name (this deletes it
  // from staging). randomUUID avoids collisions on same-titled uploads.
  const objectPath = `${slugify(title)}-${crypto.randomUUID().slice(0, 8)}.pdf`;
  let publicUrl: string;
  try {
    publicUrl = await commitStagedFile(ref, objectPath);
  } catch (err) {
    return fail(
      `Storage upload failed: ${
        err instanceof Error ? err.message : "unknown error"
      }`
    );
  }

  // Place the new policy at the end of its category.
  const { data: last } = await supabase
    .from("policy_documents")
    .select("sort_order")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSort = (last?.sort_order != null ? Number(last.sort_order) : -1) + 1;

  const { error } = await supabase.from("policy_documents").insert({
    title,
    category_id: categoryId,
    mandatory_under: mandatoryUnder,
    pdf_url: publicUrl,
    pdf_filename:
      String(formData.get("fileName") ?? "").trim() || `${objectPath}`,
    sort_order: nextSort,
  });
  if (error) {
    // The PDF is already committed; drop it so a failed insert leaves no orphan.
    await removeStagedFile({ bucket: ref.bucket, path: objectPath });
    return { ok: false, message: `Save failed: ${error.message}` };
  }

  revalidatePath("/investor-relations");
  return { ok: true, message: `Saved "${title}".` };
}

/* ─── List policies (admin repository) ──────────────────────────────── */
export async function listPolicies(): Promise<AdminPolicyRow[]> {
  if (!isSupabaseAdminConfigured) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("policy_documents")
    .select(
      "id, title, mandatory_under, pdf_url, updated_at, policy_categories(name, sort_order)"
    )
    .eq("is_deleted", false)
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => {
    const cat = r.policy_categories as
      | { name?: unknown }
      | { name?: unknown }[]
      | null;
    const catObj = Array.isArray(cat) ? cat[0] : cat;
    return {
      id: String(r.id),
      title: String(r.title),
      category: catObj?.name != null ? String(catObj.name) : "Uncategorised",
      mandatoryUnder: r.mandatory_under ? String(r.mandatory_under) : null,
      pdfUrl: r.pdf_url ? String(r.pdf_url) : null,
      updatedAt: String(r.updated_at),
    };
  });
}

/* ─── Edit a policy's details (title / category / mandatory-under) ──────
   Never touches the PDF. The category is resolved by name (get-or-create),
   so re-filing under a brand-new category works the same as picking one. */
export interface UpdatePolicyInput {
  id: string;
  title: string;
  category: string;
  mandatoryUnder: string;
}

export async function updatePolicy(
  input: UpdatePolicyInput
): Promise<PolicySubmitResult> {
  await requireAdmin();
  if (!isSupabaseAdminConfigured) {
    return { ok: false, message: SUPABASE_UNCONFIGURED };
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase client unavailable." };

  const id = String(input.id ?? "").trim();
  const title = String(input.title ?? "").trim();
  const category = String(input.category ?? "").trim();
  const mandatoryUnder = String(input.mandatoryUnder ?? "").trim() || null;

  if (!id) return { ok: false, message: "Missing policy id." };
  if (!title) return { ok: false, message: "Policy title is required." };
  if (!category) return { ok: false, message: "A category is required." };

  const categoryId = await resolveCategoryId(supabase, category);
  if (!categoryId) {
    return { ok: false, message: "Could not resolve or create the category." };
  }

  const { data, error } = await supabase
    .from("policy_documents")
    .update({
      title,
      category_id: categoryId,
      mandatory_under: mandatoryUnder,
    })
    .eq("id", id)
    .select("id");
  if (error) return { ok: false, message: `Update failed: ${error.message}` };
  if (!data || data.length === 0) {
    return { ok: false, message: "Policy not found." };
  }

  revalidatePath("/investor-relations");
  return { ok: true, message: `Updated "${title}".` };
}

/* ─── Soft-delete a policy ─────────────────────────────────────────────
   Flips `is_deleted` so it drops off the site; the row + PDF stay in the DB. */
export async function deletePolicy(
  idRaw: string
): Promise<PolicySubmitResult> {
  await requireAdmin();
  if (!isSupabaseAdminConfigured) {
    return { ok: false, message: SUPABASE_UNCONFIGURED };
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase client unavailable." };

  const id = String(idRaw ?? "").trim();
  if (!id) return { ok: false, message: "Missing policy id." };

  const { data, error } = await supabase
    .from("policy_documents")
    .update({ is_deleted: true })
    .eq("id", id)
    .select("id");
  if (error) return { ok: false, message: `Delete failed: ${error.message}` };
  if (!data || data.length === 0) {
    return { ok: false, message: "Policy not found." };
  }

  revalidatePath("/investor-relations");
  return { ok: true, message: "Policy deleted." };
}
