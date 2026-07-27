import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/motion/Reveal';
import CountUp from '@/components/motion/CountUp';
import SectionBadge from '@/components/ui/SectionBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import StatBlock from '@/components/ui/StatBlock';
import BentoCard from '@/components/ui/BentoCard';
import GlowCallout from '@/components/ui/GlowCallout';
import {
  ArrowRight,
  Radio,
  FileText,
  Download,
  TrendingUp,
  Quote,
  Building2,
  Layers,
  Cpu,
  Landmark,
  Gauge,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "Kore Digital Limited is a premier infrastructure architect specialising in telecommunications, AI compute, and deep-tech precision manufacturing — building India's physical and digital future.",
};

/* ─── Data ─────────────────────────────────────────────────────────────── */

const METRICS: {
  end: number;
  prefix?: string;
  suffix?: string;
  unit: string;
  decimals: number;
  label: string;
}[] = [
  {
    end: 701,
    unit: 'km',
    decimals: 0,
    label: 'High-Speed Optic Fiber Corridor',
  },
  {
    end: 1500,
    prefix: '₹',
    suffix: '+',
    unit: 'Cr',
    decimals: 0,
    label: 'Projected Concession Revenue Pipeline',
  },
  {
    end: 1,
    unit: 'GW',
    decimals: 0,
    label: 'AI Datacenter Target Capacity',
  },
  {
    end: 0.025,
    unit: 'mm',
    decimals: 3,
    label: 'Precision Aerospace Scanning Accuracy',
  },
];

