"use client";

import { createBrowserClient } from "@supabase/ssr";

/*
  Browser auth client (@supabase/ssr) for the /admin login, forgot-password and
  update-password forms. Cookie-aware and PKCE by default: the session lives in
  httpOnly cookies that the server (proxy + server actions) can read.

  Uses the browser-safe publishable/anon key — the SAME key the public read
  client already uses. The service-role key is NEVER used for auth.
*/
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export function createAuthBrowserClient() {
  return createBrowserClient(url, key);
}
