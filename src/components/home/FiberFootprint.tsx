"use client";

import { useState } from "react";
import { Network } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import StatBlock from "@/components/ui/StatBlock";

/*
  Samruddhi Mahamarg fiber corridor — the flagship 701 km, 6-duct backbone
  running along the Nagpur–Mumbai Expressway under a 15-year concession.
  Rendered west→east (Mumbai coast, lower-left → Nagpur, upper-right) so the
  geography reads correctly. Node descriptions are place facts, not fabricated
  per-segment metrics; only the corridor total (701 km) is a sourced figure.
*/
interface CorridorNode {
  id: string;
  name: string;
  x: number;
  y: number;
  desc: string;
  primary?: boolean;
  labelBelow?: boolean;
}

const NODES: CorridorNode[] = [
  { id: "mumbai", name: "Mumbai", x: 58, y: 292, desc: "Financial capital · DC clusters", primary: true, labelBelow: true },
  { id: "amne", name: "Amne Interchange", x: 118, y: 268, desc: "Mumbai-end gateway", primary: true, labelBelow: true },
  { id: "nashik", name: "Nashik", x: 192, y: 232, desc: "Igatpuri ghat section" },
  { id: "shirdi", name: "Shirdi", x: 272, y: 198, desc: "Mid-corridor hub", primary: true, labelBelow: true },
  { id: "aurangabad", name: "Ch. Sambhajinagar", x: 342, y: 170, desc: "Marathwada node" },
  { id: "amravati", name: "Amravati", x: 448, y: 120, desc: "Vidarbha node" },
  { id: "nagpur", name: "Nagpur", x: 512, y: 84, desc: "Corridor origin · Vidarbha", primary: true },
];

const ROUTE_D =
  "M58,292 L118,268 L192,232 L272,198 L342,170 L448,120 L512,84";

