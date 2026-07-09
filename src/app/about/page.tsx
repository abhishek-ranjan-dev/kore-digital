import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Zap,
  Radio,
  FileText,
  Download,
  TrendingUp,
  Quote,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Kore Digital Limited is a premier infrastructure architect specialising in telecommunications, AI compute, and deep-tech precision manufacturing — building India's physical and digital future.",
};

/* ─── Data ─────────────────────────────────────────────────────────────── */

const METRICS = [
  {
    value: "701 km",
    label: "High-Speed Optic Fiber Corridor",
    accent: "text-cyan-400",
    border: "border-cyan-400/20",
    glow: "shadow-cyan-500/10",
  },
  {
    value: "₹1,500+ Cr",
    label: "Projected Concession Revenue Pipeline",
    accent: "text-amber-400",
    border: "border-amber-400/20",
    glow: "shadow-amber-500/10",
  },
  {
    value: "1 GW",
    label: "AI Datacenter Target Capacity",
    accent: "text-cyan-400",
    border: "border-cyan-400/20",
    glow: "shadow-cyan-500/10",
  },
  {
    value: "0.025 mm",
    label: "Precision Aerospace Scanning Accuracy",
    accent: "text-amber-400",
    border: "border-amber-400/20",
    glow: "shadow-amber-500/10",
  },
];

const PILLARS = [
  {
    id: "telecom",
    tag: "15-Year Concession Framework",
    tagColor: "bg-cyan-400/10 text-cyan-400 border-cyan-400/25",
    title: "The Samruddhi Mahamarg Flagship Corridor",
    pillar: "Pillar A · Telecommunications Backbone",
    body: "Our flagship project is the Samruddhi Mahamarg, a 701-km corridor where we are deploying a high-speed optic fiber duct backbone. This 15-year concession involves laying six ducts to facilitate high-speed connectivity, with total expected revenue exceeding ₹1,500 Cr upon completion.",
    graphic: <TelecomPhoto />,
    reverse: false,
  },
  {
    id: "manufacturing",
    tag: "Advanced Material Defensibility",
    tagColor: "bg-amber-400/10 text-amber-400 border-amber-400/25",
    title: "Precision Engineering & Additive Manufacturing",
    pillar: "Pillar B · Deep-Tech Additive Manufacturing",
    body: "Through our strategic collaboration with Kore Additive Manufacturing and Medical Reconstruction Pvt. Ltd., we pioneer reverse engineering and additive manufacturing for the medical, defense, and aerospace sectors. Utilising advanced hardware including the Zeiss 3D Scanner (0.025 mm accuracy) and the Meltio M450 metal printer, we manufacture critical spares in high-performance materials such as Titanium and Nickel Alloys.",
    graphic: <ManufacturingGraphic />,
    reverse: true,
  },
];

