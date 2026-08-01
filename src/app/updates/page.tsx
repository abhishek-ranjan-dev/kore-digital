import type { Metadata } from "next";
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  PlayCircle,
  Radio,
  Rss,
  Search,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionBadge from "@/components/ui/SectionBadge";
import { timelineUpdates, type TimelineEvent } from "@/data/timelineUpdates";

export const metadata: Metadata = {
  title: "Operational Milestones & Live Field Updates",
  description:
    "Real-time visibility into Kore Digital Limited's infrastructure execution, compliance events, and network deployment pipelines.",
};

const STATUS_STYLES: Record<
  TimelineEvent["status"],
  {
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    dot: string;
    ring: string;
    label: string;
  }
> = {
  Completed: {
    badge: "bg-white border border-slate-200 text-slate-500",
    icon: CheckCircle2,
    dot: "bg-slate-400",
    ring: "ring-slate-200",
    label: "Completed",
  },
  "In Progress": {
    badge: "bg-emerald/10 border border-emerald/40 text-emerald-ink",
    icon: Radio,
    dot: "bg-emerald",
    ring: "ring-emerald/25",
    label: "In Progress",
  },
  Upcoming: {
    badge: "bg-white border border-emerald/30 text-emerald-ink",
    icon: Clock,
    dot: "bg-emerald/70",
    ring: "ring-emerald/20",
    label: "Upcoming",
  },
};

const PILLAR_STYLES: Record<
  TimelineEvent["pillar"],
  { color: string; bg: string }
> = {
  Telecom: { color: "text-emerald-ink", bg: "bg-emerald/10 border-emerald/25" },
  Compute: { color: "text-cyan-glow", bg: "bg-cyan-glow/10 border-cyan-glow/25" },
  "Deep-Tech": {
    color: "text-emerald-ink",
    bg: "bg-emerald/10 border-emerald/25",
  },
  General: { color: "text-slate-700", bg: "bg-white border-slate-200" },
};

export default function UpdatesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16 bg-mist">
        <section className="relative overflow-hidden bg-obsidian">
          <div className="dot-grid-obsidian absolute inset-0 pointer-events-none opacity-40" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald/10 blur-3xl pointer-events-none" />
          <div className="absolute top-[20%] right-[10%] w-[280px] h-[280px] rounded-full bg-cyan-glow/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-36 sm:pb-24">
            <div className="space-y-6 max-w-3xl">
              <SectionBadge icon={Rss} label="Updates" tone="dark" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]">
                Operational Milestones &amp;{" "}
                <span className="text-emerald">Live Field Updates</span>
              </h1>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed">
                Real-time visibility into Kore Digital Limited&apos;s
                infrastructure execution, compliance events, and network
                deployment pipelines.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-mist">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {timelineUpdates.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="relative">
                <div className="border-l-2 border-slate-200 ml-3 sm:ml-6 pl-8 sm:pl-12 space-y-8">
                  {timelineUpdates.map((event) => (
                    <TimelineNode key={event.id} event={event} />
                  ))}
                </div>

                <div className="ml-3 sm:ml-6 flex items-center gap-3 pt-2">
                  <span className="w-3 h-3 -ml-[7px] rounded-full bg-white border-2 border-emerald" />
                  <span className="text-slate-500 text-xs tracking-widest uppercase font-mono">
                    End of Recorded Timeline
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

