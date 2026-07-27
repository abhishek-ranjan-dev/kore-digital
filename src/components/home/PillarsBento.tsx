import { ArrowRight, Cpu, Factory, Layers, Network, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import BentoCard from "@/components/ui/BentoCard";
import SectionBadge from "@/components/ui/SectionBadge";
import SectionHeading from "@/components/ui/SectionHeading";
import StatBlock from "@/components/ui/StatBlock";

interface Pillar {
  badgeIcon: LucideIcon;
  badgeLabel: string;
  cornerIcon: LucideIcon;
  value: string;
  unit: string;
  label: string;
  caption: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    badgeIcon: Network,
    badgeLabel: "Telecom",
    cornerIcon: Network,
    value: "701",
    unit: "km",
    label: "Fiber deployed",
    caption: "Across 6 states",
    description:
      "OFC backbone connecting metro clusters to Tier-2 growth corridors. NLD/ILD-grade, engineered for 99.99% availability.",
  },
  {
    badgeIcon: Cpu,
    badgeLabel: "AI Datacenter",
    cornerIcon: Cpu,
    value: "1",
    unit: "GW",
    label: "Planned capacity",
    caption: "Liquid-cooled, GPU-dense",
    description:
      "Hyperscale AI datacenter roadmap with 100% renewable power sourcing and sub-1.15 PUE targets.",
  },
  {
    badgeIcon: Factory,
    badgeLabel: "Manufacturing",
    cornerIcon: Factory,
    value: "±10",
    unit: "µm",
    label: "Machining tolerance",
    caption: "Aerospace-grade",
    description:
      "Additive and subtractive manufacturing for defence, space, and semiconductor equipment — from prototype to production.",
  },
  {
    badgeIcon: Zap,
    badgeLabel: "Energy",
    cornerIcon: Zap,
    value: "100",
    unit: "MW",
    label: "Solar + BESS pipeline",
    caption: "Under development",
    description:
      "Utility-scale solar and battery energy storage backing the fiber and compute backbone with clean, dispatchable power.",
  },
];

export default function PillarsBento() {
  return (
    <section className="relative bg-mist py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 dot-grid-mist opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="light"
          align="left"
          badgeIcon={Layers}
          badgeLabel="What we build"
          title="Four pillars, one infrastructure fabric."
          subtitle="Kore Digital operates across the four hardest-to-scale layers of India's digital economy — connectivity, compute, precision manufacturing, and clean power."
          className="mb-14 md:mb-20"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((pillar) => {
            const CornerIcon = pillar.cornerIcon;
            return (
              <BentoCard
                key={pillar.badgeLabel}
                href="/about"
                tone="light"
                className="group min-h-[280px]"
              >
                <CornerIcon
                  className="absolute top-6 right-6 w-9 h-9 text-slate-300 group-hover:text-emerald-ink transition-colors"
                  strokeWidth={1.5}
                />

                <SectionBadge
                  tone="light"
                  icon={pillar.badgeIcon}
                  label={pillar.badgeLabel}
                />

                <div className="mt-8">
                  <StatBlock
                    tone="light"
                    size="lg"
                    value={pillar.value}
                    unit={pillar.unit}
                    label={pillar.label}
                    caption={pillar.caption}
                  />
                </div>

                <p className="text-slate-600 leading-relaxed mt-2 max-w-md">
                  {pillar.description}
                </p>

                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-emerald-ink transition-colors">
                  Explore
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </BentoCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
