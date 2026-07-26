import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { keyMetrics } from "@/data/financials";
import StatBlock from "@/components/ui/StatBlock";

export default function HeroDark() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-obsidian">
      <div className="dot-grid-obsidian absolute inset-0 pointer-events-none opacity-40" />

      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald/10 blur-3xl pointer-events-none" />
      <div className="absolute right-[10%] top-[15%] w-[300px] h-[300px] rounded-full bg-cyan-glow/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
              <span className="ticker-pulse bg-emerald w-2 h-2 rounded-full" />
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-medium">
                NSE Listed
              </span>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-xs text-emerald font-mono">
                {keyMetrics.ticker}
              </span>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-xs text-white/50 font-mono">
                {keyMetrics.isin}
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                Architecting India&apos;s
                <br />
                <span className="bg-gradient-to-r from-emerald to-cyan-glow bg-clip-text text-transparent">
                  Deep-Tech
                </span>
                <br />
                Infrastructure.
              </h1>
              <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                A multi-sector deep-tech conglomerate delivering fiber
                connectivity at national scale, hyperscale AI compute, and
                precision aerospace-grade manufacturing — engineered for
                India&apos;s infrastructure decade.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/investor-relations"
                className="bg-emerald text-obsidian font-bold px-6 py-3 rounded-lg text-sm inline-flex items-center gap-2 hover:brightness-110 transition"
              >
                Investor Relations
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="border border-white/20 text-white font-semibold px-6 py-3 rounded-lg text-sm hover:border-emerald hover:text-emerald transition"
              >
                Explore Capabilities
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <StatBlock
                tone="dark"
                size="md"
                value="701"
                unit="km"
                label="Fiber deployed"
                caption="Active backbone"
              />
              <StatBlock
                tone="dark"
                size="md"
                value="₹1,500+"
                unit="Cr"
                label="Order book"
                caption="FY25 pipeline"
              />
              <StatBlock
                tone="dark"
                size="md"
                value="1"
                unit="GW"
                label="AI compute"
                caption="Datacenter capacity"
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <NetworkMesh />
          </div>
        </div>
      </div>
    </section>
  );
}

