import { Landmark, Fingerprint, ShieldCheck, FileCheck2, Award } from "lucide-react";

const items = [
  { icon: Landmark, label: "NSE Listed" },
  { icon: Fingerprint, label: "ISIN INE0KDL01021" },
  { icon: ShieldCheck, label: "SEBI Compliant" },
  { icon: FileCheck2, label: "MCA Registered" },
  { icon: Award, label: "ISO 9001:2015" },
];

export default function RegulatoryStrip() {
  return (
    <section className="bg-obsidian border-y border-white/10 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.22em] text-white/40 font-medium">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Icon className="w-3 h-3" />
                  {item.label}
                </span>
                {i < items.length - 1 ? (
                  <span aria-hidden className="text-white/20">
                    ·
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
