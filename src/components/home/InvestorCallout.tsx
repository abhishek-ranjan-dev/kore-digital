import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import GlowCallout from "@/components/ui/GlowCallout";
import SectionBadge from "@/components/ui/SectionBadge";
import { disclosures } from "@/data/disclosures";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function InvestorCallout() {
  const recent = disclosures.slice(0, 2);

  return (
    <section className="bg-obsidian py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlowCallout glow="emerald" className="p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald ticker-pulse" />
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-emerald">
                  NSE Live · KOREDIGIT
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.05] tracking-tight">
                Real-time updates from the{" "}
                <span className="text-emerald">exchange floor</span>.
              </h2>

              <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
                Follow every SEBI disclosure, quarterly filing, and material
                announcement — published the moment they clear the exchange.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/investor-relations"
                  className="inline-flex items-center gap-2 bg-emerald text-obsidian font-bold text-sm px-5 py-3 rounded-lg hover:brightness-110 transition"
                >
                  Investor Relations
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/updates"
                  className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold text-sm px-5 py-3 rounded-lg hover:border-emerald hover:text-emerald transition"
                >
                  All Updates
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <SectionBadge
                    tone="dark"
                    icon={FileText}
                    label="Recent disclosures"
                  />
                  <span className="text-[10px] uppercase tracking-widest text-white/60">
                    Auto-synced
                  </span>
                </div>

                <ul className="divide-y divide-white/10 border-y border-white/10">
                  {recent.map((item) => {
                    const href = item.fileUrl?.length
                      ? item.fileUrl
                      : "/investor-relations";
                    return (
                      <li key={item.id}>
                        <Link
                          href={href}
                          className="group flex items-start gap-3 rounded-lg -mx-3 px-3 py-3 hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-white/60 mb-1">
                              {dateFmt.format(new Date(item.date))}
                            </p>
                            <p className="text-sm font-medium text-white group-hover:text-emerald transition-colors line-clamp-2">
                              {item.title}
                            </p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-emerald flex-shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </GlowCallout>
      </div>
    </section>
  );
}
