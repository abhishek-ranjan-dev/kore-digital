# Plan — Annual-report submissions via /admin → Supabase → live IR page

## Context

Today the `/admin` console only writes PDFs to `public/documents/…` via `fs.writeFile` (which is **read-only on Vercel**, where this deploys — so submissions can't persist in production). The financial figures the public site shows are **not connected to that upload at all**: they live as hand-authored static data (`src/data/financials.ts`) plus **hardcoded inline literals** duplicated across the IR and About pages. So "submit a new annual report and the site updates" does not exist.

Goal: turn an annual-report submission into a single admin form (PDF + figures) that saves to **Supabase** (Storage + Postgres), and make the **investor-relations page read those figures live** so it updates automatically on submit. Deploy target is Vercel, so Supabase replaces the filesystem for both the PDF and the data.

**Confirmed decisions:** capture **both** standalone + consolidated figures; wire the **IR page only** (About page stays hardcoded — see Out of scope); **all** annual-report PDFs live in Supabase Storage (migrate the existing 4).

---

## Part 1 — What annual-report data is used, and where (current state)

**Source of truth today:** `src/data/financials.ts`
- `FinancialYear` (per year, **standalone**): `year`, `revenue`, `revenueGrowth`, `longTermBorrowings`, `workInProgress`, `netWorth`, `annualReportUrl`, `isProjected`. 4 rows FY19-20 → FY23-24.
- `keyMetrics` (corporate constants, not from the annual report): order book, fiber km, datacenter, ISIN, ticker.

**Where standalone figures render (data-driven, all read `financials`):**
- `src/app/investor-relations/page.tsx` → `FinancialsView`: **historical table** (revenue/YoY/LT borrowings/WIP/net worth), **annual-reports card grid**, and `ReportDrawer` (PDF iframe from `annualReportUrl` + "Standalone Highlights").
- `src/components/ir/RevenueTrajectory.tsx` → the IR **revenue chart** (revenue bars, net-worth line, growth tooltip).
- `src/components/home/MetricExplorer.tsx` → home scrubber (out of scope this round).

**Where FY24-25 consolidated headline figures render (HARDCODED, duplicated, NOT in any data file):**
- `src/app/investor-relations/page.tsx` `HEADLINE_METRICS` (lines ~82-92) → the FY25 **scorecard**: Total Income ₹327.82 Cr (+212%), Operational EBITDA ₹47.55 Cr (+178%), PAT ₹31.70 Cr (+176%), EBITDA margin 14.50%. Plus inline `₹0.88 → ₹103.51 Cr`, `≈117×`.
- `src/app/about/page.tsx` stat array (lines ~484-504) → same figures + FY24 comparatives (₹105.08/₹17.08/₹11.49 Cr) + `9.67% margin`. **(Out of scope — stays hardcoded.)**

**PDFs:** `public/documents/annual-reports/` (4 files), referenced by `annualReportUrl`. Uploaded via `uploadDocument` server action (`src/app/admin/actions.ts`) which writes to disk only — no figure capture, no data-file update.

---

## Part 2 — The submission form (inputs)

One "Annual Report" submission in `/admin` captures:

| Field | Type | Notes |
|---|---|---|
| Fiscal year | text/select, e.g. `FY24-25` | **Required, unique key** (upsert on this) |
| Fiscal year-end | date, e.g. `2025-03-31` | Sort key; can be derived from fiscal year |
| PDF file | file (drag-drop) | PDF only, ≤25 MB — reuse existing dropzone + validation |
| **Standalone (₹ Cr)** | numeric, nullable | Revenue · Net Worth · Long-Term Borrowings · Work-in-Progress |
| **Consolidated (₹ Cr)** | numeric, nullable | Total Income · Operational EBITDA · Profit After Tax |
| EBITDA margin % / PAT margin % | numeric | Auto-fill = figure ÷ Total Income × 100, editable |
| Is projected | checkbox | default false |

**Not entered — derived at read time** (preserves current data-discipline): `revenueGrowth` and the consolidated YoY deltas (+212% etc.) are computed from the immediately-prior fiscal year's row, so they're never hand-typed or stale.

---

## Part 3 — Supabase (schema, storage, access)

**Table `annual_reports`** (one row per fiscal year; holds both bases):
```
id                    uuid pk default gen_random_uuid()
fiscal_year           text unique not null        -- "FY24-25"
fiscal_year_end       date                         -- ordering
revenue               numeric        -- standalone
net_worth             numeric
long_term_borrowings  numeric
work_in_progress      numeric
total_income          numeric        -- consolidated
operational_ebitda    numeric
pat                    numeric
ebitda_margin         numeric
pat_margin            numeric
pdf_path              text           -- Storage object path
pdf_filename          text
is_projected          boolean default false
created_at            timestamptz default now()
updated_at            timestamptz default now()
```
- **RLS on**: public `SELECT` policy for `anon` (figures are public); writes only via **service-role** (bypasses RLS). No public insert/update.
- **Storage bucket `annual-reports`** (public read) — new uploads + the migrated 4 existing PDFs; served via `getPublicUrl()` into the drawer iframe/download.

**Access layer (server-only):**
- `src/lib/supabase/server.ts` — `supabaseAdmin` (service-role, for writes/storage) and `supabaseRead` (anon, for reads). Service-role key is **never** `NEXT_PUBLIC`.
- `src/lib/financials.ts` — `getAnnualReports()`: reads rows ordered by `fiscal_year_end`, maps to the app shapes, **derives** `revenueGrowth` + consolidated deltas from consecutive rows, resolves `annualReportUrl` from Storage. Returns `{ financials: FinancialYear[], latestConsolidated }` (the latter replaces `HEADLINE_METRICS`). Reuses the `FinancialYear` interface.

---

## End-to-end flow

1. Admin unlocks `/admin` (existing `ADMIN_ACCESS_KEY` passcode), fills the Annual Report form, drops the PDF, submits.
2. New server action **`submitAnnualReport(formData)`**: re-verify passcode → validate figures + PDF (reuse MIME/size/sanitize checks) → `supabaseAdmin.storage.upload("annual-reports/{fiscalYear}.pdf", …, {upsert:true})` → **upsert** the row (`on conflict fiscal_year`) with figures + `pdf_path` → `revalidatePath('/investor-relations')` → return result.
3. IR page (server component) re-renders from Supabase on next request (immediate via `revalidatePath`, plus `export const revalidate = 300` fallback). The new/updated year appears in the historical table, revenue chart, annual-reports grid + drawer, and — if it's the latest — the FY25 scorecard, all from one source.

**IR page refactor (recommended):** split the current client page into a thin **server component** `src/app/investor-relations/page.tsx` that calls `getAnnualReports()` and renders `InvestorRelationsClient` with the data as props (keeps SSR/SEO of the figures + on-demand revalidation). `RevenueTrajectory` and the scorecard take `financials`/`latestConsolidated` as **props** instead of importing static data.
*Alternative (lower-effort, weaker SEO):* keep the page client and add a `/api/financials` route handler (mirrors the existing `/api/stock` + client-fetch pattern in `InvestorStockSection.tsx`); components fetch it. Chosen approach is the server wrapper; note the fallback if the refactor proves too invasive.

---

## Files

**Create:**
- `src/lib/supabase/server.ts` — admin + read clients
- `src/lib/financials.ts` — `getAnnualReports()` + derivations
- `supabase/migrations/0001_annual_reports.sql` — table + RLS + bucket (also runnable in Supabase SQL editor)
- `scripts/seed-financials.mjs` — upload the 4 existing PDFs to Storage + insert the 4 standalone rows (from current `financials.ts`) + a FY24-25 row seeded with the known consolidated figures (from `HEADLINE_METRICS`) so the scorecard keeps working until the real FY24-25 report is submitted
- `src/app/investor-relations/InvestorRelationsClient.tsx` — current page body, props-driven
- `src/app/admin/actions.financials.ts` — `submitAnnualReport`, `listAnnualReports`
- `.env.example` — documents the env vars

**Modify:**
- `src/app/investor-relations/page.tsx` → server component (fetch + `revalidate` + render client)
- `src/components/ir/RevenueTrajectory.tsx` → accept `financials` prop
- `src/app/admin/page.tsx` → add the Annual Report figures form (extend `UploadConsole`; reuse dropzone/underline inputs/`useTransition`); repository log lists Supabase rows for annual reports
- `package.json` → add `@supabase/supabase-js` (+ optional `zod` for figure validation)
- `src/data/financials.ts` → retained as the **seed source** + `FinancialYear` interface home; public pages stop importing it directly

**Env vars (add to `.env.local`, gitignored; document in `.env.example`):**
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only), keep `ADMIN_ACCESS_KEY`.

