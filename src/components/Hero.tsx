import Link from "next/link";
import { ArrowRight, Network, TrendingUp, Building2 } from "lucide-react";
import { keyMetrics } from "@/data/financials";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-kd-bg">
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #22d3ee18 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Radial glow at center-right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 top-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          {/* ── Left: Content ── */}
          <div className="space-y-8">
            {/* NSE badge */}
            <div className="inline-flex items-center gap-2.5 bg-kd-card border border-kd-border rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400 tracking-widest uppercase">
                NSE Listed
              </span>
              <span className="text-slate-600 text-xs">|</span>
              <span className="text-xs text-cyan-400 font-mono">
                {keyMetrics.ticker}
              </span>
              <span className="text-slate-600 text-xs">|</span>
              <span className="text-xs text-slate-500 font-mono">
                {keyMetrics.isin}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.1] tracking-tight">
                Architecting India&apos;s{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
                  Next-Gen
                </span>
                <br />
                Industrial &amp; Digital
                <br />
                Infrastructure
              </h1>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                A multi-sector deep-tech conglomerate delivering fiber
                connectivity at national scale, hyperscale AI compute, and
                precision aerospace-grade manufacturing — engineered for
                India&apos;s infrastructure decade.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/investor-relations"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded transition-colors text-sm"
              >
                Investor Relations <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/business"
                className="inline-flex items-center gap-2 border border-kd-border-hi hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 px-6 py-3 rounded transition-all text-sm"
              >
                Our Business Segments
              </Link>
            </div>

            {/* Metrics strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-kd-border">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-widest">
                  <Network className="w-3 h-3" /> Fiber
                </div>
                <p className="text-2xl font-bold text-white">
                  {keyMetrics.fiberKmDeployed}
                </p>
                <p className="text-[11px] text-slate-500">Active backbone</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-widest">
                  <TrendingUp className="w-3 h-3" /> Pipeline
                </div>
                <p className="text-2xl font-bold text-white">
                  {keyMetrics.totalOrderBook}
                </p>
                <p className="text-[11px] text-slate-500">Order book</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-widest">
                  <Building2 className="w-3 h-3" /> Compute
                </div>
                <p className="text-2xl font-bold text-white">
                  {keyMetrics.datacenterCapacity}
                </p>
                <p className="text-[11px] text-slate-500">AI datacenter</p>
              </div>
            </div>
          </div>

          {/* ── Right: Tech Visualization SVG ── */}
          <div className="hidden lg:flex items-center justify-center">
            <TechVisualization />
          </div>
        </div>
      </div>
    </section>
  );
}

