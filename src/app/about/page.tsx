import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/motion/Reveal';
import CountUp from '@/components/motion/CountUp';
import {
  ArrowRight,
  Zap,
  Radio,
  FileText,
  Download,
  TrendingUp,
  Quote,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "Kore Digital Limited is a premier infrastructure architect specialising in telecommunications, AI compute, and deep-tech precision manufacturing — building India's physical and digital future.",
};

/* ─── Data ─────────────────────────────────────────────────────────────── */

const METRICS = [
  {
    end: 701,
    prefix: '',
    suffix: ' km',
    decimals: 0,
    label: 'High-Speed Optic Fiber Corridor',
    accent: 'text-accent',
    border: 'border-accent/30',
    gradient: 'from-accent/[0.12]',
    glow: 'shadow-accent/10',
  },
  {
    end: 1500,
    prefix: '₹',
    suffix: '+ Cr',
    decimals: 0,
    label: 'Projected Concession Revenue Pipeline',
    accent: 'text-alt',
    border: 'border-alt/30',
    gradient: 'from-alt/[0.12]',
    glow: 'shadow-alt/10',
  },
  {
    end: 1,
    prefix: '',
    suffix: ' GW',
    decimals: 0,
    label: 'AI Datacenter Target Capacity',
    accent: 'text-accent',
    border: 'border-accent/30',
    gradient: 'from-accent/[0.12]',
    glow: 'shadow-accent/10',
  },
  {
    end: 0.025,
    prefix: '',
    suffix: ' mm',
    decimals: 3,
    label: 'Precision Aerospace Scanning Accuracy',
    accent: 'text-success',
    border: 'border-success/30',
    gradient: 'from-success/[0.12]',
    glow: 'shadow-success/10',
  },
];