---

## Verification

1. Create a Supabase project; put keys in `.env.local`. Run the migration (SQL editor) + `node scripts/seed-financials.mjs`; confirm the bucket has 4 PDFs and the table has 5 rows.
2. `npm run dev` → IR page renders the seeded figures (table, chart, scorecard, report grid) identically to today; drawer PDFs open from Storage URLs.
3. In `/admin`, submit a test FY24-25 annual report (PDF + figures) → success; the IR page reflects the new/updated year (table row, chart bar, scorecard, report card + drawer) after `revalidatePath`.
4. Re-submit the same fiscal year with edited figures → row **upserts**, page updates (no duplicate).
5. `npx tsc --noEmit` clean, `npx eslint` clean on changed files, IR page + `/admin` return HTTP 200.
6. Confirm the service-role key never reaches the client bundle (grep built output; it must be server-only).

---

## Out of scope / notes

- **About page FY25 figures stay hardcoded** (per decision) — they will **not** auto-update and can drift from the IR page; flag for a later pass if single-source is wanted there too.
- **Policy-doc uploads** still use `fs.writeFile` (also broken on Vercel) — unchanged this round; a follow-up should move them to Storage too.
- **Auth** remains the single shared `ADMIN_ACCESS_KEY` passcode; service-role writes are server-side only. Proper admin auth is a future upgrade, not this task.
- Home `MetricExplorer` / `HeroDark` keep their current static/hardcoded figures (IR-only scope).