function Node({
  node,
  active,
  onEnter,
  onLeave,
}: {
  node: CorridorNode;
  active: boolean;
  onEnter: (id: string) => void;
  onLeave: () => void;
}) {
  const isPrimary = !!node.primary;
  const coreR = isPrimary ? 6 : 4;
  const nameY = node.labelBelow ? node.y + 22 : node.y - 15;
  const descY = node.labelBelow ? node.y + 36 : node.y - 29;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${node.name}: ${node.desc}`}
      onMouseEnter={() => onEnter(node.id)}
      onMouseLeave={onLeave}
      onFocus={() => onEnter(node.id)}
      onBlur={onLeave}
      onClick={() => onEnter(node.id)}
      className="cursor-pointer focus:outline-none focus-visible:outline-none"
      style={{ pointerEvents: "all" }}
    >
      {/* Enlarged invisible tap/hit target */}
      <circle cx={node.x} cy={node.y} r={15} fill="transparent" />
      {/* Halo */}
      <circle
        cx={node.x}
        cy={node.y}
        r={active ? 15 : isPrimary ? 11 : 8}
        fill="#10B981"
        opacity={active ? 0.18 : 0.1}
        style={{ transition: "r 200ms ease, opacity 200ms ease" }}
      />
      {/* Core */}
      <circle
        cx={node.x}
        cy={node.y}
        r={coreR}
        fill="#FFFFFF"
        stroke={active ? "#047857" : "#10B981"}
        strokeWidth={isPrimary ? 2.5 : 2}
        style={{ transition: "stroke 200ms ease" }}
      />
      <circle cx={node.x} cy={node.y} r={isPrimary ? 2 : 1.5} fill="#10B981" />
      {/* Name (always visible) */}
      <text
        x={node.x}
        y={nameY}
        fontSize={isPrimary ? 12 : 10}
        fill={isPrimary ? "#0F172A" : "#475569"}
        fontWeight={isPrimary ? 700 : 600}
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
      >
        {node.name}
      </text>
      {/* Description (on hover / focus) */}
      {active ? (
        <text
          x={node.x}
          y={descY}
          fontSize={10}
          fill="#047857"
          fontWeight={700}
          textAnchor="middle"
          style={{ pointerEvents: "none" }}
        >
          {node.desc}
        </text>
      ) : null}
    </g>
  );
}

export default function FiberFootprint() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <section className="relative bg-mist py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="light"
          align="left"
          badgeIcon={Network}
          badgeLabel="Telecom Backbone"
          title="701 km of live fiber. National footprint, engineered end-to-end."
          subtitle="Trenching, blowing, splicing, and 24/7 NOC operations on a single sheet. From highway spans to intra-city loops — one team, one SLA."
          className="mb-14 md:mb-20"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 space-y-8">
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              The KDL backbone links six states across India&apos;s fastest-growing industrial
              corridors — from Mumbai&apos;s data-center clusters to Nagpur&apos;s Samruddhi
              Mahamarg expansion. Every segment is owned, monitored, and SLA-backed by our
              in-house network operations team.
            </p>

            <div className="grid grid-cols-3 gap-6">
              <StatBlock
                tone="light"
                size="md"
                value="701"
                unit="km"
                label="Live fiber"
                caption="Active backbone"
              />
              <StatBlock
                tone="light"
                size="md"
                value="6"
                label="States covered"
                caption="Live network"
              />
              <StatBlock
                tone="light"
                size="md"
                value="99.99"
                unit="%"
                label="Uptime target"
                caption="Per-segment SLA"
              />
            </div>

            <ul className="space-y-2 pt-4 border-t border-slate-200">
              {[
                "In-house NOC, 24/7 monitoring",
                "OTDR-verified splicing, GIS-mapped routes",
                "Ready-to-light OFC for NLD, ILD, and enterprise dark-fiber leases",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <span className="w-1.5 h-1.5 bg-emerald rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(15,23,42,0.18)]">
              {/* Corridor header */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <p className="text-slate-500 text-[10px] font-mono tracking-[0.28em] uppercase">
                  Samruddhi Mahamarg · Flagship Corridor
                </p>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wide text-emerald-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald ticker-pulse" />
                  Nagpur–Mumbai
                </span>
              </div>

              <svg
                viewBox="0 0 560 360"
                className="w-full"
                role="group"
                aria-label="Samruddhi Mahamarg fiber corridor from Nagpur to Mumbai — focus a stop to reveal its role"
              >
                <defs>
                  <linearGradient id="corridor-sea" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                  </linearGradient>
                  <filter id="corridor-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" />
                  </filter>
                  <path id="samruddhi-route" d={ROUTE_D} fill="none" />
                </defs>

                {/* Coast / Arabian Sea to the west of Mumbai */}
                <rect x="0" y="0" width="60" height="360" fill="url(#corridor-sea)" />
                <path
                  d="M50,0 C40,80 58,150 44,230 C36,300 52,330 46,360"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                  opacity="0.7"
                />

                {/* Route under-glow */}
                <use
                  href="#samruddhi-route"
                  stroke="#10B981"
                  strokeOpacity="0.18"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#corridor-glow)"
                />
                {/* Route main line */}
                <use
                  href="#samruddhi-route"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Duct hint — a fine parallel dashed overlay */}
                <use
                  href="#samruddhi-route"
                  stroke="#FFFFFF"
                  strokeWidth="0.75"
                  strokeOpacity="0.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1 6"
                />

                {/* Traveling data pulses — decorative motion, hidden under reduced-motion */}
                <g data-motion-decor>
                  {[0, 2.5].map((begin) => (
                    <circle key={begin} r={3.5} fill="#10B981" filter="url(#corridor-glow)">
                      <animateMotion
                        dur="5s"
                        begin={`${begin}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath href="#samruddhi-route" />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.12;0.88;1"
                        dur="5s"
                        begin={`${begin}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </g>

                {/* Stops */}
                {NODES.map((node) => (
                  <Node
                    key={node.id}
                    node={node}
                    active={activeNode === node.id}
                    onEnter={setActiveNode}
                    onLeave={() => setActiveNode(null)}
                  />
                ))}
              </svg>

              {/* Corridor facts + legend */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <p className="text-[10px] sm:text-xs text-slate-600">
                  <span className="font-bold text-slate-900 tabular-nums">701 km</span>
                  <span className="mx-1.5 text-slate-300">·</span>
                  15-year concession
                  <span className="mx-1.5 text-slate-300">·</span>
                  6-duct OFC backbone
                </p>
                <div className="flex items-center gap-4 text-[10px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald ticker-pulse" />
                    Live segment
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full border-2 border-emerald bg-white" />
                    Interchange
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
