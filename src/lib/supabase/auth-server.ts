import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/*
  Server auth client (@supabase/ssr) for server components, server actions and
  the /auth/callback route. Reads/writes the user session from httpOnly cookies.

  Uses the browser-safe publishable/anon key (not the service role). Next 16:
  `cookies()` is async and cookie writes are only permitted from a Server Action
  or Route Handler — a write attempted during Server Component render throws, so
  `setAll` swallows that; the proxy refreshes the session cookies on the next
  request instead.
*/
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function createAuthServerClient() {
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component (cookies are read-only there in
          // Next 16) — safe to ignore; the proxy refreshes on the next request.
        }
      },
    },
  });
}
