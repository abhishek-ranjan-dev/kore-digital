# Admin authentication — implementation guide

How to add real authentication to `/admin`, replacing the current
"protect at the deployment layer" note. Single admin, email + password,
**no sign-up** — only **sign in**, **forgot password**, and **update
password**.

Built on Supabase Auth using the **PKCE / SSR flow** (`@supabase/ssr`), because
the session must be readable on the server (middleware, server components,
server actions) — see the flow rationale in the "Why PKCE/SSR" note at the end.

---

## 1. Goals & constraints

| Requirement | How it's met |
|---|---|
| One admin account only | Create the single user in the Supabase dashboard; **disable sign-ups** so no others can be created |
| No sign-up UI | We never call `signUp()`; there is no register page |
| Sign in | `signInWithPassword({ email, password })` |
| Forgot password | `resetPasswordForEmail(email, { redirectTo })` → emailed recovery link |
| Update password | `updateUser({ password })` on an authenticated recovery session |
| Server-enforced | Cookie session (PKCE) → middleware gates `/admin`, actions re-check identity |

---

## 2. How it fits the current architecture

Nothing about the data layer changes. We **add** an auth layer:

- Keep `getSupabaseAdmin()` (service-role) for privileged **writes** — but now it
  runs only behind the auth gate, and each write action re-verifies the admin.
- Add **auth clients** (`@supabase/ssr`) that manage the *user session* in
  httpOnly cookies: a browser client (for the login/password forms) and a
  server client (for middleware, the callback route, and the `requireAdmin`
  guard).

```
Browser ──(email+password)──▶ /admin/login (client) ── signInWithPassword
                                     │
                              Supabase Auth sets httpOnly cookies (PKCE)
                                     │
        every /admin request ▶ middleware.ts ── getUser() from cookies
                                     │  (not admin? → redirect /admin/login)
                                     ▼
                              /admin pages + Server Actions
                                     │  requireAdmin() re-checks
                                     ▼
                              getSupabaseAdmin() writes (service role)
```

---

## 3. Supabase dashboard setup (one-time)

1. **Disable sign-ups** — Authentication → Providers → **Email** →
   turn **"Allow new users to sign up" OFF**. This is what enforces
   "no sign-up": even if `signUp()` were called, it's rejected.
2. **Create the admin user** — Authentication → Users → **Add user** →
   enter the admin email + a temporary password (check "Auto Confirm User"
   so no confirmation email is needed). The admin can change it later via
   the update-password page.
3. **Site URL & Redirect URLs** — Authentication → URL Configuration:
   - **Site URL**: your production origin (e.g. `https://kore-digital.example`).
   - **Redirect URLs**: add
     `https://<prod-origin>/auth/callback` and, for local dev,
     `http://localhost:3000/auth/callback`.
     (The password-reset link is only allowed to redirect to listed URLs.)
4. **Email delivery** — the **built-in Supabase mailer** (~2 emails/hour,
   best-effort, shared sending domain) is sufficient for this single-admin panel:
   password resets are rare, so the hourly cap is a non-issue. **No setup needed.**
   Custom SMTP (Authentication → Emails → SMTP Settings; Resend/SES/Postmark/etc.)
   is optional — only worth it later if you want reliable/branded delivery.
   If a reset email ever fails to arrive, reset the password directly from the
   dashboard (Authentication → Users → the admin user → set a new password), so
   the email flow is a convenience, not a single point of lockout.
5. **Password policy** (optional) — Authentication → Providers → Email →
   set a minimum length / strength.
6. (Optional) **CAPTCHA** — Authentication → Attack Protection → enable
   hCaptcha/Turnstile on the login + reset forms to blunt brute-force.

---

## 4. Environment variables

Add to `.env.local` (and the Vercel project). No new secrets besides the admin
email; the Supabase keys already exist.

