"use client";

import { useState } from "react";
import { Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import StatBlock from "@/components/ui/StatBlock";

type TabId = "compute" | "cooling" | "power" | "interconnect";

interface PanelStat {
  value: string;
  unit?: string;
  label: string;
  caption?: string;
}

interface PanelData {
  stats: [PanelStat, PanelStat, PanelStat];
  description: string;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "compute", label: "Compute" },
  { id: "cooling", label: "Cooling" },
  { id: "power", label: "Power" },
  { id: "interconnect", label: "Interconnect" },
];

const PANELS: Record<TabId, PanelData> = {
  compute: {
    stats: [
      { value: "60k+", label: "GPU sockets", caption: "H200-class ready" },
      { value: "4.5", unit: "EFLOPS", label: "Aggregate FP8" },
      { value: "120", unit: "Tbps", label: "Fabric bandwidth" },
    ],
    description:
      "Rack-scale NVLink domains with 800G east-west fabric, ready for trillion-parameter training runs.",
  },
  cooling: {
    stats: [
      { value: "1.12", unit: "PUE", label: "Design target" },
      { value: "45", unit: "°C", label: "Warm-water inlet" },
      { value: "0", unit: "L", label: "Water waste" },
    ],
    description:
      "Direct-to-chip liquid loops, dry-cooler heat rejection, and rear-door back-up for legacy air-cooled tenants.",
  },
  power: {
    stats: [
      { value: "100%", label: "Renewable-sourced" },
      { value: "2N", label: "Utility feed" },
      { value: "15", unit: "min", label: "Battery hold-up" },
    ],
    description:
      "Direct-PPA solar and wind, backed by battery energy storage and gas-turbine reserve for critical hold-over.",
  },
  interconnect: {
    stats: [
      { value: "4", label: "Metro POPs", caption: "Sub-2 ms" },
      { value: "12", unit: "Tbps", label: "Backbone uplink" },
      { value: "Direct", label: "Cloud on-ramp", caption: "AWS · Azure · GCP" },
    ],
    description:
      "On-net to the KDL 701 km fiber backbone with dedicated last-mile to hyperscaler AZs.",
  },
};

export default function AIHubDeepDive() {
  const [activeTab, setActiveTab] = useState<TabId>("compute");
  const panel = PANELS[activeTab];

  return (
    <section className="relative bg-obsidian-2 py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute pointer-events-none blur-3xl rounded-full bg-cyan-glow"
        style={{
          left: "50%",
          top: "40%",
          width: "700px",
          height: "700px",
          transform: "translate(-50%, -50%)",
          opacity: 0.12,
        }}
      />
      <div className="absolute inset-0 dot-grid-obsidian pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          align="left"
          badgeIcon={Cpu}
          badgeLabel="AI Hub"
          title="One gigawatt of AI-ready compute, engineered for India."
          subtitle="Purpose-built for GPU-dense training and low-latency inference — liquid-cooled halls, renewable-first power, and direct interconnect to the national fiber backbone."
          className="mb-14 md:mb-20"
        />

        <div className="max-w-4xl space-y-12">
          {/* Capacity anchor */}
          <div className="pb-10 border-b border-white/10">
            <StatBlock
              tone="dark"
              size="hero"
              value="1"
              unit="GW"
              label="Total planned capacity"
              caption="Phased delivery across 3 sites, live from FY27"
            />
          </div>

          {/* Tabbed spec explorer */}
          <div>
            <div
              role="tablist"
              aria-label="AI Hub metrics"
              className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-white/10"
            >
              {TABS.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-3 text-sm font-medium tracking-wide transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {tab.label}
                    {isActive ? (
                      <motion.div
                        layoutId="ai-tab-underline"
                        className="absolute left-0 right-0 -bottom-px h-[2px] bg-emerald"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-white/55 mb-6">
                    Design targets · Phase-1 build
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    {panel.stats.map((stat, idx) => (
                      <StatBlock
                        key={`${activeTab}-${idx}`}
                        tone="dark"
                        size="md"
                        value={stat.value}
                        unit={stat.unit}
                        label={stat.label}
                        caption={stat.caption}
                      />
                    ))}
                  </div>
                  <p className="mt-8 text-white/60 leading-relaxed max-w-2xl">
                    {panel.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
