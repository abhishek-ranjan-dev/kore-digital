import { NextResponse, type NextRequest } from "next/server";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

/*
  PKCE code exchange. The reset-password email link hits Supabase, which
  redirects here with `?code=…`. We exchange that one-time code for a cookie
  session (setting httpOnly cookies is allowed in a Route Handler), then forward
  to `next` — the update-password page, now authenticated.
*/
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createAuthServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/admin/login?error=link`);
}