```bash
# The single allowed admin (server-side check; not exposed to the browser)
ADMIN_EMAIL=admin@koredigital.com

# already present:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...   (browser-safe read/auth key)
# SUPABASE_SERVICE_ROLE_KEY=...              (server-only writes)
```

> The auth clients use the **publishable/anon** key — the same browser-safe key
> the public read client already uses. The service-role key is **not** used for
> auth.

---

## 5. Install the SSR helper

```bash
npm install @supabase/ssr
```

`@supabase/ssr` is the cookie-aware wrapper around `@supabase/supabase-js` for
Next.js App Router. It defaults to PKCE and stores the session in httpOnly
cookies.

---

## 6. Auth clients

Add two small modules. Reuse the existing key resolution from
`src/lib/supabase/server.ts` (which already accepts the publishable key name).

### `src/lib/supabase/auth-browser.ts` (client components)

```ts
"use client";
import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export function createAuthBrowserClient() {
  return createBrowserClient(url, key);
}
```

### `src/lib/supabase/auth-server.ts` (server components / actions / routes)

```ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Next 16: cookies() is async.
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
          // Called from a Server Component (read-only cookies) — safe to ignore;
          // the middleware refreshes the session cookies on the next request.
        }
      },
    },
  });
}
```

---

## 7. Proxy — session refresh + `/admin` gate

> **Next 16 note:** the `middleware` file/function convention is **deprecated
> and renamed to `proxy`**. We ship `src/proxy.ts` exporting a `proxy()`
> function (not `src/middleware.ts` / `middleware()`). The `config.matcher` API
> is unchanged and it runs on the Node.js runtime. Everything else below is the
> same; only the file name and function name differ.

`src/proxy.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Admin sub-paths that must remain reachable WITHOUT a session.
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
  const isAdminUser = user?.email === process.env.ADMIN_EMAIL;

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
```

Notes:
- `/admin/update-password` is intentionally **not** in `PUBLIC_ADMIN` — it
  requires the recovery session established by the reset link.
- The email check (`user.email === ADMIN_EMAIL`) is belt-and-suspenders: with
  sign-ups disabled and one user, it's the only account — but the check means a
  second account (if ever created) still can't reach `/admin`.

---

## 8. Pages & routes