function TimelineNode({ event }: { event: TimelineEvent }) {
  const status = STATUS_STYLES[event.status];
  const pillarStyle = PILLAR_STYLES[event.pillar];
  const StatusIcon = status.icon;
  const isLive = event.status === "In Progress";

  return (
    <div className="relative">
      <div
        className="absolute -left-[calc(2rem+0.5rem+0.5px)] sm:-left-[calc(3rem+0.5rem+0.5px)] top-6"
        aria-hidden="true"
      >
        <span
          className={`relative flex items-center justify-center w-4 h-4 rounded-full ring-4 ${status.ring} ring-offset-0`}
        >
          <span className={`w-4 h-4 rounded-full ${status.dot}`} />
          {isLive && (
            <span
              className={`absolute inset-0 rounded-full ${status.dot} opacity-70 animate-ping`}
            />
          )}
        </span>
      </div>

      <article
        className={`bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald/40 hover:shadow-lg hover:shadow-emerald/5 ${
          isLive ? "shadow-lg shadow-emerald/10" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
            {event.date}
          </span>
          <span className="w-1 h-1 rounded-full bg-emerald" />
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pillarStyle.bg} ${pillarStyle.color}`}
          >
            {event.pillar}
          </span>
          <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
            {event.category}
          </span>

          <span
            className={`ml-auto inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${status.badge}`}
          >
            {isLive ? (
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald opacity-80 animate-ping" />
                <span className="relative rounded-full w-1.5 h-1.5 bg-emerald" />
              </span>
            ) : (
              <StatusIcon className="w-3 h-3" />
            )}
            {status.label}
          </span>
        </div>

        <h2 className="text-lg md:text-xl font-semibold text-slate-900 leading-snug mb-2">
          {event.title}
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed">
          {event.description}
        </p>

        {event.video && (
          <div className="mt-4 space-y-2">
            {event.video.caption && (
              <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                <PlayCircle className="w-3.5 h-3.5 text-emerald-ink" />
                <span className="font-semibold text-slate-700">
                  {event.video.caption}
                </span>
                {event.video.duration && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono tabular-nums">
                      {event.video.duration}
                    </span>
                  </>
                )}
              </div>
            )}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-obsidian shadow-2xl shadow-slate-900/10">
              <video
                controls
                preload="metadata"
                playsInline
                poster={event.video.poster}
                className="w-full max-h-[520px] block bg-obsidian"
              >
                <source src={event.video.src} type="video/mp4" />
                Your browser does not support embedded video playback.
              </video>
            </div>
          </div>
        )}

        {event.document && (
          <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
            <div className="flex items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-200 bg-mist">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-emerald/10 border border-emerald/30 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-emerald-ink" />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-900 text-xs sm:text-sm font-semibold truncate">
                    {event.document.fileName}
                  </p>
                  <p className="text-slate-500 text-[10px] truncate">
                    {event.document.label}
                    {event.document.reference && (
                      <>
                        <span className="mx-1.5 text-slate-300">·</span>
                        <span className="font-mono tabular-nums">
                          Ref: {event.document.reference}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              {event.document.fileSize && (
                <span className="text-[10px] font-mono tabular-nums text-slate-700 bg-white border border-slate-200 rounded px-2 py-0.5 shrink-0">
                  PDF · {event.document.fileSize}
                </span>
              )}
            </div>

            <div className="relative w-full h-[380px] sm:h-[440px] bg-slate-100">
              <iframe
                src={`${event.document.src}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                className="absolute inset-0 w-full h-full"
                title={event.document.fileName}
                loading="lazy"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 sm:p-4 border-t border-slate-200">
              <a
                href={event.document.src}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald hover:brightness-110 text-obsidian font-bold text-xs px-4 py-2.5 rounded transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Full Document
              </a>
              <a
                href={event.document.src}
                download={event.document.fileName}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-slate-200 hover:border-emerald-ink text-slate-700 hover:text-emerald-ink font-semibold text-xs px-4 py-2.5 rounded transition"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </a>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-slate-200 rounded-2xl px-6 py-16 flex flex-col items-center gap-4 bg-white">
      <div className="w-14 h-14 rounded-full bg-mist border border-slate-200 flex items-center justify-center">
        <Search className="w-6 h-6 text-slate-500" />
      </div>
      <div className="text-center max-w-md space-y-2">
        <p className="text-slate-900 font-semibold text-base">
          No updates recorded yet.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          New milestones and field updates will appear here as they are
          published.
        </p>
      </div>
    </div>
  );
}
