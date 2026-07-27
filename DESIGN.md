---
name: Kore Digital
description: The Investment-Grade Ledger — obsidian story, mist ledger, emerald as confirmation.
colors:
  obsidian: "#090D16"
  obsidian-2: "#0B0F19"
  emerald: "#10B981"
  emerald-ink: "#047857"
  cyan-glow: "#22D3EE"
  mist: "#F8FAFC"
  ink: "#0F172A"
  slate-600: "#475569"
  slate-500: "#64748B"
  slate-200: "#E2E8F0"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.32em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  section: "96px"
  section-lg: "128px"
components:
  button-primary:
    backgroundColor: "{colors.emerald}"
    textColor: "{colors.obsidian}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "#14CC93"
    textColor: "{colors.obsidian}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-outline-hover:
    textColor: "{colors.emerald}"
  nav-pill:
    backgroundColor: "transparent"
    textColor: "{colors.emerald}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  badge-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.slate-500}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
    typography: "{typography.label}"
  badge-dark:
    backgroundColor: "rgba(255,255,255,0.03)"
    textColor: "rgba(255,255,255,0.6)"
    rounded: "{rounded.full}"
    padding: "4px 12px"
    typography: "{typography.label}"
  card-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "32px"
  card-dark:
    backgroundColor: "rgba(255,255,255,0.02)"
    textColor: "{colors.white}"
    rounded: "{rounded.xl}"
    padding: "32px"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.mist}"
    rounded: "0px"
    padding: "12px 0"
  tab:
    backgroundColor: "transparent"
    textColor: "rgba(255,255,255,0.5)"
    padding: "0 0 20px 0"
  tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
---

# Design System: Kore Digital

## Overview

**Creative North Star: "The Investment-Grade Ledger"**

Kore Digital is an NSE-listed deep-tech infrastructure operator, and the site is built to be believed by institutions and regulators before it is admired. The system reads like a listed company's annual report elevated to a screen: an **obsidian story** that frames capability and ambition, interrupted by **mist ledgers** — clean, near-white sections where the audited numbers stand in the open and can be checked. The two surfaces alternate down every page, and that rhythm is the identity: dark for narrative, light for accountability.

Emerald is the only chromatic voice, and it is deployed as **confirmation** — the "live", "listed", "verified", "on-track" signal — never as decoration. Type is set in Geist with tight tracking and heavy weight for headlines, and Geist Mono in wide-tracked uppercase for the ledger kickers (`SOURCE · Q4 FY25 INVESTOR PRESENTATION`) that give the whole thing its filing-document precision. Depth is quiet: surfaces are flat at rest and lift only in response to intent. Nothing sparkles for its own sake; the credibility of a real, compliant operator *is* the aesthetic.

The anti-reference is the hype startup — neon spectacle, rainbow gradients on text, motion that performs rather than informs. When in doubt, choose the treatment that a cautious institutional analyst would trust over the one that a launch tweet would celebrate.

