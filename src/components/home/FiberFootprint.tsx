"use client";

import { useState } from "react";
import { Network } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import StatBlock from "@/components/ui/StatBlock";

interface City {
  id: string;
  name: string;
  x: number;
  y: number;
  km: string;
  labelAbove?: boolean;
}

const CITIES: City[] = [
  { id: "delhi", name: "Delhi", x: 243, y: 145, km: "142 km ring" },
  { id: "ahmedabad", name: "Ahmedabad", x: 155, y: 260, km: "88 km spur" },
  { id: "mumbai", name: "Mumbai", x: 165, y: 335, km: "96 km metro", labelAbove: true },
  { id: "pune", name: "Pune", x: 195, y: 355, km: "34 km loop" },
  { id: "nagpur", name: "Nagpur", x: 255, y: 290, km: "118 km hub" },
  { id: "kolkata", name: "Kolkata", x: 345, y: 275, km: "76 km leg" },
  { id: "hyderabad", name: "Hyderabad", x: 255, y: 375, km: "64 km ring" },
  { id: "bangalore", name: "Bangalore", x: 240, y: 445, km: "52 km loop", labelAbove: true },
  { id: "chennai", name: "Chennai", x: 290, y: 445, km: "31 km spur", labelAbove: true },
];

interface Route {
  id: string;
  d: string;
  begin: string;
}

const ROUTES: Route[] = [
  { id: "route-0", d: "M243,145 Q170,240 165,335", begin: "0s" },
  { id: "route-1", d: "M243,145 Q200,200 155,260", begin: "0.5s" },
  { id: "route-2", d: "M155,260 Q145,300 165,335", begin: "1s" },
  { id: "route-3", d: "M165,335 Q180,345 195,355", begin: "1.5s" },
  { id: "route-4", d: "M165,335 Q210,315 255,290", begin: "2s" },
  { id: "route-5", d: "M255,290 Q300,275 345,275", begin: "2.5s" },
  { id: "route-6", d: "M255,290 Q255,330 255,375", begin: "3s" },
  { id: "route-7", d: "M255,375 Q250,410 240,445", begin: "3.5s" },
  { id: "route-8", d: "M240,445 Q265,455 290,445", begin: "3.8s" },
];

/*
  Hand-tuned India silhouette (clockwise from Kashmir tip):
  Kashmir → Ladakh → Nepal border → Bhutan → Arunachal bulge → NE narrows →
  Bangladesh concave → Kolkata coast → Odisha → Andhra → Tamil east →
  Kanyakumari tip → Kerala west → Konkan → Mumbai coast → Gujarat SE →
  Saurashtra + Kutch bulge → Rajasthan west → Punjab → J&K SW → back to tip.
*/
const INDIA_PATH =
  "M245,40 L280,55 L315,105 L355,135 L385,140 L445,165 L450,180 L420,205 L390,225 L365,245 L355,275 L345,320 L335,385 L300,445 L250,540 L215,490 L185,420 L170,385 L155,340 L145,290 L105,260 L85,235 L110,210 L140,180 L170,130 L200,85 Z";

function CityNode({
  city,
  hovered,
  onEnter,
  onLeave,
}: {
  city: City;
  hovered: boolean;
  onEnter: (id: string) => void;
  onLeave: () => void;
}) {
  const labelY = city.labelAbove ? city.y - 14 : city.y + 20;
  const kmY = city.labelAbove ? city.y - 26 : city.y + 32;

  return (
    <g
      onMouseEnter={() => onEnter(city.id)}
      onMouseLeave={onLeave}
      className="cursor-pointer"
      style={{ pointerEvents: "all" }}
    >
      <circle
        cx={city.x}
        cy={city.y}
        r={hovered ? 16 : 10}
        fill="#10B981"
        opacity={hovered ? 0.22 : 0.15}
        style={{ transition: "r 200ms ease, opacity 200ms ease" }}
      />
      <circle
        cx={city.x}
        cy={city.y}
        r={6}
        fill="#FFFFFF"
        stroke="#10B981"
        strokeWidth={2}
      />
      <circle cx={city.x} cy={city.y} r={2} fill="#10B981" />
      <text
        x={city.x}
        y={labelY}
        fontSize={10}
        fill="#334155"
        fontWeight={600}
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
      >
        {city.name}
      </text>
      {hovered ? (
        <text
          x={city.x}
          y={kmY}
          fontSize={9}
          fill="#10B981"
          fontWeight={600}
          textAnchor="middle"
          style={{ pointerEvents: "none" }}
        >
          {city.km}
        </text>
      ) : null}
    </g>
  );
}

export default function FiberFootprint() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

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
            <svg
              viewBox="0 0 500 560"
              className="w-full max-w-[560px] mx-auto"
              role="img"
              aria-label="Kore Digital fiber footprint across India"
            >
              <defs>
                <pattern
                  id="fiber-dot-grid"
                  x="0"
                  y="0"
                  width="12"
                  height="12"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1" cy="1" r="1" fill="#E2E8F0" />
                </pattern>
                <clipPath id="india-clip">
                  <path d={INDIA_PATH} />
                </clipPath>
                {ROUTES.map((r) => (
                  <path key={r.id} id={r.id} d={r.d} />
                ))}
              </defs>

              <path
                d={INDIA_PATH}
                fill="#F1F5F9"
                stroke="#CBD5E1"
                strokeWidth={1}
              />
              <rect
                x="0"
                y="0"
                width="500"
                height="560"
                fill="url(#fiber-dot-grid)"
                clipPath="url(#india-clip)"
                opacity={0.6}
              />

              <g>
                {ROUTES.map((r) => (
                  <path
                    key={`stroke-${r.id}`}
                    d={r.d}
                    stroke="#10B981"
                    strokeOpacity={0.35}
                    strokeWidth={1}
                    fill="none"
                  />
                ))}
              </g>

              <g>
                {ROUTES.map((r) => (
                  <circle key={`pulse-${r.id}`} r={3} fill="#10B981">
                    <animateMotion
                      dur="4s"
                      repeatCount="indefinite"
                      begin={r.begin}
                      rotate="auto"
                    >
                      <mpath href={`#${r.id}`} />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.15;0.85;1"
                      dur="4s"
                      repeatCount="indefinite"
                      begin={r.begin}
                    />
                  </circle>
                ))}
              </g>

              <g>
                {CITIES.map((city) => (
                  <CityNode
                    key={city.id}
                    city={city}
                    hovered={hoveredCity === city.id}
                    onEnter={setHoveredCity}
                    onLeave={() => setHoveredCity(null)}
                  />
                ))}
              </g>
            </svg>

            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-medium tracking-wide">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald ticker-pulse" />
                Live segment
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="4" aria-hidden="true">
                  <line
                    x1="0"
                    y1="2"
                    x2="14"
                    y2="2"
                    stroke="#10B981"
                    strokeWidth="1"
                    opacity="0.35"
                  />
                </svg>
                Fiber route
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
