import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
  Supabase clients — server-only. Two roles:
    • getSupabaseRead()  — anon key, used by the public data-access layer.
    • getSupabaseAdmin() — service-role key, used by admin Server Actions for
      writes + Storage. NEVER import this into a client component; the service
      key must not reach the browser bundle.

  Both return null when the corresponding env vars are absent, so the app runs
  (falling back to seed data) without any Supabase configuration.
*/
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Accept both the legacy `anon` name and Supabase's newer `publishable` name
// for the browser-safe read key; likewise `service_role` / `secret` for writes.
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

export const ANNUAL_REPORTS_BUCKET = "annual-reports";
export const POLICIES_BUCKET = "policies";

/** True when at least a read client can be constructed. */
export const isSupabaseReadConfigured = Boolean(url && anonKey);

/** True when admin writes/storage are possible. */
export const isSupabaseAdminConfigured = Boolean(url && serviceKey);

export function getSupabaseRead(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