**Key Characteristics:**
- Obsidian narrative sections alternating with mist "ledger" sections, joined by hairline `slate-200` borders and gradient fades to obsidian.
- Emerald (#10B981) as the single accent, reserved for confirmation/live states and primary action.
- Geist bold + tight tracking for headlines; Geist Mono wide-tracked uppercase for filing-style kickers.
- Flat-by-default surfaces; a subtle lift + emerald glow only on hover.
- Restrained, functional motion — scroll reveals, count-ups, a single live pulse.

## Colors

A near-monochrome system: two deep darks and one light, a slate text ramp, and emerald as the lone accent. Cyan-glow exists only as atmospheric light, never as ink.

### Primary
- **Confirmation Emerald** (`#10B981`): the entire brand voice in one hue. Primary CTA fills (`text-obsidian` on emerald), active tab underline, "live/listed/on-track" dots and badges, hover borders, on-track chips, and the accent word in a headline (on dark). Its scarcity is what makes it read as a signal rather than a color.
- **Emerald Ink** (`#047857`): the same signal, darkened for **text and icons on light (mist/white) surfaces**, where `#10B981` reads only ~2.6:1 and fails the contrast floor. This is the emerald for link/label/hover states on mist (~5.6:1). `#10B981` stays for fills, dots, borders, and anything on obsidian.

### Secondary
- **Cyan Glow** (`#22D3EE`): atmospheric only — radial background washes behind heroes, the far stop of the footer's comet-border, and the "Compute" pillar tag. **Not a text color and not a second CTA color.**

### Neutral — Dark surfaces
- **Obsidian** (`#090D16`): the deepest base; page background and every narrative section (`bg-obsidian`).
- **Obsidian Lifted** (`#0B0F19`): a barely-raised dark for secondary dark passages and glass tints.
- **White at alpha**: dark-surface text is white stepped by opacity — `white/90` headlines, `white/70` body, `white/60` leads and subtitles, `white/50–40` captions and meta. Borders are `white/10`; card fills `white/[0.02]–[0.03]`.

### Neutral — Light surfaces
- **Mist** (`#F8FAFC`): the ledger background for numbers, disclosures, and policy libraries (`bg-mist`).
- **Ink** (`#0F172A`, slate-900): primary text on mist — headlines and metric figures.
- **Slate Body** (`#475569`, slate-600): body copy on light.
- **Slate Muted** (`#64748B`, slate-500): mono kickers, labels, captions on light.
- **Slate Hairline** (`#E2E8F0`, slate-200): borders, dividers, and the `border-y` seams between mist and obsidian.
- **White** (`#FFFFFF`): light-section card fills.

### Named Rules
**The One Signal Rule.** Emerald is confirmation, not decoration. On any given screen it covers well under ~10% of the surface — actions, live states, and at most one accent word. If emerald is doing anything you couldn't label "verified / live / go", it's misused.

**The Cyan-Is-Light Rule.** `cyan-glow` may only appear as background light (radial washes, the comet tail) — never as text, never as a button. Two accent colors competing for attention would break the ledger's composure.

**The Emerald-on-Light Rule.** Emerald as *text or an icon* on a light surface uses **Emerald Ink** (`#047857`, ~5.6:1), never `#10B981` (~2.6:1, which fails even the large-text floor). On obsidian it reverses — `#10B981` for its glow; Emerald Ink would go muddy on dark.

**The Alternation Rule.** Sections are either obsidian (story) or mist (ledger); they alternate, and every mist↔obsidian seam is a `border-y border-slate-200` hairline or a `to-obsidian` gradient fade. Never stack two mist sections flush without a seam.

## Typography

**Display / Body Font:** Geist (with system-ui, sans-serif) — one family carries display, headline, title, and body.
**Label / Kicker Font:** Geist Mono (with ui-monospace, monospace) — reserved for uppercase wide-tracked kickers and ticker values.

**Character:** Geist is a precise, neutral grotesque; at heavy weight with tight tracking it reads engineered and confident, and in mono at wide letter-spacing it reads like a filing header. The pairing is "control-surface, not brochure."

### Hierarchy
- **Display** (700, `clamp(2.25rem→4.5rem)`, line-height 1.05, tracking `-0.025em`): page hero H1. The IR hero pushes one step further (`text-8xl`, line-height `0.95`) as the flagship compliance surface.
- **Headline** (700, `clamp(1.875rem→3rem)`, line-height 1.05, tracking `-0.025em`): section H2 ("Consolidated Highlights", "Four pillars…"), constrained to `max-w-3xl`.
- **Title** (700, `clamp(1.5rem→1.875rem)`, line-height 1.1, tracking `-0.02em`): card and subsection H3.
- **Body** (400, `1rem→1.125rem`, line-height 1.625): paragraph copy — `text-white/70` on dark, `slate-600` on light. Measure held by `max-w-xl / max-w-2xl / max-w-3xl` (no `ch` units in the system).
- **Label / Kicker** (Geist Mono, 500, `0.625rem`/10px, uppercase, tracking `0.32em`): the filing-style eyebrow — `slate-500` on light, `white/50` on dark, often led by a small emerald separator dot.

### Named Rules
**The Filing-Kicker Rule.** Every major section is announced by a Geist Mono uppercase kicker at ~`0.28–0.32em` tracking (a `SectionBadge` pill on dark, plain mono text on light). It is the single most recognizable type signature in the system — use it, and don't set it in the sans body font.

**The Solid-Ink Rule.** Text is a single solid color — emerald for an accent word, otherwise ink/white per surface. **No gradient-filled text**, anywhere, at any size. (This retires the incumbent emerald→cyan `bg-clip-text` treatment on hero words and metric figures; see Don'ts.)

## Layout

A centered `max-w-7xl` column governs every page. Two container paddings coexist by lineage: home / about / updates use `px-4 sm:px-6 lg:px-8`; investor-relations uses the wider `px-6 md:px-12`. Match the surface you're extending rather than mixing them within a page.

Vertical rhythm is generous and comes in two idioms: narrative/marketing sections breathe at `py-24 md:py-32`; the denser IR sections run `py-20 md:py-24` (taller policy/governance bands at `py-20 md:py-28`). Section headers stack as kicker → headline → optional subtitle, centered on marketing surfaces and left-aligned in IR panels.

Grids are Tailwind-native: stat/metric rows are `grid-cols-2 lg:grid-cols-4`; bento feature grids `grid-cols-1 md:grid-cols-2` with `min-h` floors; editorial splits use a 12-column grid (`lg:col-span-5` copy / `lg:col-span-7` visual). Global `scroll-padding-top: 64px` clears the fixed header for in-page anchors.

## Elevation & Depth

**Flat by default, lift on intent.** Surfaces sit flat at rest; depth is a *response*, not a resting state. Dark cards are defined by a hairline border and a near-transparent fill rather than a shadow; light cards carry only a whisper of ambient shadow to separate white-on-mist. The felt depth of the site comes from the obsidian/mist tonal alternation and faint radial glows, not from a shadow ladder.

### Shadow Vocabulary
- **Ledger-ambient** (`box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 10px 30px -16px rgba(15,23,42,0.18)`): the resting shadow on white cards over mist, so they read as paper on paper.
- **Emerald-lift** (`box-shadow: 0 12px 32px -12px rgba(16,185,129,0.35), 0 0 0 1px rgba(16,185,129,0.15)`): hover-only on interactive cards, paired with `translateY(-3px)` and an emerald border — the "this responds" cue.
- **Glass-panel** (`inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.55)`): reserved for opted-in glass surfaces (`.glass`, `.glass-obsidian`) — contact cards, the fixed nav.

### Named Rules
**The Flat-By-Default Rule.** A surface earns a shadow only by being interactive and hovered. If it isn't responding to the pointer, it has a border, not a shadow.

## Shapes

Soft-but-serious rounding, tiered by scale: **pills** are fully round (`rounded-full`) for every badge, chip, and status dot; **cards and panels** use a 16px radius (`rounded-2xl`); **buttons** use 4px (`rounded`) in compact nav/utility contexts and 8px (`rounded-lg`) for prominent CTAs; **fields** use 12px (`rounded-xl`) for the copy-email block, or no radius for the admin underline input. Borders are hairline (1px) and low-contrast — `white/10` on dark, `slate-200` on light — thickening to a 2px emerald only for the active tab underline. The recurring silhouette is a bordered, generously-padded rounded rectangle; ornament lives in the seams (kickers, hairlines, a single live dot), not the corners.

## Components

### Buttons
- **Shape:** `rounded` (4px) for compact/nav actions, `rounded-lg` (8px) for primary CTAs.
- **Primary (emerald fill):** `bg-emerald text-obsidian font-bold`, padding `px-4 py-2` (compact) to `px-6 py-3` (prominent). Near-black text on emerald is the signature contrast.
- **Hover:** `brightness-110` on the fill — it *brightens*, it does not change hue. Text stays obsidian.
- **Outline / Ghost:** `border border-white/20 text-white font-semibold` (or `border-slate-200 text-slate-700` on light); hover swaps **both** border and text to solid `emerald`, no fill. This is the standard secondary action.
- **Nav pill (highlighted link):** `text-emerald font-semibold border border-emerald/30`, hover deepens border to `emerald/70`.
- **Text-link CTA:** `text-white/70 group-hover:text-emerald` with a nudging arrow (`group-hover:translate-x-0.5`).

### Chips / Tags / Status
- **Style:** `rounded-full` pills, `text-[10px] font-semibold`, hairline-bordered. Category tags tint by pillar — Telecom `emerald/10 + text-emerald`, Compute `cyan-glow/10 + text-cyan-glow`, General `white + slate-700`.
- **State:** status pills read In Progress (`emerald/10` border `emerald/40`, with a live `animate-ping` dot), Upcoming (`emerald/30` outline), Completed (`slate-200` outline, muted).

### Cards / Containers
- **Corner Style:** `rounded-2xl` (16px).
- **Background:** light — `bg-gradient-to-b from-white to-slate-50`; dark — `bg-white/[0.02]`.
- **Shadow Strategy:** Ledger-ambient at rest (light) / border-only (dark); Emerald-lift on hover. See Elevation.
- **Border:** hairline `slate-200` (light) / `white/10` (dark), → `emerald/45` on hover.
- **Internal Padding:** `p-5 sm:p-6 md:p-8` (24→32px).

### Inputs / Fields
- **Style:** underline-only — `bg-transparent border-b border-slate-800/60`, no radius, roomy `py-3`, `placeholder:text-slate-700`. (Public site is contact-by-copy; real inputs live in the admin console.)
- **Focus:** border lightens `slate-800/60 → slate-400`; no glow, no box. Quiet and precise.
- **Copy field:** read-only `bg-white/[0.03] border-white/10 rounded-xl`, mono value, with a state-toggling copy button that flips to `emerald/10 + text-emerald` on success.

### Navigation
- **Style:** fixed top bar on `.glass-nav` (high-alpha obsidian tint + backdrop-blur). Desktop links `text-white/70 → text-white`; the IR link is the emerald nav-pill; primary CTA at the right.
- **Mobile:** an in-flow panel on a solid `bg-obsidian` (never translucent — content must not bleed through), expanding with a framer-motion height+opacity reveal and lightly staggered links; a hamburger/X toggle drives it.

### Tabs (IR filings)
- **Style:** underline tabs on a `border-b border-white/10` rail. Base `pb-5 -mb-px border-b-2 font-semibold`; active = `border-emerald text-white`, inactive = `border-transparent text-white/50 hover:text-white/80`. The active underline recolors in place (no sliding indicator) — keep it that way for the ledger's composure.

### Signature — The Ledger Kicker + Metric Block
The system's fingerprint: a Geist Mono uppercase kicker (`tracking-[0.32em]`) sitting above a heavy tabular metric. Metric numbers are `tabular-nums`, responsive (`text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem]`), in **solid** emerald or ink — with the unit ("Cr", "%") as a smaller muted sibling on a `flex items-baseline` row. This block is how audited figures are presented across IR and About.

### Signature — Live Pulse & Comet Border
Two restrained motion signatures: the `ticker-pulse` emerald dot (a 2.2s opacity + expanding-halo pulse) marks "live/listed" states; the footer's SMIL comet-trail traces a single bright emerald head around a 1px gradient border at constant linear velocity. Both vanish under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** alternate obsidian narrative sections with mist ledger sections, and seam every transition with a `border-y border-slate-200` hairline or a `to-obsidian` gradient fade.
- **Do** reserve emerald for confirmation — actions, live/listed states, on-track chips, and at most one accent word per headline (The One Signal Rule).
- **Do** announce every major section with a Geist Mono uppercase kicker at `~0.28–0.32em` tracking.
- **Do** set metric figures in solid color, `tabular-nums`, with the unit as a smaller muted baseline-aligned sibling; keep them responsive so `Cr`/`%` never clip.
- **Do** keep surfaces flat at rest and let cards lift (`translateY(-3px)` + emerald border/glow) only on hover.
- **Do** use **Emerald Ink** (`#047857`) for emerald text/icons on mist/white; keep `#10B981` for dark surfaces, fills, and dots (The Emerald-on-Light Rule).
- **Do** give every interactive element a visible `:focus-visible` ring (2px emerald, 2px offset) — keyboard focus is a first-class state, not the UA default.
- **Do** present forward-looking specs (AI-hub capacity, PUE, FY27) visibly framed as targets/roadmap — never blended into audited-results type (see PRODUCT.md).

### Don't:
- **Don't** use gradient-filled text anywhere — retire the emerald→cyan `bg-clip-text` on hero words and metric numbers in favor of solid emerald or ink (The Solid-Ink Rule).
- **Don't** promote `cyan-glow` to a text or button color; it is atmospheric light only.
- **Don't** introduce a second accent hue, a shadow ladder on resting surfaces, or motion that performs rather than informs.
- **Don't** let the mobile nav panel be translucent — page content bleeding through breaks the composure; keep it solid `bg-obsidian`.
- **Don't** set section kickers in the sans body font or at tight tracking — the wide-tracked mono is the point.
- **Don't** alter a figure sourced in `src/data/*.ts` to fit a layout; the audited number wins.