const PILLARS = [
  {
    id: 'telecom',
    tag: '15-Year Concession Framework',
    tagColor: 'bg-accent/10 text-accent border-accent/25',
    title: 'The Samruddhi Mahamarg Flagship Corridor',
    pillar: 'Pillar A · Telecommunications Backbone',
    body: 'Our flagship project is the Samruddhi Mahamarg, a 701-km corridor where we are deploying a high-speed optic fiber duct backbone. This 15-year concession involves laying six ducts to facilitate high-speed connectivity, with total expected revenue exceeding ₹1,500 Cr upon completion.',
    graphic: <TelecomPhoto />,
    reverse: false,
  },
  {
    id: 'manufacturing',
    tag: 'Advanced Material Defensibility',
    tagColor: 'bg-alt/10 text-alt border-alt/25',
    title: 'Precision Engineering & Additive Manufacturing',
    pillar: 'Pillar B · Deep-Tech Additive Manufacturing',
    body: 'Through our strategic collaboration with Kore Additive Manufacturing and Medical Reconstruction Pvt. Ltd., we pioneer reverse engineering and additive manufacturing for the medical, defense, and aerospace sectors. Utilising advanced hardware including the Zeiss 3D Scanner (0.025 mm accuracy) and the Meltio M450 metal printer, we manufacture critical spares in high-performance materials such as Titanium and Nickel Alloys.',
    graphic: <ManufacturingGraphic />,
    reverse: true,
  },
];

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16 bg-bg">
        {/* ── 1. Hero ── */}
        <section
          className="relative overflow-hidden py-24 sm:py-32
                     bg-[url('/images/about/fiber-optic-network.jpg')]
                     bg-cover bg-center md:bg-fixed"
        >
          {/*
            Text-readability overlays.
            The section itself paints the fibre-optic photo (via bg-*), and
            `md:bg-fixed` pins it relative to the viewport on desktop —
            producing the parallax effect where the image stays put while
            the hero content scrolls up over it. Mobile falls back to a
            normal scrolling bg (iOS Safari doesn't reliably support
            `background-attachment: fixed`).
          */}
          <div className="absolute inset-0 bg-bg/60" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(19,37,66,0.55) 0%, rgba(19,37,66,0.35) 45%, rgba(19,37,66,0.75) 100%)',
            }}
          />
          {/* Bottom fade into next section — bg-bg is opaque so the fixed
              image doesn't bleed into the Macro Metrics section below */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg" />

          {/* Ambient accent glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-accent/8 blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-alt/6 blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="mount-fade-up-delay-2 inline-flex items-center gap-2 bg-surface border border-neutral-600 rounded-full px-4 py-1.5 mb-2">
              <Zap className="w-3 h-3 text-accent" />
              <span className="text-xs text-neutral-300 tracking-widest uppercase">
                About Kore Digital Limited
              </span>
            </div>

            <h1 className="mount-fade-up text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-50 leading-[1.08] tracking-tight">
              Architecting India&apos;s{' '}
              <span className="bg-gradient-to-r from-accent via-accent to-alt bg-clip-text text-transparent">
                Physical &amp; Digital
              </span>{' '}
              Future
            </h1>

            <p className="mount-fade-up-delay-1 text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-3xl mx-auto">
              Kore Digital Limited (KDL) operates as a premier infrastructure
              architect specialising in telecommunications and deep-tech
              manufacturing — building the connectivity, compute, and
              precision-hardware layers that power India&apos;s next decade.
            </p>

            <div className="mount-fade-up-delay-3 flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/investor-relations"
                className="inline-flex items-center gap-2 bg-alt hover:bg-alt text-bg font-bold px-6 py-3 rounded transition-colors text-sm"
              >
                Investor Relations <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-neutral-500 hover:border-accent/50 text-neutral-200 hover:text-accent px-6 py-3 rounded transition-all text-sm"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. Macro Metrics ── */}
        <section className="border-t border-neutral-600 bg-surface py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">
                Operational Scale
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-50 tracking-tight">
                Key Figures at a Glance
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {METRICS.map((m, i) => (
                <Reveal key={m.label} delay={i * 80} className="h-full">
                  <div
                    className={`h-full relative overflow-hidden bg-surface border ${m.border} rounded-2xl p-6 sm:p-8 flex flex-col gap-3 hover:shadow-xl ${m.glow} transition-shadow duration-300`}
                  >
                    {/* Subtle top-left accent gradient — gives the card
                        depth without a full gradient border technique */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${m.gradient} to-transparent pointer-events-none`}
                    />
                    <p
                      className={`relative text-3xl sm:text-4xl font-extrabold tracking-tight ${m.accent}`}
                    >
                      <CountUp
                        end={m.end}
                        prefix={m.prefix}
                        suffix={m.suffix}
                        decimals={m.decimals}
                      />
                    </p>
                    <p className="relative text-neutral-300 text-xs sm:text-sm leading-snug">
                      {m.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Industrial Core — Alternating Pillars ── */}
        <section className="border-t border-neutral-600 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
            <div className="text-center">
              <p className="text-alt text-xs font-semibold tracking-widest uppercase mb-3">
                Industrial Core
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-50 tracking-tight">
                The Pillars of Our Business
              </h2>
            </div>

            {PILLARS.map((pillar) => (
              <Reveal
                key={pillar.id}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  pillar.reverse ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                {/* Text side */}
                <div className="space-y-5">
                  <p className="text-neutral-400 text-[10px] uppercase tracking-widest">
                    {pillar.pillar}
                  </p>
                  <span
                    className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full border ${pillar.tagColor}`}
                  >
                    {pillar.tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-neutral-50 tracking-tight leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    {pillar.body}
                  </p>
                </div>

                {/* Graphic side */}
                <div className="flex items-center justify-center">
                  {pillar.graphic}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 3.5 Field Operations Banner ── */}
        <section
          className="relative overflow-hidden border-t border-neutral-600
                     bg-[url('/images/about/telecom-tower.jpg')]
                     bg-cover bg-center md:bg-fixed"
        >
          <div className="relative h-[340px] sm:h-[420px] w-full">
            {/* Multi-layer overlay to darken and colour-tint.
                `md:bg-fixed` above pins the tower image to the viewport on
                desktop so it stays put while the section scrolls over it —
                matching the parallax on the About hero. Mobile falls back
                to a normal scrolling bg (iOS Safari bg-fixed workaround). */}
            <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-bg/60" />

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-xl space-y-5">
                <Reveal>
                  <div className="inline-flex items-center gap-2 bg-surface/80 backdrop-blur-md border border-neutral-600 rounded-full px-3.5 py-1.5">
                    <Radio className="w-3 h-3 text-accent" />
                    <span className="text-[10px] text-neutral-200 tracking-widest uppercase font-semibold">
                      Field Operations
                    </span>
                  </div>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-50 tracking-tight leading-snug">
                    Connectivity Backbone,{' '}
                    <span className="bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent">
                      Built on the Ground
                    </span>
                  </h2>
                </Reveal>
                <Reveal delay={200}>
                  <p className="text-neutral-200 text-sm sm:text-base leading-relaxed">
                    From tower sites to trunk fiber, we build and operate the
                    physical infrastructure that keeps India connected — spanning
                    telecom concessions, dark-fiber leasing, and multi-operator
                    colocation across critical highway corridors.
                  </p>
                </Reveal>

                {/* Inline stat chips */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Reveal delay={300}>
                    <div className="bg-surface/70 backdrop-blur-md border border-neutral-600 rounded-lg px-3.5 py-2">
                      <p className="text-accent text-sm font-bold">240+</p>
                      <p className="text-neutral-400 text-[10px] uppercase tracking-wide">
                        PoPs
                      </p>
                    </div>
                  </Reveal>
                  <Reveal delay={380}>
                    <div className="bg-surface/70 backdrop-blur-md border border-neutral-600 rounded-lg px-3.5 py-2">
                      <p className="text-accent text-sm font-bold">6 ducts</p>
                      <p className="text-neutral-400 text-[10px] uppercase tracking-wide">
                        per corridor
                      </p>
                    </div>
                  </Reveal>
                  <Reveal delay={460}>
                    <div className="bg-surface/70 backdrop-blur-md border border-neutral-600 rounded-lg px-3.5 py-2">
                      <p className="text-alt text-sm font-bold">15 yrs</p>
                      <p className="text-neutral-400 text-[10px] uppercase tracking-wide">
                        concession
                      </p>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Strategic Growth Pipeline ── */}
        <section className="border-t border-neutral-600 py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Featured callout card with cyan glow outline */}
            <Reveal>
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ padding: '2px' }}
              >
                {/*
                  Glowing gradient border.
                  Uses both brand tokens (accent + alt) at ~85 % opacity to
                  recover the depth the original three-cyan-shade ramp gave
                  before the palette collapse. Padding on the outer wrapper
                  is 2 px so the border reads clearly at any DPI.
                */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent) 30%, var(--color-alt) 55%, transparent 72%, var(--color-accent) 100%)',
                    opacity: 0.85,
                  }}
                />
                <div className="relative bg-surface rounded-2xl p-8 sm:p-12 lg:p-16">
                <div className="max-w-3xl space-y-6">
                  <div className="space-y-1">
                    <p className="text-accent text-xs font-semibold tracking-widest uppercase">
                      Strategic Growth Pipeline
                    </p>
                    <p className="text-neutral-400 text-xs uppercase tracking-widest">
                      The NAINA Mumbai AI Datacenter Hub
                    </p>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-neutral-50 tracking-tight leading-snug">
                    Next-Gen AI Compute
                    <br className="hidden sm:block" /> Infrastructure
                  </h2>

                  <p className="text-neutral-300 leading-relaxed text-base sm:text-lg">
                    Our upcoming project in the pipeline is AI Datacenter
                    Infrastructure centred on a massive{' '}
                    <span className="text-accent font-semibold">1 GW hub</span>{' '}
                    in Maharashtra&apos;s NAINA region. Designed to act as a
                    secure, sovereign{' '}
                    <span className="text-accent font-semibold">
                      &ldquo;Digital Safe Haven&rdquo;
                    </span>
                    , this hub is engineered to anchor the intensive compute
                    loads of the next generation of artificial intelligence.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-4 pt-4">
                    {[
                      { v: '1 GW', l: 'Target Compute Capacity' },
                      { v: 'NAINA', l: 'Maharashtra Region' },
                      { v: 'AI-Ready', l: 'Sovereign Infrastructure' },
                    ].map((s, i) => (
                      <Reveal key={s.l} delay={200 + i * 80}>
                        <div className="bg-elevated border border-neutral-600 rounded-xl p-4">
                          <p className="text-accent text-xl font-bold">{s.v}</p>
                          <p className="text-neutral-400 text-xs mt-1">{s.l}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>

                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-8 w-48 h-48 rounded-full bg-alt/4 blur-3xl pointer-events-none" />
              </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 4.5 Latest Investor Communication ── */}
        <section
          id="latest-results"
          className="border-t border-neutral-600 py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-14 space-y-3">
              <p className="text-alt text-xs font-semibold tracking-widest uppercase">
                Latest Investor Communication
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-50 tracking-tight">
                Q4 FY25 Financial Performance
              </h2>
              <p className="text-neutral-300 leading-relaxed max-w-2xl mx-auto">
                Audited consolidated results and management commentary — a
                stellar year marked by{' '}
                <span className="text-alt font-semibold">
                  200%+ growth in total income
                </span>
                , driven by successful execution of the Samruddhi Mahamarg fiber
                project.
              </p>
            </div>

            {/* PDF preview dominates (3/4), stats sit compactly beside (1/4) */}
            <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">
              {/* ── Left: Live PDF preview card — spans 3 columns ── */}
              <Reveal className="lg:col-span-3">
                <div className="rounded-2xl overflow-hidden border border-neutral-600 bg-surface shadow-2xl shadow-black/50">
                {/* Preview header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-600 bg-elevated">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-danger/10 border border-danger/30 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-danger" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-neutral-50 text-xs font-semibold truncate">
                        KDL-Q4-2025.pdf
                      </p>
                      <p className="text-neutral-400 text-[10px]">
                        34 pages · 3.1 MB
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-success bg-success/10 border border-success/25 rounded-full px-2.5 py-0.5">
                    LATEST
                  </span>
                </div>

                {/* Inline PDF viewer — taller aspect for a larger, immersive preview */}
                <div className="relative w-full aspect-[4/3] bg-neutral-200">
                  <iframe
                    src="/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf#view=FitH&toolbar=0&navpanes=0&scrollbar=0"
                    className="absolute inset-0 w-full h-full"
                    title="Kore Digital Limited — Q4 FY25 Investor Presentation"
                    loading="lazy"
                  />
                  {/* Subtle top fade for aesthetic consistency */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-bg/40 to-transparent pointer-events-none"
                  />
                </div>

                {/* Preview footer with actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-4 border-t border-neutral-600">
                  <a
                    href="/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-bg font-bold text-xs px-4 py-2.5 rounded transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Full Presentation
                  </a>
                  <a
                    href="/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf"
                    download="KDL-Q4-FY25-Investor-Presentation.pdf"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border border-neutral-500 hover:border-alt/50 text-neutral-200 hover:text-alt font-semibold text-xs px-4 py-2.5 rounded transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </a>
                </div>
                </div>
              </Reveal>

              {/* ── Right: Extracted highlights ── */}
              <div className="space-y-4">
                {/* Period tabs (visual only) */}
                <div className="inline-flex items-center gap-1 bg-surface border border-neutral-600 rounded-lg p-1 text-[11px] font-semibold">
                  <span className="px-3 py-1.5 rounded-md bg-elevated text-accent border border-accent/30">
                    FY25 Consolidated
                  </span>
                  <span className="px-3 py-1.5 text-neutral-400">Q4 FY25</span>
                </div>

                {/* Stat rows */}
                {[
                  {
                    label: 'Total Income',
                    value: '₹327.82 Cr',
                    prev: 'FY24 · ₹105.08 Cr',
                    growthNum: 212,
                    accent: 'text-alt',
                    border: 'border-alt/20',
                  },
                  {
                    label: 'EBITDA',
                    value: '₹47.55 Cr',
                    prev: 'FY24 · ₹17.08 Cr',
                    growthNum: 178,
                    margin: '14.50% margin',
                    accent: 'text-accent',
                    border: 'border-accent/20',
                  },
                  {
                    label: 'Net Profit',
                    value: '₹31.70 Cr',
                    prev: 'FY24 · ₹11.49 Cr',
                    growthNum: 176,
                    margin: '9.67% margin',
                    accent: 'text-success',
                    border: 'border-success/20',
                  },
                ].map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 100}>
                    <div
                      className={`bg-surface border ${stat.border} rounded-xl p-4 hover:bg-elevated transition-colors`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-neutral-400 text-[10px] uppercase tracking-widest">
                          {stat.label}
                        </p>
                        <span className="inline-flex items-center gap-0.5 text-success text-xs font-bold">
                          <TrendingUp className="w-3 h-3" />
                          <CountUp end={stat.growthNum} prefix="+" suffix="%" />
                        </span>
                      </div>
                      <p
                        className={`text-2xl font-bold leading-tight ${stat.accent}`}
                      >
                        {stat.value}
                      </p>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <p className="text-neutral-500 text-[11px]">
                        {stat.prev}
                      </p>
                      {stat.margin && (
                        <span className="text-neutral-400 text-[11px]">
                          {stat.margin}
                        </span>
                      )}
                    </div>
                    </div>
                  </Reveal>
                ))}

                <p className="text-neutral-500 text-[10px] leading-relaxed pt-1">
                  All figures in ₹ Crores from consolidated financial statements
                  for the year ended 31 March 2025. Refer to the full
                  presentation for detailed segment reporting, cash flow, and
                  balance sheet disclosures.
                </p>
              </div>
            </div>

            {/* ── MD quote block ── */}
            <div className="mt-14 relative bg-surface border border-neutral-600 rounded-2xl p-6 sm:p-10 overflow-hidden">
              <Quote
                aria-hidden="true"
                className="absolute top-4 left-4 w-12 h-12 text-accent/8"
                strokeWidth={1}
              />
              <div className="relative flex flex-col sm:flex-row gap-6 items-start">
                <Reveal delay={200} className="shrink-0">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-neutral-500 ring-4 ring-accent/10 shadow-lg shadow-black/40">
                    <Image
                      src="/images/about/ravindra-doshi.png"
                      alt="Mr. Ravindra Doshi, Managing Director of Kore Digital Limited"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
                <Reveal className="space-y-3 min-w-0">
                  <p className="text-neutral-200 text-sm sm:text-base leading-relaxed italic">
                    &ldquo;We are proud to report a stellar performance in FY25,
                    marked by over 200% growth in total income, a strong
                    endorsement of our execution capabilities and strategic
                    decisions. This growth has been significantly driven by the
                    successful commencement of our work on the Samruddhi
                    Mahamarg project. With continued momentum and strategic
                    execution, we are confident in our ability to deliver
                    sustainable growth and long-term value for all
                    stakeholders.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-neutral-600/60">
                    <p className="text-neutral-50 text-sm font-semibold">
                      Mr. Ravindra Doshi
                    </p>
                    <p className="text-neutral-400 text-xs">
                      Managing Director, Kore Digital Limited
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ─── Inline SVG Graphics ───────────────────────────────────────────────── */

function TelecomPhoto() {
  return (
    <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-600 shadow-2xl shadow-black/50 group">
      <Image
        src="/images/about/fiber-cable-deployment.jpg"
        alt="Fiber optic cable spools staged for the Samruddhi Mahamarg corridor deployment"
        fill
        sizes="(max-width: 1024px) 100vw, 500px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Cyan tint + gradient overlay so photo reads as part of the dark UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/25 to-transparent" />
      <div className="absolute inset-0 bg-accent/8 mix-blend-overlay pointer-events-none" />

      {/* Corner stat pill */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-surface/90 backdrop-blur-md border border-accent/40 rounded-full px-3 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="text-[10px] font-semibold tracking-widest uppercase text-accent">
          Live Deployment
        </span>
      </div>

      {/* Bottom caption bar */}
      <div className="absolute bottom-0 inset-x-0 p-5">
        <p className="text-accent text-[10px] font-semibold tracking-widest uppercase mb-1">
          Samruddhi Mahamarg Corridor
        </p>
        <p className="text-neutral-50 text-sm font-semibold">
          701 km · 6-duct fiber backbone
        </p>
      </div>
    </div>
  );
}

function ManufacturingGraphic() {
  return (
    <svg
      viewBox="0 0 420 320"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md"
      aria-hidden="true"
    >
      <defs>
        <filter id="glowM">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="scanGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-alt)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-alt)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Part silhouette — aerospace bracket */}
      <polygon
        points="140,100 280,100 300,140 300,220 120,220 120,140"
        fill="var(--color-bg)"
        stroke="var(--color-muted)"
        strokeWidth="1.5"
      />
      <polygon
        points="155,115 265,115 282,148 282,205 138,205 138,148"
        fill="var(--color-bg)"
        stroke="var(--color-muted)"
        strokeWidth="1"
      />

      {/* Scanner grid overlay */}
      {[130, 150, 170, 190, 210].map((y) => (
        <line
          key={y}
          x1="125"
          y1={y}
          x2="295"
          y2={y}
          stroke="var(--color-alt)"
          strokeWidth="0.4"
          strokeOpacity="0.25"
        />
      ))}
      {[145, 175, 205, 235, 265].map((x) => (
        <line
          key={x}
          x1={x}
          y1="105"
          x2={x}
          y2="215"
          stroke="var(--color-alt)"
          strokeWidth="0.4"
          strokeOpacity="0.25"
        />
      ))}

      {/* Scanner beam */}
      <line
        x1="120"
        y1="130"
        x2="300"
        y2="130"
        stroke="var(--color-alt)"
        strokeWidth="1.5"
        strokeOpacity="0.8"
        filter="url(#glowM)"
      >
        <animate
          attributeName="y1"
          values="110;215;110"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y2"
          values="110;215;110"
          dur="3s"
          repeatCount="indefinite"
        />
      </line>

      {/* Radial glow at scan point */}
      <circle cx="210" cy="162" r="40" fill="url(#scanGrad)">
        <animate
          attributeName="cy"
          values="115;215;115"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Measurement callout */}
      <line
        x1="300"
        y1="155"
        x2="340"
        y2="140"
        stroke="var(--color-alt)"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      <rect
        x="340"
        y="128"
        width="68"
        height="26"
        rx="4"
        fill="var(--color-bg)"
        stroke="var(--color-alt)"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      <text
        x="374"
        y="143"
        textAnchor="middle"
        fill="var(--color-alt)"
        fontSize="9"
        fontFamily="ui-monospace,monospace"
      >
        0.025 mm
      </text>
      <text
        x="374"
        y="152"
        textAnchor="middle"
        fill="var(--color-muted)"
        fontSize="6.5"
        fontFamily="ui-sans-serif"
      >
        Zeiss 3D Scan
      </text>

      {/* Material badge */}
      <rect
        x="130"
        y="236"
        width="64"
        height="20"
        rx="3"
        fill="var(--color-bg)"
        stroke="var(--color-muted)"
        strokeWidth="0.8"
      />
      <text
        x="162"
        y="249"
        textAnchor="middle"
        fill="var(--color-muted)"
        fontSize="7.5"
        fontFamily="ui-sans-serif"
      >
        Ti Alloy
      </text>
      <rect
        x="202"
        y="236"
        width="68"
        height="20"
        rx="3"
        fill="var(--color-bg)"
        stroke="var(--color-muted)"
        strokeWidth="0.8"
      />
      <text
        x="236"
        y="249"
        textAnchor="middle"
        fill="var(--color-muted)"
        fontSize="7.5"
        fontFamily="ui-sans-serif"
      >
        Ni Alloy
      </text>

      {/* Corner dots */}
      <circle
        cx="120"
        cy="100"
        r="3"
        fill="var(--color-alt)"
        fillOpacity="0.6"
        filter="url(#glowM)"
      />
      <circle
        cx="300"
        cy="100"
        r="3"
        fill="var(--color-alt)"
        fillOpacity="0.6"
        filter="url(#glowM)"
      />
      <circle
        cx="120"
        cy="220"
        r="3"
        fill="var(--color-alt)"
        fillOpacity="0.6"
      />
      <circle
        cx="300"
        cy="220"
        r="3"
        fill="var(--color-alt)"
        fillOpacity="0.6"
      />
    </svg>
  );
}
