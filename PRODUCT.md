# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience: **institutional investors, equity analysts, and regulators** evaluating an NSE-listed company (NSE: KOREDIGIT). They arrive to verify audited performance, confirm statutory compliance, and assess the credibility of a fast-growing deep-tech infrastructure business. When audiences conflict, design optimizes for **institutional/regulatory credibility** — auditable, investment-grade trust — over retail persuasion or lead-gen.

Secondary audiences, served but not prioritized over the above:
- **Retail / individual shareholders** following the listed story.
- **Prospective business partners** (datacenter, fiber, aerospace/defence manufacturing) and enterprise enquiries.
- **Press.**

Internal, non-public: an `/admin` console for uploading disclosures and reports (not a marketing surface).

## Product Purpose

The corporate and investor-relations website for **Kore Digital Limited** — a multi-sector deep-tech infrastructure conglomerate building India's telecom, compute, precision-manufacturing, and clean-power layers. The site exists to (1) present the company's capabilities and growth story at investment grade, and (2) serve as the complete SEBI LODR Regulation 46 compliance repository — audited financials, Regulation 30 stock-exchange disclosures, annual reports, board composition, and statutory policies. Success = a visitor can quickly establish that Kore Digital is a real, listed, compliant, high-growth operator and find any required disclosure without friction.

## Positioning

A **vertically integrated "four pillars, one infrastructure fabric"** operator across the hardest-to-scale layers of India's digital economy — connectivity, compute, precision manufacturing, and clean power — where each segment is owned, monitored, and SLA-backed in-house rather than resold. Claims a neighbor could not truthfully copy:

- **701 km of owned, live underground fiber** on the Samruddhi Mahamarg corridor (6-duct backbone, 15-year concession, in-house NOC, 24/7 monitoring, 99.99% availability target), across 6 states.
- **1 GW AI-datacenter hub** planned at NAINA, Navi Mumbai — positioned as a secure, sovereign "Digital Safe Haven": liquid-cooled, GPU-dense, renewable-first power, sub-1.15 PUE target, direct interconnect to the owned fiber backbone.
- **Aerospace/defence-grade additive + subtractive manufacturing** — titanium/nickel alloys, Meltio M450 metal printer, Zeiss 3D scanner at 0.025 mm, ±10 µm tolerance.
- **100% renewable ambition** via a 100 MW solar + BESS pipeline feeding the compute layer.

## Operating Context

- **NSE: KOREDIGIT** · ISIN **INE0KDL01021** · CIN **U64200MH2017PLC000001** · MCA Registered · ISO 9001:2015.
- Regulated by **SEBI & NSE**; investor grievances routed via **SEBI SCORES** (scores.sebi.gov.in; 1800 266 7575 / 1800 22 7575).
- Registered/corporate office: B 1107-1108, Shelton Sapphire, Plot 18-19, Sector 15, CBD Belapur, Navi Mumbai – 400614, Maharashtra.
- Share Transfer Agent: **Bigshare Services Private Limited** (Andheri East, Mumbai – 400 093).
- Investor contact: **cs@koredigital.com** · +91 22 6680 0001.
- Company converted from Kore Digital Pvt Ltd to a listed entity (FY19-20 report filed under the private-limited name).

Routes / surfaces:
- `/` — Home: hero, regulatory strip, four-pillar bento, AI-hub deep dive, interactive fiber footprint (India map), financial-timeline explorer, recent-disclosures callout, latest updates, contact.
- `/about` — Company overview, key metrics, two detailed pillars, NAINA AI-datacenter pipeline, Q4 FY25 results + MD quote.
- `/updates` — Timeline of operational milestones with video/PDF attachments (`timelineUpdates.ts`).
- `/investor-relations` — IR hub: headline metrics, tabs (Financial Performance / Exchange Disclosures), annual-report viewer, statutory-policy library, corporate governance, registered agents/SCORES.
- `/contact` — Contact + office location.
- `/admin` — Non-public disclosure/report upload console.

## Capabilities and Constraints

