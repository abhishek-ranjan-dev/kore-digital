import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/*
  Next 16 renamed the `middleware` file/function convention to `proxy`
  (middleware is deprecated). Same matcher API; runs on the Node.js runtime.

  Two jobs:
    1. Refresh an expiring Supabase session on every matched request
       (getUser() rotates the cookie when needed).
    2. Gate /admin — only the signed-in admin reaches the console; everyone
       else is bounced to /admin/login. Public admin sub-paths (login,
       forgot-password) stay reachable without a session.
*/
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Admin sub-paths that must remain reachable WITHOUT a session.
// NOTE: /admin/update-password is intentionally NOT here — it needs the
// recovery session established by the reset link (via /auth/callback).
const PUBLIC_ADMIN = ["/admin/login", "/admin/forgot-password"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: always call getUser() — it refreshes an expiring session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isPublicAdmin = PUBLIC_ADMIN.some((p) => pathname.startsWith(p));
  const isAdminUser = !!user && user.email === process.env.ADMIN_EMAIL;

  // Gate every /admin page except the login/forgot pages.
  if (isAdmin && !isPublicAdmin && !isAdminUser) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Already signed in? Skip the login/forgot pages.
  if (isPublicAdmin && isAdminUser) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  // Run on /admin (to gate) and /auth (to set session cookies on callback).
  matcher: ["/admin/:path*", "/auth/:path*"],
};
