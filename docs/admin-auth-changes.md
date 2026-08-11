# Admin auth — session change log

Implementation of real authentication for `/admin` (Supabase Auth, PKCE/SSR),
plus two request-count optimizations to the data console. Follows the plan in
[`admin-auth.md`](./admin-auth.md).

**Stack note:** Next.js 16.2.10. The biggest deviation from the original guide:
Next 16 **deprecated and renamed the `middleware` convention to `proxy`** — the
gate lives in `src/proxy.ts` (function `proxy`), not `src/middleware.ts`. Also
in Next 16, `cookies()` is async.

---

## 1. New files

| File | What it does |
|---|---|
| `src/lib/supabase/auth-browser.ts` | Browser-side Supabase auth client (cookie-aware, PKCE). Used by the login / forgot / update-password forms. |
| `src/lib/supabase/auth-server.ts` | Server-side Supabase auth client that reads/writes the session from httpOnly cookies. Used by the proxy, callback route, sign-out action, and `requireAdmin`. |
| `src/lib/supabase/require-admin.ts` | Server guard — throws unless the caller is the signed-in admin. Called first in every write/AI action. |
| `src/proxy.ts` | The `/admin` gate + session refresh (Next 16's renamed middleware). |
| `src/app/auth/callback/route.ts` | PKCE code-exchange route the password-reset email link lands on. |
| `src/app/admin/auth-actions.ts` | `signOut` server action. |
| `src/app/admin/_auth/AuthShell.tsx` | Shared presentational shell (centered card, dark/emerald theme) for the three auth pages. |
| `src/app/admin/login/page.tsx` | Sign-in page. |
| `src/app/admin/forgot-password/page.tsx` | Request-a-reset-link page. |
| `src/app/admin/update-password/page.tsx` | Set-a-new-password page (used from the reset link and by a signed-in admin). |

### Functions in the new files

| Function | File | Explanation |
|---|---|---|
| `createAuthBrowserClient()` | `auth-browser.ts` | Returns a `@supabase/ssr` browser client built from the Supabase URL + **publishable/anon** key (never the service role). The client stores the session in httpOnly cookies using PKCE, so the server can read it. |
| `createAuthServerClient()` | `auth-server.ts` | `async`. Awaits Next 16's `cookies()` and returns a `createServerClient` wired to `getAll`/`setAll` over that cookie store. `setAll` is wrapped in try/catch because cookie **writes** are illegal during Server Component render in Next 16 — that case is swallowed and the proxy refreshes cookies on the next request instead. |
| `requireAdmin()` | `require-admin.ts` | Calls `supabase.auth.getUser()` and throws `"Unauthorized"` unless a user exists **and** `user.email === process.env.ADMIN_EMAIL`. Defense-in-depth: server actions are POST endpoints reachable directly, so each one re-checks rather than trusting the proxy alone. Returns the `user` on success. |
| `proxy(request)` | `proxy.ts` | Runs on `/admin/*` and `/auth/*`. (1) Always calls `getUser()`, which rotates an expiring session cookie. (2) Gates access: any `/admin` path that isn't `login`/`forgot-password` and isn't the admin → redirect to `/admin/login`; a signed-in admin visiting `login`/`forgot-password` → redirect to `/admin`. Uses the request/response cookie APIs (not `next/headers`), per the proxy contract. |
| `config` (export) | `proxy.ts` | `matcher: ["/admin/:path*", "/auth/:path*"]` — limits the proxy to the admin gate and the auth callback. |
| `GET(request)` | `auth/callback/route.ts` | Reads `?code` and `?next`. Exchanges the one-time PKCE `code` for a cookie session via `exchangeCodeForSession` (setting cookies is allowed in a Route Handler), then redirects to `next` (default `/admin`). On missing/failed code → `/admin/login?error=link`. |
| `signOut()` | `auth-actions.ts` | Server action. Clears the Supabase session cookies (`auth.signOut()`) and `redirect("/admin/login")`. |
| `AuthShell({title, subtitle, children, footer})` | `_auth/AuthShell.tsx` | Presentational wrapper: brand mark + titled card + optional footer, on the admin dark/emerald palette. No logic — pages own their forms. |
| `LoginPage()` | `login/page.tsx` | Controlled email/password form → `signInWithPassword`. On error shows a generic "Invalid email or password." On success `router.replace("/admin")` (no `refresh()` — see §3). Links to forgot-password. |
| `ForgotPasswordPage()` | `forgot-password/page.tsx` | Emails a reset link via `resetPasswordForEmail`, with `redirectTo` pointing at `/auth/callback?next=/admin/update-password`. Always shows the same "if an account exists…" confirmation (no user enumeration). |
| `UpdatePasswordPage()` | `update-password/page.tsx` | New-password + confirm form. Validates min length (8) and match, then `updateUser({ password })`, then `router.replace("/admin")`. |

---

## 2. Modified files — auth guards

`await requireAdmin()` was added as the first line of every **mutating** and
**AI-parse** server action. Read-only list actions were intentionally left
unguarded (they already run behind the proxy; guarding them is harmless but
unnecessary).

| File | Functions guarded (what each does) |
|---|---|
| `src/app/admin/financials-actions.ts` | `submitAnnualReport` (insert a fiscal year's figures + upload PDF), `updateAnnualReport` (edit figures only, re-derive margins), `deleteAnnualReport` (soft-delete via `is_deleted`). Added the `requireAdmin` import. |
| `src/app/admin/policies-actions.ts` | `submitPolicy` (create policy + upload PDF, get-or-create category), `updatePolicy` (edit title/category/mandatory-under), `deletePolicy` (soft-delete). Added the `requireAdmin` import. |
| `src/app/admin/report-ai-actions.ts` | `parseReportPdf` (Gemini extract of annual-report figures). Added the `requireAdmin` import. |
| `src/app/admin/policy-ai-actions.ts` | `parsePolicyPdf` (Gemini extract of policy metadata). Added the `requireAdmin` import. |

---

## 3. Modified files — `src/app/admin/page.tsx`

Two kinds of change: wire in auth UI, and cut redundant mount requests.

| Change | Detail |
|---|---|
| Sign-out button | Added a `<form action={signOut}>` with a ghost "Sign out" button (+ `LogOut` icon) to the console header. |
| Comment corrected | The stale "No application-level auth: gate at the deployment layer" note now describes the Supabase gate. |
| **Lifted the AI flag** | `reportAiEnabled()` and `policyAiEnabled()` both read the *same* `GEMINI_API_KEY`, so instead of each card fetching it on mount, `Dashboard` fetches it **once** into an `aiEnabled` state and passes it down as a prop. |
| Removed dead import | `policyAiEnabled` is no longer imported here. |

**Functions affected in `page.tsx`:**

- **`Dashboard()`** — added `aiEnabled` state and a single `useEffect` that calls `reportAiEnabled()` once; passes `aiEnabled` to both cards. (Its existing `refreshAll` — the parallel `listAnnualReports`/`listPolicies`/`listPolicyCategories` loader — is unchanged.)
- **`AnnualReportCard({reports, aiEnabled, onSubmitted})`** — now receives `aiEnabled` as a **prop**; its own `aiEnabled` state and the `useEffect` that fetched it were removed. Behavior (Gemini "Magic AI extraction" gating) is identical.
- **`PolicyUploadCard({categories, aiEnabled, onUploaded})`** — same change: `aiEnabled` is now a prop, local state + effect removed.

---

## 4. Modified files — login request optimization

| File | Change |
|---|---|
| `src/app/admin/login/page.tsx` | Removed the redundant `router.refresh()` after `router.replace("/admin")`. `replace` already does a fresh server round-trip carrying the new session cookie, and the dashboard loads its data client-side on mount — so `refresh()` was firing a duplicate `admin?_rsc` for nothing. |

**Net request reduction per login:** one fewer `admin?_rsc` navigation fetch, and
one fewer mount server-action (two `*AiEnabled` calls → one). The larger volume
seen in dev is React **Strict Mode** double-invoking effects and halves in a
production build.

---

## 5. Modified files — docs & dependencies

| File | Change |
|---|---|
| `docs/admin-auth.md` | §4 + security checklist reworded to use Supabase's **built-in mailer** (rare resets) instead of requiring custom SMTP, with dashboard password-reset as the lockout fallback. §7 + file-list updated for the Next 16 **middleware → proxy** rename. |
| `package.json` / `package-lock.json` | Added `@supabase/ssr@^0.12.4`. |

---

## 6. Configuration (done outside the codebase)

Already set by the operator: `ADMIN_EMAIL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
in `.env.local`; sign-ups disabled; single admin user created; Supabase Redirect
URLs allow-list includes `http://localhost:3000/auth/callback` and the prod
`…/auth/callback`.

---

## 7. Verification

- `npx tsc --noEmit` — clean.
- `npm run build` — succeeds; routes `/admin`, `/admin/login`, `/admin/forgot-password`, `/admin/update-password`, `/auth/callback` present; `ƒ Proxy (Middleware)` active.
- Runtime probes (unauthenticated): `/admin` → 307 `/admin/login`; login & forgot pages → 200; `/admin/update-password` → 307 `/admin/login`; `/auth/callback` (no code) → 307 `/admin/login?error=link`.