const INCUBATORS = [
  {
    name: "SINE IIT Bombay",
    sub: "Society for Innovation & Entrepreneurship",
    note: "Premier tech incubator, IIT Bombay",
    accent: "border-cyan-400/30 hover:border-cyan-400/60",
    dot: "bg-cyan-400",
  },
  {
    name: "Riidl KJ Somaiya",
    sub: "Research, Innovation & Incubation Design Lab",
    note: "KJ Somaiya College, Mumbai",
    accent: "border-amber-400/30 hover:border-amber-400/60",
    dot: "bg-amber-400",
  },
  {
    name: "Yenepoya Technology Incubator",
    sub: "Yenepoya (Deemed to be University)",
    note: "Mangaluru, Karnataka",
    accent: "border-indigo-400/30 hover:border-indigo-400/60",
    dot: "bg-indigo-400",
  },
];

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16 bg-kd-bg">

        {/* ── 1. Hero ── */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          {/* Background photograph — fiber optic patch panel */}
          <div className="absolute inset-0">
            <Image
              src="/images/about/fiber-optic-network.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/*
              Text-readability overlay
              ────────────────────────
              Single dark scrim (~55 %) keeps navy-heavy tint but lets the
              patch-panel cables read through clearly, plus a radial vignette
              that darkens the centre where the headline sits.
            */}
            <div className="absolute inset-0 bg-kd-bg/55" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(4,8,15,0.55) 0%, rgba(4,8,15,0.35) 45%, rgba(4,8,15,0.7) 100%)",
              }}
            />
            {/* Bottom fade into next section */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-kd-bg" />
          </div>

          {/* Ambient accent glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/6 blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-kd-card border border-kd-border rounded-full px-4 py-1.5 mb-2">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span className="text-xs text-slate-400 tracking-widest uppercase">
                About Kore Digital Limited
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight">
              Architecting India&apos;s{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-400 bg-clip-text text-transparent">
                Physical &amp; Digital
              </span>
              {" "}Future
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
              Kore Digital Limited (KDL) operates as a premier infrastructure
              architect specialising in telecommunications and deep-tech
              manufacturing — building the connectivity, compute, and
              precision-hardware layers that power India&apos;s next decade.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/investor-relations"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded transition-colors text-sm"
              >
                Investor Relations <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-kd-border-hi hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 px-6 py-3 rounded transition-all text-sm"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. Macro Metrics ── */}
        <section className="border-t border-kd-border bg-kd-surface py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-3">
                Operational Scale
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Key Figures at a Glance
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  className={`bg-kd-card border ${m.border} rounded-2xl p-6 sm:p-8 flex flex-col gap-3 hover:shadow-xl ${m.glow} transition-shadow duration-300`}
                >
                  <p className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${m.accent}`}>
                    {m.value}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-snug">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Industrial Core — Alternating Pillars ── */}
        <section className="border-t border-kd-border py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
            <div className="text-center">
              <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3">
                Industrial Core
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                The Two Pillars of Our Business
              </h2>
            </div>

            {PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  pillar.reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Text side */}
                <div className="space-y-5">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">
                    {pillar.pillar}
                  </p>
                  <span
                    className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full border ${pillar.tagColor}`}
                  >
                    {pillar.tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {pillar.body}
                  </p>
                </div>

                {/* Graphic side */}
                <div className="flex items-center justify-center">
                  {pillar.graphic}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3.5 Field Operations Banner ── */}
        <section className="relative overflow-hidden border-t border-kd-border">
          <div className="relative h-[340px] sm:h-[420px] w-full">
            <Image
              src="/images/about/telecom-tower.jpg"
              alt="Telecommunications tower supporting India's mobile & fiber connectivity infrastructure"
              fill
              sizes="100vw"
              className="object-cover"
            />
            {/* Multi-layer overlay to darken and colour-tint */}
            <div className="absolute inset-0 bg-gradient-to-r from-kd-bg via-kd-bg/85 to-kd-bg/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-kd-bg/60 via-transparent to-kd-bg/60" />

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-xl space-y-5">
                <div className="inline-flex items-center gap-2 bg-kd-card/80 backdrop-blur-md border border-kd-border rounded-full px-3.5 py-1.5">
                  <Radio className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] text-slate-300 tracking-widest uppercase font-semibold">
                    Field Operations
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug">
                  Connectivity Backbone,{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
                    Built on the Ground
                  </span>
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  From tower sites to trunk fiber, we build and operate the
                  physical infrastructure that keeps India connected — spanning
                  telecom concessions, dark-fiber leasing, and multi-operator
                  colocation across critical highway corridors.
                </p>

                {/* Inline stat chips */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="bg-kd-card/70 backdrop-blur-md border border-kd-border rounded-lg px-3.5 py-2">
                    <p className="text-cyan-400 text-sm font-bold">240+</p>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wide">PoPs</p>
                  </div>
                  <div className="bg-kd-card/70 backdrop-blur-md border border-kd-border rounded-lg px-3.5 py-2">
                    <p className="text-cyan-400 text-sm font-bold">6 ducts</p>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wide">per corridor</p>
                  </div>
                  <div className="bg-kd-card/70 backdrop-blur-md border border-kd-border rounded-lg px-3.5 py-2">
                    <p className="text-amber-400 text-sm font-bold">15 yrs</p>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wide">concession</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Strategic Growth Pipeline ── */}
        <section className="border-t border-kd-border py-24 bg-kd-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Featured callout card with cyan glow outline */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ padding: "1px" }}
            >
              {/* Glowing cyan border */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #22d3ee 25%, #0284c7 50%, transparent 70%, #0ea5e9 100%)",
                  opacity: 0.45,
                }}
              />
              <div className="relative bg-kd-card rounded-2xl p-8 sm:p-12 lg:p-16">
                <div className="max-w-3xl space-y-6">
                  <div className="space-y-1">
                    <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">
                      Strategic Growth Pipeline
                    </p>
                    <p className="text-slate-500 text-xs uppercase tracking-widest">
                      The NAINA Mumbai AI Datacenter Hub
                    </p>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
                    Next-Gen AI Compute
                    <br className="hidden sm:block" /> Infrastructure
                  </h2>

                  <p className="text-slate-400 leading-relaxed text-base sm:text-lg">
                    Our upcoming project in the pipeline is AI Datacenter
                    Infrastructure centred on a massive{" "}
                    <span className="text-cyan-300 font-semibold">1 GW hub</span>{" "}
                    in Maharashtra&apos;s NAINA region. Designed to act as a
                    secure, sovereign{" "}
                    <span className="text-cyan-300 font-semibold">
                      &ldquo;Digital Safe Haven&rdquo;
                    </span>
                    , this hub is engineered to anchor the intensive compute
                    loads of the next generation of artificial intelligence.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-4 pt-4">
                    {[
                      { v: "1 GW", l: "Target Compute Capacity" },
                      { v: "NAINA", l: "Maharashtra Region" },
                      { v: "AI-Ready", l: "Sovereign Infrastructure" },
                    ].map((s) => (
                      <div
                        key={s.l}
                        className="bg-kd-elevated border border-kd-border rounded-xl p-4"
                      >
                        <p className="text-cyan-400 text-xl font-bold">{s.v}</p>
                        <p className="text-slate-500 text-xs mt-1">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-8 w-48 h-48 rounded-full bg-amber-500/4 blur-3xl pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 4.5 Latest Investor Communication ── */}
        <section
          id="latest-results"
          className="border-t border-kd-border py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-14 space-y-3">
              <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
                Latest Investor Communication
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Q4 FY25 Financial Performance
              </h2>
              <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Audited consolidated results and management commentary — a
                stellar year marked by{" "}
                <span className="text-amber-300 font-semibold">
                  200%+ growth in total income
                </span>
                , driven by successful execution of the Samruddhi Mahamarg
                fiber project.
              </p>
            </div>

            {/* PDF preview dominates (3/4), stats sit compactly beside (1/4) */}
            <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">

              {/* ── Left: Live PDF preview card — spans 3 columns ── */}
              <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-kd-border bg-kd-card shadow-2xl shadow-black/60">
                {/* Preview header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-kd-border bg-kd-elevated">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold truncate">
                        KDL-Q4-2025.pdf
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        34 pages · 3.1 MB
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 rounded-full px-2.5 py-0.5">
                    LATEST
                  </span>
                </div>

                {/* Inline PDF viewer — taller aspect for a larger, immersive preview */}
                <div className="relative w-full aspect-[4/3] bg-slate-200">
                  <iframe
                    src="/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf#view=FitH&toolbar=0&navpanes=0&scrollbar=0"
                    className="absolute inset-0 w-full h-full"
                    title="Kore Digital Limited — Q4 FY25 Investor Presentation"
                    loading="lazy"
                  />
                  {/* Subtle top fade for aesthetic consistency */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/30 to-transparent pointer-events-none"
                  />
                </div>

                {/* Preview footer with actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-4 border-t border-kd-border">
                  <a
                    href="/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Full Presentation
                  </a>
                  <a
                    href="/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf"
                    download="KDL-Q4-FY25-Investor-Presentation.pdf"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border border-kd-border-hi hover:border-amber-400/50 text-slate-300 hover:text-amber-300 font-semibold text-xs px-4 py-2.5 rounded transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </a>
                </div>
              </div>

              {/* ── Right: Extracted highlights ── */}
              <div className="space-y-4">
                {/* Period tabs (visual only) */}
                <div className="inline-flex items-center gap-1 bg-kd-card border border-kd-border rounded-lg p-1 text-[11px] font-semibold">
                  <span className="px-3 py-1.5 rounded-md bg-kd-elevated text-cyan-300 border border-cyan-400/30">
                    FY25 Consolidated
                  </span>
                  <span className="px-3 py-1.5 text-slate-500">
                    Q4 FY25
                  </span>
                </div>

                {/* Stat rows */}
                {[
                  {
                    label: "Total Income",
                    value: "₹327.82 Cr",
                    prev: "FY24 · ₹105.08 Cr",
                    growth: "+212%",
                    accent: "text-amber-400",
                    border: "border-amber-400/20",
                  },
                  {
                    label: "EBITDA",
                    value: "₹47.55 Cr",
                    prev: "FY24 · ₹17.08 Cr",
                    growth: "+178%",
                    margin: "14.50% margin",
                    accent: "text-cyan-400",
                    border: "border-cyan-400/20",
                  },
                  {
                    label: "Net Profit",
                    value: "₹31.70 Cr",
                    prev: "FY24 · ₹11.49 Cr",
                    growth: "+176%",
                    margin: "9.67% margin",
                    accent: "text-emerald-400",
                    border: "border-emerald-400/20",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`bg-kd-card border ${stat.border} rounded-xl p-4 hover:bg-kd-elevated transition-colors`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest">
                        {stat.label}
                      </p>
                      <span className="inline-flex items-center gap-0.5 text-emerald-400 text-xs font-bold">
                        <TrendingUp className="w-3 h-3" />
                        {stat.growth}
                      </span>
                    </div>
                    <p className={`text-2xl font-bold leading-tight ${stat.accent}`}>
                      {stat.value}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <p className="text-slate-600 text-[11px]">{stat.prev}</p>
                      {stat.margin && (
                        <span className="text-slate-500 text-[11px]">
                          {stat.margin}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                <p className="text-slate-600 text-[10px] leading-relaxed pt-1">
                  All figures in ₹ Crores from consolidated financial statements
                  for the year ended 31 March 2025. Refer to the full
                  presentation for detailed segment reporting, cash flow, and
                  balance sheet disclosures.
                </p>
              </div>
            </div>

            {/* ── MD quote block ── */}
            <div className="mt-14 relative bg-kd-card border border-kd-border rounded-2xl p-6 sm:p-10 overflow-hidden">
              <Quote
                aria-hidden="true"
                className="absolute top-4 left-4 w-12 h-12 text-cyan-400/8"
                strokeWidth={1}
              />
              <div className="relative flex flex-col sm:flex-row gap-6 items-start">
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-amber-500/15 border border-kd-border-hi flex items-center justify-center">
                    <span className="text-white font-bold text-sm">RD</span>
                  </div>
                </div>
                <div className="space-y-3 min-w-0">
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic">
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
                  <div className="pt-2 border-t border-kd-border/60">
                    <p className="text-white text-sm font-semibold">
                      Mr. Ravindra Doshi
                    </p>
                    <p className="text-slate-500 text-xs">
                      Managing Director, Kore Digital Limited
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Incubation Ecosystem ── */}
        <section className="border-t border-kd-border py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 space-y-3">
              <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase">
                Research &amp; Innovation
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Our Incubation &amp; Research Network
              </h2>
              <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Our deep-tech manufacturing systems are incubated and validated
                at India&apos;s premier scientific institutions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {INCUBATORS.map((inc) => (
                <div
                  key={inc.name}
                  className={`bg-kd-card border ${inc.accent} rounded-2xl p-8 space-y-4 transition-all duration-300`}
                >
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${inc.dot}`} />
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-lg leading-snug">
                      {inc.name}
                    </h3>
                    <p className="text-slate-400 text-sm">{inc.sub}</p>
                  </div>
                  <p className="text-slate-600 text-xs">{inc.note}</p>
                </div>
              ))}
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
    <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-kd-border shadow-2xl shadow-black/50 group">
      <Image
        src="/images/about/fiber-cable-deployment.jpg"
        alt="Fiber optic cable spools staged for the Samruddhi Mahamarg corridor deployment"
        fill
        sizes="(max-width: 1024px) 100vw, 500px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Cyan tint + gradient overlay so photo reads as part of the dark UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-kd-bg/85 via-kd-bg/25 to-transparent" />
      <div className="absolute inset-0 bg-cyan-500/8 mix-blend-overlay pointer-events-none" />

      {/* Corner stat pill */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-kd-card/90 backdrop-blur-md border border-cyan-400/40 rounded-full px-3 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[10px] font-semibold tracking-widest uppercase text-cyan-300">
          Live Deployment
        </span>
      </div>

      {/* Bottom caption bar */}
      <div className="absolute bottom-0 inset-x-0 p-5">
        <p className="text-cyan-300 text-[10px] font-semibold tracking-widest uppercase mb-1">
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
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="scanGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Part silhouette — aerospace bracket */}
      <polygon points="140,100 280,100 300,140 300,220 120,220 120,140"
        fill="#0b1528" stroke="#334155" strokeWidth="1.5" />
      <polygon points="155,115 265,115 282,148 282,205 138,205 138,148"
        fill="#07101f" stroke="#1e293b" strokeWidth="1" />

      {/* Scanner grid overlay */}
      {[130, 150, 170, 190, 210].map(y => (
        <line key={y} x1="125" y1={y} x2="295" y2={y}
          stroke="#f59e0b" strokeWidth="0.4" strokeOpacity="0.25" />
      ))}
      {[145, 175, 205, 235, 265].map(x => (
        <line key={x} x1={x} y1="105" x2={x} y2="215"
          stroke="#f59e0b" strokeWidth="0.4" strokeOpacity="0.25" />
      ))}

      {/* Scanner beam */}
      <line x1="120" y1="130" x2="300" y2="130" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.8" filter="url(#glowM)">
        <animate attributeName="y1" values="110;215;110" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y2" values="110;215;110" dur="3s" repeatCount="indefinite" />
      </line>

      {/* Radial glow at scan point */}
      <circle cx="210" cy="162" r="40" fill="url(#scanGrad)">
        <animate attributeName="cy" values="115;215;115" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Measurement callout */}
      <line x1="300" y1="155" x2="340" y2="140" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.5" />
      <rect x="340" y="128" width="68" height="26" rx="4" fill="#0b1528" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.5" />
      <text x="374" y="143" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="ui-monospace,monospace">0.025 mm</text>
      <text x="374" y="152" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-sans-serif">Zeiss 3D Scan</text>

      {/* Material badge */}
      <rect x="130" y="236" width="64" height="20" rx="3" fill="#0b1528" stroke="#334155" strokeWidth="0.8" />
      <text x="162" y="249" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="ui-sans-serif">Ti Alloy</text>
      <rect x="202" y="236" width="68" height="20" rx="3" fill="#0b1528" stroke="#334155" strokeWidth="0.8" />
      <text x="236" y="249" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="ui-sans-serif">Ni Alloy</text>

      {/* Corner dots */}
      <circle cx="120" cy="100" r="3" fill="#f59e0b" fillOpacity="0.6" filter="url(#glowM)" />
      <circle cx="300" cy="100" r="3" fill="#f59e0b" fillOpacity="0.6" filter="url(#glowM)" />
      <circle cx="120" cy="220" r="3" fill="#f59e0b" fillOpacity="0.6" />
      <circle cx="300" cy="220" r="3" fill="#f59e0b" fillOpacity="0.6" />
    </svg>
  );
}
