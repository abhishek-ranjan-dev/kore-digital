import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import BentoCard from "@/components/ui/BentoCard";
import { timelineUpdates } from "@/data/timelineUpdates";

export default function LatestUpdates() {
  const latest = timelineUpdates.slice(0, 3);

  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            tone="light"
            align="left"
            badgeIcon={Rss}
            badgeLabel="Latest updates"
            title="From the ground, the board, and the exchange."
            subtitle="Field milestones, financial disclosures, and corporate announcements — all in one editorial feed."
          />
          <Link
            href="/updates"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-emerald-ink transition-colors whitespace-nowrap"
          >
            View all updates
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {latest.map((item) => {
            const href = item.document?.src ?? "/updates";
            return (
              <BentoCard
                key={item.id}
                tone="light"
                href={href}
                className="group flex flex-col min-h-[300px]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    {item.date}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-ink">
                    {item.category ?? "Update"}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 leading-snug mb-3 group-hover:text-emerald-ink transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
                <div className="mt-auto pt-6 flex items-center gap-1.5 text-sm font-semibold text-slate-900 group-hover:text-emerald-ink transition-colors">
                  Read more
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