function NetworkMesh() {
  return (
    <svg
      viewBox="0 0 560 520"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[520px]"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hub-glow-emerald" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#10B981" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hub-glow-cyan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
        </radialGradient>
        <filter id="soft-glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="soft-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hub-core-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <circle cx="280" cy="260" r="190" fill="url(#hub-glow-emerald)" />
      <circle cx="330" cy="220" r="140" fill="url(#hub-glow-cyan)" />

      <path d="M 85,100 Q 155,185 280,260" stroke="#10B981" strokeWidth="0.5" fill="none" strokeOpacity="0.32" />
      <path d="M 475,85 Q 405,170 280,260" stroke="#22D3EE" strokeWidth="0.5" fill="none" strokeOpacity="0.3" />
      <path d="M 515,260 Q 430,260 280,260" stroke="#10B981" strokeWidth="0.5" fill="none" strokeOpacity="0.28" />
      <path d="M 435,435 Q 375,380 280,260" stroke="#22D3EE" strokeWidth="0.5" fill="none" strokeOpacity="0.28" />
      <path d="M 100,430 Q 170,380 280,260" stroke="#10B981" strokeWidth="0.5" fill="none" strokeOpacity="0.3" />

      <path
        d="M 85,100 Q 155,185 280,260"
        stroke="#10B981"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="40 180"
        strokeDashoffset="220"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="220"
          to="0"
          dur="3s"
          begin="0s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M 475,85 Q 405,170 280,260"
        stroke="#22D3EE"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="40 180"
        strokeDashoffset="220"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="220"
          to="0"
          dur="3s"
          begin="0.6s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M 515,260 Q 430,260 280,260"
        stroke="#10B981"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="40 180"
        strokeDashoffset="220"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="220"
          to="0"
          dur="3s"
          begin="1.2s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M 435,435 Q 375,380 280,260"
        stroke="#22D3EE"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="40 180"
        strokeDashoffset="220"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="220"
          to="0"
          dur="3s"
          begin="1.8s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M 100,430 Q 170,380 280,260"
        stroke="#10B981"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="40 180"
        strokeDashoffset="220"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="220"
          to="0"
          dur="3s"
          begin="2.4s"
          repeatCount="indefinite"
        />
      </path>

      <circle cx="280" cy="260" r="108" stroke="#10B981" strokeWidth="0.5" fill="none" strokeOpacity="0.14" strokeDasharray="8 5" />
      <circle cx="280" cy="260" r="80" stroke="#22D3EE" strokeWidth="0.5" fill="none" strokeOpacity="0.2" strokeDasharray="4 7" />
      <circle cx="280" cy="260" r="56" stroke="#10B981" strokeWidth="1" fill="none" strokeOpacity="0.55" />

      <circle cx="280" cy="260" r="42" stroke="#10B981" strokeWidth="0.5" fill="none" strokeOpacity="0.28" strokeDasharray="3 5" />
      <line x1="257" y1="260" x2="303" y2="260" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.35" />
      <line x1="280" y1="237" x2="280" y2="283" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.35" />

      <circle cx="280" cy="260" r="30" fill="#10B981" fillOpacity="0.18" filter="url(#hub-core-blur)" />
      <circle cx="280" cy="260" r="22" fill="#090D16" stroke="#10B981" strokeWidth="1.5">
        <animate attributeName="opacity" values="1;0.55;1" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="280" cy="260" r="13" fill="#10B981" fillOpacity="0.2" />
      <circle cx="280" cy="260" r="7" fill="#10B981" fillOpacity="0.95" filter="url(#soft-glow-emerald)">
        <animate attributeName="r" values="7;9;7" dur="2.6s" repeatCount="indefinite" />
      </circle>

      <circle cx="388" cy="260" r="4.5" fill="#22D3EE" filter="url(#soft-glow-cyan)">
        <animateTransform attributeName="transform" type="rotate" from="0 280 260" to="360 280 260" dur="10s" repeatCount="indefinite" />
      </circle>
      <circle cx="352" cy="260" r="3" fill="#10B981" filter="url(#soft-glow-emerald)">
        <animateTransform attributeName="transform" type="rotate" from="180 280 260" to="-180 280 260" dur="14s" repeatCount="indefinite" />
      </circle>

      <g>
        <circle cx="85" cy="100" r="26" fill="#090D16" stroke="#10B981" strokeWidth="1.5" />
        <circle cx="85" cy="100" r="13" fill="#10B981" fillOpacity="0.12" />
        <circle cx="85" cy="100" r="5.5" fill="#10B981" fillOpacity="0.95" filter="url(#soft-glow-emerald)">
          <animate attributeName="r" values="5.5;7;5.5" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.95;0.55;0.95" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <text x="85" y="140" textAnchor="middle" fill="#ffffff" fillOpacity="0.55" fontSize="9" fontFamily="ui-sans-serif, system-ui" letterSpacing="0.5">
          Fiber
        </text>
      </g>

      <g>
        <circle cx="475" cy="85" r="26" fill="#090D16" stroke="#22D3EE" strokeWidth="1.5" />
        <circle cx="475" cy="85" r="13" fill="#22D3EE" fillOpacity="0.12" />
        <circle cx="475" cy="85" r="5.5" fill="#22D3EE" fillOpacity="0.95" filter="url(#soft-glow-cyan)">
          <animate attributeName="r" values="5.5;7;5.5" dur="2.5s" begin="0.7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.95;0.55;0.95" dur="2.5s" begin="0.7s" repeatCount="indefinite" />
        </circle>
        <text x="475" y="125" textAnchor="middle" fill="#ffffff" fillOpacity="0.55" fontSize="9" fontFamily="ui-sans-serif, system-ui" letterSpacing="0.5">
          AI Compute
        </text>
      </g>

      <g>
        <circle cx="515" cy="260" r="26" fill="#090D16" stroke="#10B981" strokeWidth="1.5" />
        <circle cx="515" cy="260" r="13" fill="#10B981" fillOpacity="0.12" />
        <circle cx="515" cy="260" r="5.5" fill="#10B981" fillOpacity="0.95" filter="url(#soft-glow-emerald)">
          <animate attributeName="r" values="5.5;7;5.5" dur="2.5s" begin="1.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.95;0.55;0.95" dur="2.5s" begin="1.4s" repeatCount="indefinite" />
        </circle>
        <text x="515" y="300" textAnchor="middle" fill="#ffffff" fillOpacity="0.55" fontSize="9" fontFamily="ui-sans-serif, system-ui" letterSpacing="0.5">
          Datacenter
        </text>
      </g>

      <g>
        <circle cx="435" cy="435" r="26" fill="#090D16" stroke="#22D3EE" strokeWidth="1.5" />
        <circle cx="435" cy="435" r="13" fill="#22D3EE" fillOpacity="0.12" />
        <circle cx="435" cy="435" r="5.5" fill="#22D3EE" fillOpacity="0.95" filter="url(#soft-glow-cyan)">
          <animate attributeName="r" values="5.5;7;5.5" dur="2.5s" begin="0.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.95;0.55;0.95" dur="2.5s" begin="0.3s" repeatCount="indefinite" />
        </circle>
        <text x="435" y="475" textAnchor="middle" fill="#ffffff" fillOpacity="0.55" fontSize="9" fontFamily="ui-sans-serif, system-ui" letterSpacing="0.5">
          Manufacturing
        </text>
      </g>

      <g>
        <circle cx="100" cy="430" r="26" fill="#090D16" stroke="#10B981" strokeWidth="1.5" />
        <circle cx="100" cy="430" r="13" fill="#10B981" fillOpacity="0.12" />
        <circle cx="100" cy="430" r="5.5" fill="#10B981" fillOpacity="0.95" filter="url(#soft-glow-emerald)">
          <animate attributeName="r" values="5.5;7;5.5" dur="2.5s" begin="1.1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.95;0.55;0.95" dur="2.5s" begin="1.1s" repeatCount="indefinite" />
        </circle>
        <text x="100" y="470" textAnchor="middle" fill="#ffffff" fillOpacity="0.55" fontSize="9" fontFamily="ui-sans-serif, system-ui" letterSpacing="0.5">
          Power
        </text>
      </g>

      <circle cx="180" cy="155" r="2" fill="#10B981" fillOpacity="0.4" />
      <circle cx="370" cy="148" r="2" fill="#22D3EE" fillOpacity="0.4" />
      <circle cx="198" cy="355" r="2" fill="#10B981" fillOpacity="0.3" />
      <circle cx="362" cy="368" r="2" fill="#22D3EE" fillOpacity="0.3" />
    </svg>
  );
}