- **Stack:** Next.js 16.2.10 (App Router, Turbopack), React 19.2.4, Tailwind CSS v4 (`@import "tailwindcss"`, `@theme {}` in `globals.css`, no config file), framer-motion ^12.42.2, lucide-react ^1.23.0, TypeScript ^5. Fonts: Geist / Geist Mono via `next/font/google`. Locale `en_IN`.
- **This is not stock Next.js** — APIs, conventions, and file structure may differ from common training data. Consult `node_modules/next/dist/docs/` before writing framework code (per AGENTS.md).
- Content is **statically authored in `src/data/*.ts`** (`financials.ts`, `governance.ts`, `disclosures.ts`, `timelineUpdates.ts`), not a CMS; `/admin` handles uploads. PDFs embedded via `<iframe>`, videos via `<video>`.
- **Data discipline:** figures in `src/data/*.ts` are extracted verbatim from primary source PDFs (annual reports, Q4 FY25 investor presentation) and carry comments warning against fabrication. Treat them as durable, non-negotiable truth; never alter a number without a cited source.
- Board / officers: Ravindra Doshi (Chairman & MD), Chaitanya Doshi (Executive Director & CEO), Kashmira Doshi (Executive Director & CFO); Independent Directors Ajeet Kadam, Ruchi Gupta, Nishtha Pamnani; Purnima Maheshwari (Company Secretary & Compliance Officer). 4 mandatory committees; 10 statutory policy PDFs under `public/documents/policies/`.

## Brand Commitments

- Name: **Kore Digital Limited**. Tagline: **"Connect to infinity."**
- Logo: `/public/images/logo/kore-digital-logo.png` (rendered ~480×100, displayed h-8/h-9); mark: `/public/images/logo/kore-digital-mark.jpg`; app icon `src/app/icon.jpg`.
- Recurring voice: "Architecting India's Deep-Tech Infrastructure," "Four pillars, one infrastructure fabric," "Digital Safe Haven," "One team. One inbox." Tone is authoritative, precise, and understated — an infrastructure operator, not a hype startup.
- Existing visual language in code (incumbent, not yet documented in DESIGN.md): dark **obsidian** base (#090D16), **emerald** accent (#10B981), **cyan-glow** companion (#22D3EE), **mist** light sections (#F8FAFC). Recording this properly is a `/impeccable document` follow-up.

## Evidence on Hand

Real, sourced assets (safe to cite; do not fabricate beyond these):
- **Audited financials** in `src/data/financials.ts` — FY19-20 through FY25-26, sourced from annual-report PDFs. Headline FY25 consolidated (Q4 FY25 investor presentation, `public/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf`, slide 5): Total Income **₹327.82 Cr** (+212% YoY), Operational EBITDA **₹47.55 Cr** (14.50% margin, +178%), PAT **₹31.70 Cr** (9.67% margin, +176%); year ended 31 March 2025.
- Historical audited revenue (standalone, ₹ Cr): FY19-20 0.88 · FY21-22 16.94 · FY22-23 21.27 · FY23-24 103.51.
- **Regulation 30 disclosures** (`src/data/disclosures.ts`), **governance** (`src/data/governance.ts`: 6 board members, 4 committees, statutory policies), and **operational updates** (`timelineUpdates.ts`).
- Operational headline metrics: 701 km fiber (6 states), 1 GW datacenter target, ₹1,500+ Cr concession-revenue pipeline, 100 MW solar+BESS in development.
- MD portrait `/public/images/about/ravindra-doshi.png`.

**Forward-looking targets (real, may be shown — label as targets/roadmap, not audited fact):** the AI-hub deep-dive specs (e.g. ~60k GPU sockets H200-class, 4.5 EFLOPS, 120 Tbps fabric, 1.12 PUE, 100% renewable, phased live from FY27 across 3 sites) and per-city fiber-ring figures are legitimate planned/target specs, distinct from the audited `data/*.ts` numbers. Present them as roadmap/targets; never merge them into the audited-financials narrative as realized results.

**Known content inconsistency to fix, not propagate:** the `/about` PDF card labels the Q4 file "KDL-Q4-2025.pdf · 34 pages · 3.1 MB" while the actual asset is `KDL-Q4-2025-1.pdf`.

## Product Principles

1. **Audited truth is sacred; targets are labeled.** Sourced `data/*.ts` figures are never altered without a citation. Forward-looking specs may appear but must read as roadmap, never as realized/audited performance.
2. **Compliance is a feature, not a footer.** Every SEBI LODR Reg 46 obligation is discoverable and complete; a regulator or analyst can find any disclosure fast.
3. **Own the whole stack, and show it.** The differentiator is vertical integration across four pillars — surface the "owned, monitored, SLA-backed" reality rather than generic infra claims.
4. **Investment-grade restraint.** Authoritative and precise over promotional; the credibility of a listed operator is the aesthetic.

## Accessibility & Inclusion

**Open decision (unconfirmed):** no binding accessibility standard has been set. SEBI LODR Reg 46 disclosure completeness is a confirmed hard requirement; whether the site must additionally meet a formal accessibility bar (e.g. WCAG 2.1 AA) is **not yet decided** — record and revisit. Until decided, use sensible accessible defaults (adequate contrast, keyboard navigability, semantic structure) without treating them as a formal gate.
