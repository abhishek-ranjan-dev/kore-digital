"use server";

import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

/*
  Sign out — clears the Supabase session cookies (allowed in a Server Action)
  and redirects back to the login page.
*/
export async function signOut() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