const PILLARS = [
  {
    id: 'telecom',
    tag: '15-Year Concession Framework',
    title: 'The Samruddhi Mahamarg Flagship Corridor',
    pillar: 'Pillar A · Telecommunications Backbone',
    body: 'Our flagship project is the Samruddhi Mahamarg, a 701-km corridor where we are deploying a high-speed optic fiber duct backbone. This 15-year concession involves laying six ducts to facilitate high-speed connectivity, with total expected revenue exceeding ₹1,500 Cr upon completion.',
    graphic: <TelecomPhoto />,
    reverse: false,
  },
  {
    id: 'manufacturing',
    tag: 'Advanced Material Defensibility',
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
      <main className="flex-1 pt-16 bg-obsidian">
        {/* ── 1. Hero ── */}
        <section
          className="relative overflow-hidden py-24 sm:py-32 pt-32
                     bg-[url('/images/about/fiber-optic-network.jpg')]
                     bg-cover bg-center md:bg-fixed"
        >
          {/*
            Text-readability overlays. The section paints the fibre-optic
            photo, `md:bg-fixed` pins it to the viewport on desktop for the
            parallax feel. Mobile falls back to a normal scrolling bg
            (iOS Safari doesn't reliably support `background-attachment: fixed`).
          */}
          <div className="absolute inset-0 bg-obsidian/70" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(9,13,22,0.55) 0%, rgba(9,13,22,0.35) 45%, rgba(9,13,22,0.85) 100%)',
            }}
          />
          <div className="dot-grid-obsidian absolute inset-0 opacity-30 pointer-events-none" />
          {/* Bottom fade into next section — bg-obsidian is opaque so the
              fixed image doesn't bleed into the Macro Metrics section below */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-obsidian" />

          {/* Ambient accent glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-emerald/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-glow/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 flex flex-col items-center">
            <div className="mount-fade-up-delay-2">
              <SectionBadge
                icon={Building2}
                label="About Kore Digital Limited"
                tone="dark"
              />
            </div>

            <h1 className="mount-fade-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              Architecting India&apos;s{' '}
              <span className="text-emerald">Physical &amp; Digital</span>{' '}
              Future
            </h1>

            <p className="mount-fade-up-delay-1 text-lg sm:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              Kore Digital Limited (KDL) operates as a premier infrastructure
              architect specialising in telecommunications and deep-tech
              manufacturing — building the connectivity, compute, and
              precision-hardware layers that power India&apos;s next decade.
            </p>

            <div className="mount-fade-up-delay-3 flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/investor-relations"
                className="inline-flex items-center gap-2 bg-emerald hover:brightness-110 text-obsidian font-bold px-6 py-3 rounded-lg transition text-sm"
              >
                Investor Relations <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-emerald text-white hover:text-emerald px-6 py-3 rounded-lg transition text-sm font-semibold"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. Macro Metrics ── */}
        <section className="relative bg-mist py-24 md:py-28 overflow-hidden">
          <div className="dot-grid-mist absolute inset-0 opacity-40 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              tone="light"
              align="center"
              badgeIcon={Gauge}
              badgeLabel="Operational Scale"
              title="Key figures at a glance."
              className="mb-14 md:mb-16 items-center"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {METRICS.map((m, i) => (
                <Reveal key={m.label} delay={i * 80} className="h-full">
                  <BentoCard tone="light" className="h-full min-h-[168px] justify-center">
                    <StatBlock
                      tone="light"
                      size="lg"
                      accent
                      value={
                        <CountUp
                          end={m.end}
                          prefix={m.prefix}
                          suffix={m.suffix}
                          decimals={m.decimals}
                        />
                      }
                      unit={m.unit}
                      label={m.label}
                    />
                  </BentoCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Industrial Core — Alternating Pillars ── */}
        <section className="relative bg-obsidian py-24 md:py-32 overflow-hidden">
          <div className="dot-grid-obsidian absolute inset-0 opacity-30 pointer-events-none" />
          <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald/5 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
            <SectionHeading
              tone="dark"
              align="center"
              badgeIcon={Layers}
              badgeLabel="Industrial Core"
              title="The pillars of our business."
              className="items-center"
            />

            {PILLARS.map((pillar) => (
              <Reveal
                key={pillar.id}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  pillar.reverse ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                {/* Text side */}
                <div className="space-y-5">
                  <p className="text-white/50 text-[10px] uppercase tracking-[0.22em] font-medium">
                    {pillar.pillar}
                  </p>
                  <span className="inline-flex items-center rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 text-[10px] font-semibold text-emerald tracking-wide">
                    {pillar.tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-[1.1]">
                    {pillar.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">{pillar.body}</p>
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
          className="relative overflow-hidden
                     bg-[url('/images/about/telecom-tower.jpg')]
                     bg-cover bg-center md:bg-fixed"
        >
          <div className="relative h-[340px] sm:h-[420px] w-full">
            {/* Multi-layer overlay to darken and colour-tint. `md:bg-fixed`
                above pins the tower image to the viewport on desktop for
                parallax; mobile falls back to a normal scrolling bg. */}
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-transparent to-obsidian/60" />

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-xl space-y-5">
                <Reveal>
                  <SectionBadge
                    icon={Radio}
                    label="Field Operations"
                    tone="dark"
                    className="backdrop-blur-md"
                  />
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-[1.1]">
                    Connectivity Backbone,{' '}
                    <span className="text-emerald">Built on the Ground</span>
                  </h2>
                </Reveal>
                <Reveal delay={200}>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                    From tower sites to trunk fiber, we build and operate the
                    physical infrastructure that keeps India connected — spanning
                    telecom concessions, dark-fiber leasing, and multi-operator
                    colocation across critical highway corridors.
                  </p>
                </Reveal>

                {/* Inline stat chips */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Reveal delay={300}>
                    <div className="glass-obsidian rounded-lg px-3.5 py-2">
                      <p className="text-emerald text-sm font-bold">240+</p>
                      <p className="text-white/50 text-[10px] uppercase tracking-wide">
                        PoPs
                      </p>
                    </div>
                  </Reveal>
                  <Reveal delay={380}>
                    <div className="glass-obsidian rounded-lg px-3.5 py-2">
                      <p className="text-emerald text-sm font-bold">6 ducts</p>
                      <p className="text-white/50 text-[10px] uppercase tracking-wide">
                        per corridor
                      </p>
                    </div>
                  </Reveal>
                  <Reveal delay={460}>
                    <div className="glass-obsidian rounded-lg px-3.5 py-2">
                      <p className="text-emerald text-sm font-bold">15 yrs</p>
                      <p className="text-white/50 text-[10px] uppercase tracking-wide">
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
        <section className="relative bg-mist py-24 md:py-32 overflow-hidden">
          <div className="dot-grid-mist absolute inset-0 opacity-40 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <GlowCallout glow="emerald" className="p-8 sm:p-12 lg:p-16">
                <div className="max-w-3xl space-y-6">
                  <div className="flex flex-col gap-3">
                    <SectionBadge
                      icon={Cpu}
                      label="Strategic Growth Pipeline"
                      tone="dark"
                    />
                    <p className="text-white/50 text-xs uppercase tracking-[0.22em]">
                      The NAINA Mumbai AI Datacenter Hub
                    </p>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]">
                    Next-Gen AI Compute
                    <br className="hidden sm:block" /> Infrastructure
                  </h2>

                  <p className="text-white/70 leading-relaxed text-base sm:text-lg">
                    Our upcoming project in the pipeline is AI Datacenter
                    Infrastructure centred on a massive{' '}
                    <span className="text-emerald font-semibold">1 GW hub</span>{' '}
                    in Maharashtra&apos;s NAINA region. Designed to act as a
                    secure, sovereign{' '}
                    <span className="text-emerald font-semibold">
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
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-emerald text-xl font-bold">
                            {s.v}
                          </p>
                          <p className="text-white/60 text-xs mt-1">{s.l}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </GlowCallout>
            </Reveal>
          </div>
        </section>

        {/* ── 4.5 Latest Investor Communication ── */}
        <section
          id="latest-results"
          className="relative bg-obsidian py-24 md:py-32 overflow-hidden"
        >
          <div className="dot-grid-obsidian absolute inset-0 opacity-30 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="mb-14">
              <SectionHeading
                tone="dark"
                align="center"
                badgeIcon={Landmark}
                badgeLabel="Latest Investor Communication"
                title="Q4 FY25 financial performance."
                subtitle={
                  <>
                    Audited consolidated results and management commentary — a
                    stellar year marked by{' '}
                    <span className="text-emerald font-semibold">
                      200%+ growth in total income
                    </span>
                    , driven by successful execution of the Samruddhi Mahamarg
                    fiber project.
                  </>
                }
                className="items-center max-w-3xl mx-auto"
              />
            </div>

            {/* PDF preview dominates (3/4), stats sit compactly beside (1/4) */}
            <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">
              {/* ── Left: Live PDF preview card — spans 3 columns ── */}
              <Reveal className="lg:col-span-3">
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50">
                  {/* Preview header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald/10 border border-emerald/30 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-emerald" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">
                          KDL-Q4-2025.pdf
                        </p>
                        <p className="text-white/50 text-[10px]">
                          34 pages · 3.1 MB
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald bg-emerald/10 border border-emerald/30 rounded-full px-2.5 py-0.5">
                      LATEST
                    </span>
                  </div>

                  {/* Inline PDF viewer — taller aspect for a larger preview */}
                  <div className="relative w-full aspect-[4/3] bg-white/5">
                    <iframe
                      src="/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf#view=FitH&toolbar=0&navpanes=0&scrollbar=0"
                      className="absolute inset-0 w-full h-full"
                      title="Kore Digital Limited — Q4 FY25 Investor Presentation"
                      loading="lazy"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-obsidian/40 to-transparent pointer-events-none"
                    />
                  </div>

                  {/* Preview footer with actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-4 border-t border-white/10">
                    <a
                      href="/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald hover:brightness-110 text-obsidian font-bold text-xs px-4 py-2.5 rounded-lg transition"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Full Presentation
                    </a>
                    <a
                      href="/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf"
                      download="KDL-Q4-FY25-Investor-Presentation.pdf"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 border border-white/20 hover:border-emerald text-white hover:text-emerald font-semibold text-xs px-4 py-2.5 rounded-lg transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* ── Right: Extracted highlights ── */}
              <div className="space-y-4">
                {/* Period tabs (visual only) */}
                <div className="inline-flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-lg p-1 text-[10px] font-semibold">
                  <span className="px-3 py-1.5 rounded-md bg-emerald/10 text-emerald border border-emerald/30">
                    FY25 Consolidated
                  </span>
                  <span className="px-3 py-1.5 text-white/50">Q4 FY25</span>
                </div>

                {/* Stat rows */}
                {[
                  {
                    label: 'Total Income',
                    value: '₹327.82 Cr',
                    prev: 'FY24 · ₹105.08 Cr',
                    growthNum: 212,
                  },
                  {
                    label: 'EBITDA',
                    value: '₹47.55 Cr',
                    prev: 'FY24 · ₹17.08 Cr',
                    growthNum: 178,
                    margin: '14.50% margin',
                  },
                  {
                    label: 'Net Profit',
                    value: '₹31.70 Cr',
                    prev: 'FY24 · ₹11.49 Cr',
                    growthNum: 176,
                    margin: '9.67% margin',
                  },
                ].map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 100}>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-emerald/40 transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-white/50 text-[10px] uppercase tracking-widest">
                          {stat.label}
                        </p>
                        <span className="inline-flex items-center gap-0.5 text-emerald text-xs font-bold">
                          <TrendingUp className="w-3 h-3" />
                          <CountUp end={stat.growthNum} prefix="+" suffix="%" />
                        </span>
                      </div>
                      <p className="text-2xl font-bold leading-tight text-white tracking-tight">
                        {stat.value}
                      </p>
                      <div className="flex items-center justify-between gap-2 mt-1.5">
                        <p className="text-white/40 text-[10px]">{stat.prev}</p>
                        {stat.margin && (
                          <span className="text-white/50 text-[10px]">
                            {stat.margin}
                          </span>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}

                <p className="text-white/40 text-[10px] leading-relaxed pt-1">
                  All figures in ₹ Crores from consolidated financial statements
                  for the year ended 31 March 2025. Refer to the full
                  presentation for detailed segment reporting, cash flow, and
                  balance sheet disclosures.
                </p>
              </div>
            </div>

            {/* ── MD quote block ── */}
            <div className="mt-14 relative glass-obsidian rounded-2xl p-6 sm:p-10 overflow-hidden">
              <Quote
                aria-hidden="true"
                className="absolute top-4 left-4 w-12 h-12 text-emerald/10"
                strokeWidth={1}
              />
              <div className="relative flex flex-col sm:flex-row gap-6 items-start">
                <Reveal delay={200} className="shrink-0">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/20 ring-4 ring-emerald/15 shadow-lg shadow-black/40">
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
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed italic">
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
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-white text-sm font-semibold">
                      Mr. Ravindra Doshi
                    </p>
                    <p className="text-white/50 text-xs">
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
    <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 group">
      <Image
        src="/images/about/fiber-cable-deployment.jpg"
        alt="Fiber optic cable spools staged for the Samruddhi Mahamarg corridor deployment"
        fill
        sizes="(max-width: 1024px) 100vw, 500px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Emerald tint + gradient overlay so photo reads as part of the dark UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/25 to-transparent" />
      <div className="absolute inset-0 bg-emerald/8 mix-blend-overlay pointer-events-none" />

      {/* Corner stat pill */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 glass-obsidian rounded-full px-3 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald ticker-pulse" />
        <span className="text-[10px] font-semibold tracking-widest uppercase text-emerald">
          Live Deployment
        </span>
      </div>

      {/* Bottom caption bar */}
      <div className="absolute bottom-0 inset-x-0 p-5">
        <p className="text-emerald text-[10px] font-semibold tracking-widest uppercase mb-1">
          Samruddhi Mahamarg Corridor
        </p>
        <p className="text-white text-sm font-semibold">
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
          <stop offset="0%" stopColor="var(--color-emerald)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-emerald)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Part silhouette — aerospace bracket */}
      <polygon
        points="140,100 280,100 300,140 300,220 120,220 120,140"
        fill="var(--color-obsidian)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />
      <polygon
        points="155,115 265,115 282,148 282,205 138,205 138,148"
        fill="var(--color-obsidian)"
        stroke="rgba(255,255,255,0.15)"
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
          stroke="var(--color-emerald)"
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
          stroke="var(--color-emerald)"
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
        stroke="var(--color-emerald)"
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
        stroke="var(--color-emerald)"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      <rect
        x="340"
        y="128"
        width="68"
        height="26"
        rx="4"
        fill="var(--color-obsidian)"
        stroke="var(--color-emerald)"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      <text
        x="374"
        y="143"
        textAnchor="middle"
        fill="var(--color-emerald)"
        fontSize="9"
        fontFamily="ui-monospace,monospace"
      >
        0.025 mm
      </text>
      <text
        x="374"
        y="152"
        textAnchor="middle"
        fill="rgba(255,255,255,0.5)"
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
        fill="var(--color-obsidian)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.8"
      />
      <text
        x="162"
        y="249"
        textAnchor="middle"
        fill="rgba(255,255,255,0.6)"
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
        fill="var(--color-obsidian)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.8"
      />
      <text
        x="236"
        y="249"
        textAnchor="middle"
        fill="rgba(255,255,255,0.6)"
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
        fill="var(--color-emerald)"
        fillOpacity="0.7"
        filter="url(#glowM)"
      />
      <circle
        cx="300"
        cy="100"
        r="3"
        fill="var(--color-emerald)"
        fillOpacity="0.7"
        filter="url(#glowM)"
      />
      <circle
        cx="120"
        cy="220"
        r="3"
        fill="var(--color-emerald)"
        fillOpacity="0.6"
      />
      <circle
        cx="300"
        cy="220"
        r="3"
        fill="var(--color-emerald)"
        fillOpacity="0.6"
      />
    </svg>
  );
}
