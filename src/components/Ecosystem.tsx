import { Wifi, Server, Layers, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    id: "connectivity",
    icon: Wifi,
    accentClass: "text-accent",
    borderHover: "hover:border-accent/40",
    bgHover: "hover:bg-elevated",
    glowClass: "group-hover:shadow-accent/10",
    badgeClass: "bg-success/10 text-success border border-success/25",
    badge: "Live Infrastructure",
    title: "Digital Connectivity",
    subtitle: "Pillar A — Fiber Backbone",
    description:
      "Deploying a 701 km fiber optic backbone along the Samruddhi Mahamarg expressway corridor, connecting Maharashtra's tier-1 and tier-2 cities with high-capacity dark fiber and carrier-grade PoPs.",
    stats: [
      { value: "701 km", label: "Active fiber route" },
      { value: "₹1,500+ Cr", label: "Pipeline value" },
      { value: "240+", label: "Network PoPs" },
    ],
    href: "/business#connectivity",
  },
  {
    id: "compute",
    icon: Server,
    accentClass: "text-alt",
    borderHover: "hover:border-alt/40",
    bgHover: "hover:bg-elevated",
    glowClass: "group-hover:shadow-alt/10",
    badgeClass: "bg-alt/10 text-alt border border-alt/25",
    badge: "Development Phase",
    title: "Compute Infrastructure",
    subtitle: "Pillar B — AI Hyperscale",
    description:
      "Developing India's largest planned AI-ready hyperscale datacenter hub in NAINA Mumbai, targeting 1 GW of compute capacity to serve cloud providers, AI training workloads, and enterprise colocation demand.",
    stats: [
      { value: "1 GW", label: "Target capacity" },
      { value: "NAINA", label: "Mumbai location" },
      { value: "AI-Ready", label: "Infrastructure grade" },
    ],
    href: "/business#compute",
  },
  {
    id: "hardware",
    icon: Layers,
    accentClass: "text-success",
    borderHover: "hover:border-success/40",
    bgHover: "hover:bg-elevated",
    glowClass: "group-hover:shadow-success/10",
    badgeClass: "bg-neutral-500/20 text-neutral-100 border border-neutral-500/40",
    badge: "R&D Phase",
    title: "Precision Hardware",
    subtitle: "Pillar C — Deep-Tech Manufacturing",
    description:
      "Advanced metal 3D printing and precision aerospace & defense spare parts manufacturing, incubated under the SINE IIT Bombay ecosystem, targeting import substitution and MRO supply chain opportunities in India's defence sector.",
    stats: [
      { value: "Metal 3DP", label: "Core technology" },
      { value: "Aero / Defence", label: "Target verticals" },
      { value: "IIT Bombay", label: "SINE incubated" },
    ],
    href: "/business#hardware",
  },
];

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="bg-bg py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-14">
          <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">
            Business Ecosystem
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-50 tracking-tight mb-4">
            Three Pillars of
            <span className="bg-gradient-to-r from-accent to-alt bg-clip-text text-transparent">
              {" "}Strategic Infrastructure
            </span>
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Kore Digital operates at the intersection of physical and digital
            infrastructure — building the connectivity layer, compute layer, and
            hardware layer that power India&apos;s next decade of growth.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={`group relative bg-surface border border-neutral-600 rounded-xl p-7 flex flex-col gap-6 transition-all duration-300 ${pillar.borderHover} ${pillar.bgHover} hover:shadow-xl ${pillar.glowClass} cursor-default`}
              >
                {/* Top row: icon + badge */}
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-lg bg-elevated flex items-center justify-center border border-neutral-600 group-hover:border-neutral-500 transition-colors`}>
                    <Icon className={`w-5 h-5 ${pillar.accentClass}`} />
                  </div>
                  <span className={`text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full ${pillar.badgeClass}`}>
                    {pillar.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-neutral-400 text-[10px] uppercase tracking-widest mb-1">
                      {pillar.subtitle}
                    </p>
                    <h3 className="text-lg font-bold text-neutral-50 group-hover:text-neutral-50 transition-colors">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-600">
                  {pillar.stats.map((stat) => (
                    <div key={stat.label} className="space-y-0.5">
                      <p className={`text-sm font-bold ${pillar.accentClass}`}>
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-neutral-400 leading-tight">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Learn more link */}
                <Link
                  href={pillar.href}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${pillar.accentClass} opacity-0 group-hover:opacity-100 transition-opacity -mt-2`}
                >
                  Learn more <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