function TechVisualization() {
  return (
    <svg
      viewBox="0 0 560 520"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[500px]"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hub-bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="amber-bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <filter id="fcyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="famber" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background glows */}
      <circle cx="280" cy="260" r="170" fill="url(#hub-bg-glow)" />
      <circle cx="350" cy="340" r="120" fill="url(#amber-bg-glow)" />

      {/* ── Static fiber path traces ── */}
      <path d="M 85,100 Q 155,185 280,260" stroke="#22d3ee" strokeWidth="0.5" fill="none" strokeOpacity="0.2" />
      <path d="M 475,85 Q 405,170 280,260" stroke="#22d3ee" strokeWidth="0.5" fill="none" strokeOpacity="0.2" />
      <path d="M 515,260 Q 430,260 280,260" stroke="#22d3ee" strokeWidth="0.5" fill="none" strokeOpacity="0.2" />
      <path d="M 435,435 Q 375,380 280,260" stroke="#f59e0b" strokeWidth="0.5" fill="none" strokeOpacity="0.2" />
      <path d="M 100,430 Q 170,380 280,260" stroke="#f59e0b" strokeWidth="0.5" fill="none" strokeOpacity="0.2" />

      {/* ── Animated data-flow pulses on each path ── */}
      <path d="M 85,100 Q 155,185 280,260" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"
        strokeDasharray="160" strokeDashoffset="160">
        <animate attributeName="stroke-dashoffset" values="160;0;0" keyTimes="0;0.7;1" dur="3.2s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.82;1" dur="3.2s" begin="0s" repeatCount="indefinite" />
      </path>
      <path d="M 475,85 Q 405,170 280,260" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"
        strokeDasharray="175" strokeDashoffset="175">
        <animate attributeName="stroke-dashoffset" values="175;0;0" keyTimes="0;0.7;1" dur="3.2s" begin="0.65s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.82;1" dur="3.2s" begin="0.65s" repeatCount="indefinite" />
      </path>
      <path d="M 515,260 Q 430,260 280,260" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"
        strokeDasharray="150" strokeDashoffset="150">
        <animate attributeName="stroke-dashoffset" values="150;0;0" keyTimes="0;0.7;1" dur="3.2s" begin="1.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.82;1" dur="3.2s" begin="1.3s" repeatCount="indefinite" />
      </path>
      <path d="M 435,435 Q 375,380 280,260" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round"
        strokeDasharray="185" strokeDashoffset="185">
        <animate attributeName="stroke-dashoffset" values="185;0;0" keyTimes="0;0.7;1" dur="3.2s" begin="1.95s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.82;1" dur="3.2s" begin="1.95s" repeatCount="indefinite" />
      </path>
      <path d="M 100,430 Q 170,380 280,260" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round"
        strokeDasharray="170" strokeDashoffset="170">
        <animate attributeName="stroke-dashoffset" values="170;0;0" keyTimes="0;0.7;1" dur="3.2s" begin="2.55s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.82;1" dur="3.2s" begin="2.55s" repeatCount="indefinite" />
      </path>

      {/* ── Central hub rings ── */}
      <circle cx="280" cy="260" r="108" stroke="#22d3ee" strokeWidth="0.5" fill="none" strokeOpacity="0.12" strokeDasharray="8 5" />
      <circle cx="280" cy="260" r="80" stroke="#22d3ee" strokeWidth="0.5" fill="none" strokeOpacity="0.2" strokeDasharray="4 7" />
      <circle cx="280" cy="260" r="56" stroke="#22d3ee" strokeWidth="1" fill="none" strokeOpacity="0.5" />
      <circle cx="280" cy="260" r="53" fill="#07101f" />

      {/* Hub inner detail */}
      <circle cx="280" cy="260" r="42" stroke="#22d3ee" strokeWidth="0.5" fill="none" strokeOpacity="0.25" strokeDasharray="3 5" />
      <line x1="257" y1="260" x2="303" y2="260" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.35" />
      <line x1="280" y1="237" x2="280" y2="283" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.35" />
      <line x1="264" y1="244" x2="296" y2="276" stroke="#22d3ee" strokeWidth="0.4" strokeOpacity="0.18" />
      <line x1="296" y1="244" x2="264" y2="276" stroke="#22d3ee" strokeWidth="0.4" strokeOpacity="0.18" />

      {/* Hub core */}
      <circle cx="280" cy="260" r="22" fill="#0b1528" stroke="#22d3ee" strokeWidth="1.5">
        <animate attributeName="opacity" values="1;0.55;1" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="280" cy="260" r="13" fill="#22d3ee" fillOpacity="0.18" />
      <circle cx="280" cy="260" r="7" fill="#22d3ee" fillOpacity="0.85" filter="url(#fcyan)" />

      {/* Orbiting dot — clockwise */}
      <circle cx="388" cy="260" r="5" fill="#22d3ee" filter="url(#fcyan)">
        <animateTransform attributeName="transform" type="rotate" from="0 280 260" to="360 280 260" dur="9s" repeatCount="indefinite" />
      </circle>

      {/* Orbiting dot — counter-clockwise, inner ring */}
      <circle cx="352" cy="260" r="3.5" fill="#f59e0b" filter="url(#famber)">
        <animateTransform attributeName="transform" type="rotate" from="180 280 260" to="-180 280 260" dur="14s" repeatCount="indefinite" />
      </circle>

      {/* ── Peripheral nodes ── */}
      {/* N1 – Fiber Network (top-left) */}
      <circle cx="85" cy="100" r="26" fill="#07101f" stroke="#22d3ee" strokeWidth="1.5" />
      <circle cx="85" cy="100" r="13" fill="#22d3ee" fillOpacity="0.1" />
      <circle cx="85" cy="100" r="5.5" fill="#22d3ee" fillOpacity="0.9" filter="url(#fcyan)">
        <animate attributeName="r" values="5.5;7;5.5" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <text x="85" y="137" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="ui-sans-serif, system-ui">Fiber Network</text>

      {/* N2 – AI Compute (top-right) */}
      <circle cx="475" cy="85" r="26" fill="#07101f" stroke="#22d3ee" strokeWidth="1.5" />
      <circle cx="475" cy="85" r="13" fill="#22d3ee" fillOpacity="0.1" />
      <circle cx="475" cy="85" r="5.5" fill="#22d3ee" fillOpacity="0.9" filter="url(#fcyan)">
        <animate attributeName="r" values="5.5;7;5.5" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
      </circle>
      <text x="475" y="122" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="ui-sans-serif, system-ui">AI Compute</text>

      {/* N3 – Datacenter (right) */}
      <circle cx="515" cy="260" r="26" fill="#07101f" stroke="#22d3ee" strokeWidth="1.5" />
      <circle cx="515" cy="260" r="13" fill="#22d3ee" fillOpacity="0.1" />
      <circle cx="515" cy="260" r="5.5" fill="#22d3ee" fillOpacity="0.9" filter="url(#fcyan)">
        <animate attributeName="r" values="5.5;7;5.5" dur="2.5s" begin="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.5s" begin="1.6s" repeatCount="indefinite" />
      </circle>
      <text x="515" y="297" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="ui-sans-serif, system-ui">Datacenter</text>

      {/* N4 – 3D Printing (bottom-right) */}
      <circle cx="435" cy="435" r="26" fill="#07101f" stroke="#f59e0b" strokeWidth="1.5" />
      <circle cx="435" cy="435" r="13" fill="#f59e0b" fillOpacity="0.1" />
      <circle cx="435" cy="435" r="5.5" fill="#f59e0b" fillOpacity="0.9" filter="url(#famber)">
        <animate attributeName="r" values="5.5;7;5.5" dur="2.5s" begin="0.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.5s" begin="0.4s" repeatCount="indefinite" />
      </circle>
      <text x="435" y="472" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="ui-sans-serif, system-ui">3D Printing</text>

      {/* N5 – Aerospace (bottom-left) */}
      <circle cx="100" cy="430" r="26" fill="#07101f" stroke="#f59e0b" strokeWidth="1.5" />
      <circle cx="100" cy="430" r="13" fill="#f59e0b" fillOpacity="0.1" />
      <circle cx="100" cy="430" r="5.5" fill="#f59e0b" fillOpacity="0.9" filter="url(#famber)">
        <animate attributeName="r" values="5.5;7;5.5" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
      </circle>
      <text x="100" y="467" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="ui-sans-serif, system-ui">Aerospace</text>

      {/* ── Floating hexagons (flat-top, circumradius r) ── */}
      {/* Hex A: center (47, 195) r=18 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-7;0,0"
          dur="5s" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" keyTimes="0;0.5;1" repeatCount="indefinite" />
        <polygon points="65,195 56,210.6 38,210.6 29,195 38,179.4 56,179.4"
          fill="none" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.35" />
        <polygon points="60,195 54,205.4 42,205.4 36,195 42,184.6 54,184.6"
          fill="#22d3ee" fillOpacity="0.04" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.15" />
      </g>
      {/* Hex B: center (504, 170) r=16 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0"
          dur="7s" begin="1.2s" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" keyTimes="0;0.5;1" repeatCount="indefinite" />
        <polygon points="520,170 512,183.9 496,183.9 488,170 496,156.1 512,156.1"
          fill="none" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.32" />
      </g>
      {/* Hex C: center (36, 355) r=14 — amber */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0"
          dur="6.5s" begin="2s" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" keyTimes="0;0.5;1" repeatCount="indefinite" />
        <polygon points="50,355 43,367.1 29,367.1 22,355 29,342.9 43,342.9"
          fill="none" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.28" />
      </g>
      {/* Hex D: center (500, 378) r=14 — amber */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0"
          dur="5.8s" begin="0.7s" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" keyTimes="0;0.5;1" repeatCount="indefinite" />
        <polygon points="514,378 507,390.1 493,390.1 486,378 493,365.9 507,365.9"
          fill="none" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.28" />
      </g>
      {/* Hex E: center (276, 42) r=12 — tiny */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0"
          dur="6s" begin="1.8s" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" keyTimes="0;0.5;1" repeatCount="indefinite" />
        <polygon points="288,42 282,52.4 270,52.4 264,42 270,31.6 282,31.6"
          fill="none" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.22" />
      </g>

      {/* ── Accent micro-dots ── */}
      <circle cx="180" cy="155" r="2.5" fill="#22d3ee" fillOpacity="0.4" />
      <circle cx="198" cy="355" r="2" fill="#22d3ee" fillOpacity="0.3" />
      <circle cx="370" cy="148" r="2.5" fill="#22d3ee" fillOpacity="0.4" />
      <circle cx="362" cy="368" r="2" fill="#f59e0b" fillOpacity="0.35" />
      <circle cx="157" cy="310" r="2" fill="#22d3ee" fillOpacity="0.25" />
      <circle cx="398" cy="308" r="2.5" fill="#22d3ee" fillOpacity="0.3" />

      {/* Mid-path cross markers */}
      <line x1="185" y1="195" x2="196" y2="195" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="190.5" y1="189.5" x2="190.5" y2="200.5" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="368" y1="196" x2="379" y2="196" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="373.5" y1="190.5" x2="373.5" y2="201.5" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.4" />
    </svg>
  );
}