### 8a. Sign in — `src/app/admin/login/page.tsx` (client)

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthBrowserClient } from "@/lib/supabase/auth-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createAuthBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setError("Invalid email or password.");
    router.replace("/admin");
    router.refresh(); // re-run server components with the new session
  }

  return (
    <form onSubmit={onSubmit}>
      {/* email + password inputs, submit button, {error}, link to /admin/forgot-password */}
    </form>
  );
}
```

### 8b. Forgot password — `src/app/admin/forgot-password/page.tsx` (client)

```tsx
"use client";
// ...
async function onSubmit(e) {
  e.preventDefault();
  const supabase = createAuthBrowserClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/auth/callback?next=/admin/update-password`,
  });
  // Always show the same "if an account exists, we've emailed a link" message —
  // resetPasswordForEmail never reveals whether the address exists.
  setSent(true);
}
```

### 8c. Callback — `src/app/auth/callback/route.ts` (exchanges the code)

```ts
import { NextResponse, type NextRequest } from "next/server";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

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
```

The reset email link hits Supabase → redirects here with `?code=…` → we exchange
it for a **cookie session** (PKCE) → redirect to `/admin/update-password`, which
is now authenticated.

### 8d. Update password — `src/app/admin/update-password/page.tsx` (client)

Used both from the recovery link and by an already-signed-in admin.

```tsx
"use client";
// ...
async function onSubmit(e) {
  e.preventDefault();
  const supabase = createAuthBrowserClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return setError(error.message);
  router.replace("/admin");
  router.refresh();
}
```

> Optional hardening: when the admin changes their password *while already
> signed in* (not via a reset link), pass `current_password` too so a stolen
> live session can't silently reset it:
> `updateUser({ password, current_password })`.

### 8e. Sign out — a Server Action

`src/app/admin/auth-actions.ts`

```ts
"use server";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

export async function signOut() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
```

Wire a "Sign out" button in the admin header `<form action={signOut}>`.

---

## 9. Lock the Server Actions (defense in depth)

Middleware gates page navigation, but Server Actions are POST endpoints — guard
them directly too. Add:

`src/lib/supabase/require-admin.ts`

```ts
import { createAuthServerClient } from "./auth-server";

/** Throws unless the caller is the signed-in admin. Call at the top of every
    write action. */
export async function requireAdmin() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }
  return user;
}
```

Then in each mutating action (`submitAnnualReport`, `updateAnnualReport`,
`deleteAnnualReport`, `submitPolicy`, `updatePolicy`, `deletePolicy`, and the
AI `parse*Pdf` actions), add as the first line:

```ts
await requireAdmin();
```

Read-only list actions can stay as-is, but guarding them too is harmless.

---

## 10. What happens to the service-role key?

Two valid options — pick one:

- **A (recommended, minimal): keep `getSupabaseAdmin()` for writes**, now behind
  the middleware gate **and** `requireAdmin()`. Simplest; no RLS changes. The
  service-role key stays server-only.
- **B (stricter): migrate writes to the authenticated user client + RLS.** Add
  RLS `insert/update/delete` policies scoped to the admin (e.g.
  `auth.jwt()->>'email' = '<admin>'` or a custom claim/role) and use the
  `@supabase/ssr` server client for writes instead of the service role. Removes
  the all-powerful key from write paths, at the cost of writing/maintaining RLS
  policies + Storage policies.

Start with **A**; move to **B** if you later want to eliminate the service-role
key from request paths entirely.

---

## 11. Security checklist

- [ ] Sign-ups disabled in the dashboard (no self-registration).
- [ ] Only one confirmed user exists (the admin).
- [ ] `ADMIN_EMAIL` set in every environment; email checked in middleware **and**
      `requireAdmin()`.
- [ ] Email delivery decided: built-in mailer is fine here (rare resets);
      dashboard password-reset is the fallback if an email doesn't arrive.
- [ ] Redirect URLs allow-list contains only your `/auth/callback` origins.
- [ ] Reset flow shows a generic "if an account exists…" message (no user
      enumeration — Supabase already avoids leaking this).
- [ ] Rate limiting / CAPTCHA on login + reset (Attack Protection).
- [ ] Service-role key remains server-only (never imported by client code).
- [ ] `/admin` stays `noindex` + robots-disallowed (already in place).

---

## 12. New / changed files at a glance

```
package.json                              + @supabase/ssr
.env.local / Vercel env                   + ADMIN_EMAIL
src/proxy.ts                              NEW  (gate /admin, refresh session; Next 16 renamed middleware→proxy)
src/lib/supabase/auth-browser.ts          NEW  (browser auth client)
src/lib/supabase/auth-server.ts           NEW  (server auth client, cookies)
src/lib/supabase/require-admin.ts         NEW  (server-action guard)
src/app/auth/callback/route.ts            NEW  (PKCE code exchange)
src/app/admin/login/page.tsx              NEW
src/app/admin/forgot-password/page.tsx    NEW
src/app/admin/update-password/page.tsx    NEW
src/app/admin/auth-actions.ts             NEW  (signOut)
src/app/admin/*-actions.ts                EDIT (await requireAdmin() at top of writes)
src/app/admin/page.tsx                    EDIT (add Sign out button)
```

`src/lib/supabase/server.ts` (service-role + read clients) is unchanged.

---

## Why PKCE / SSR (recap)

The session must be **server-readable** so middleware can gate `/admin`, server
actions can verify the admin, and the reset link can establish a protected
session. PKCE stores the session in **httpOnly cookies** (server-readable,
XSS-safe) and exchanges a one-time `code` server-side. The implicit flow keeps
the token in browser `localStorage` — invisible to the server and unusable for
any of the above. `@supabase/ssr` uses PKCE by default for exactly this reason.
