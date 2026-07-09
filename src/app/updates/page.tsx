import type { Metadata } from "next";
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  PlayCircle,
  Radio,
  Search,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { timelineUpdates, type TimelineEvent } from "@/data/timelineUpdates";

export const metadata: Metadata = {
  title: "Operational Milestones & Live Field Updates",
  description:
    "Real-time visibility into Kore Digital Limited's infrastructure execution, compliance events, and network deployment pipelines.",
};

/* ─── Status style tokens ───────────────────────────────────────────── */

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
    badge: "bg-slate-700/40 border border-slate-600/40 text-slate-400",
    icon: CheckCircle2,
    dot: "bg-slate-500",
    ring: "ring-slate-700/50",
    label: "Completed",
  },
  "In Progress": {
    badge:
      "bg-emerald-400/10 border border-emerald-400/40 text-emerald-300",
    icon: Radio,
    dot: "bg-cyan-400",
    ring: "ring-cyan-400/30",
    label: "In Progress",
  },
  Upcoming: {
    badge: "bg-amber-400/10 border border-amber-400/30 text-amber-300",
    icon: Clock,
    dot: "bg-amber-400/70",
    ring: "ring-amber-400/25",
    label: "Upcoming",
  },
};

const PILLAR_STYLES: Record<
  TimelineEvent["pillar"],
  { color: string; bg: string }
> = {
  Telecom: { color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/25" },
  Compute: { color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/25" },
  "Deep-Tech": {
    color: "text-indigo-300",
    bg: "bg-indigo-400/10 border-indigo-400/25",
  },
  General: { color: "text-slate-300", bg: "bg-slate-700/40 border-slate-600/40" },
};

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function UpdatesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16 bg-kd-bg">
        {/* ── Page header ── */}
        <section className="relative border-b border-kd-border overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, #22d3ee14 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-kd-card border border-kd-border rounded-full px-3.5 py-1.5">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 animate-ping" />
                  <span className="relative rounded-full w-2 h-2 bg-emerald-400" />
                </span>
                <span className="text-[10px] text-slate-300 tracking-widest uppercase font-semibold">
                  Live Deployment Center
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                Operational Milestones &amp;{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
                  Live Field Updates
                </span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                Real-time visibility into Kore Digital Limited&apos;s
                infrastructure execution, compliance events, and network
                deployment pipelines.
              </p>
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {timelineUpdates.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="relative">
                <div className="border-l-2 border-slate-800 ml-3 sm:ml-6 pl-8 sm:pl-12 space-y-8">
                  {timelineUpdates.map((event) => (
                    <TimelineNode key={event.id} event={event} />
                  ))}
                </div>

                <div className="ml-3 sm:ml-6 flex items-center gap-3 pt-2">
                  <span className="w-3 h-3 -ml-[7px] rounded-full bg-slate-800 border-2 border-kd-bg" />
                  <span className="text-slate-600 text-xs tracking-widest uppercase">
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

/* ─── Sub-components ────────────────────────────────────────────────── */

function TimelineNode({ event }: { event: TimelineEvent }) {
  const status = STATUS_STYLES[event.status];
  const pillarStyle = PILLAR_STYLES[event.pillar];
  const StatusIcon = status.icon;
  const isLive = event.status === "In Progress";

  return (
    <div className="relative">
      {/* Node dot on the spine */}
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

      {/* Card */}
      <article
        className={`bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/70 ${
          isLive ? "shadow-lg shadow-cyan-500/5" : ""
        }`}
      >
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-slate-300 text-xs font-semibold font-mono tracking-wide">
            {event.date}
          </span>
          <span className="text-slate-700 text-xs">·</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pillarStyle.bg} ${pillarStyle.color}`}
          >
            {event.pillar}
          </span>
          <span className="text-slate-600 text-[10px]">{event.category}</span>

          <span
            className={`ml-auto inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${status.badge}`}
          >
            {isLive ? (
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-cyan-400 opacity-80 animate-ping" />
                <span className="relative rounded-full w-1.5 h-1.5 bg-cyan-400" />
              </span>
            ) : (
              <StatusIcon className="w-3 h-3" />
            )}
            {status.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-base sm:text-lg leading-snug mb-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed">
          {event.description}
        </p>

        {/* Optional video attachment */}
        {event.video && (
          <div className="mt-4 space-y-2">
            {event.video.caption && (
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-slate-400">
                  {event.video.caption}
                </span>
                {event.video.duration && (
                  <>
                    <span className="text-slate-700">·</span>
                    <span className="font-mono tabular-nums">
                      {event.video.duration}
                    </span>
                  </>
                )}
              </div>
            )}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black shadow-2xl shadow-black/60">
              <video
                controls
                preload="metadata"
                playsInline
                poster={event.video.poster}
                className="w-full max-h-[520px] block bg-black"
              >
                <source src={event.video.src} type="video/mp4" />
                Your browser does not support embedded video playback.
              </video>
            </div>
          </div>
        )}

        {/* Optional PDF document — full inline preview */}
        {event.document && (
          <div className="mt-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60 shadow-2xl shadow-black/60">
            {/* Preview header */}
            <div className="flex items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-red-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs sm:text-sm font-semibold truncate">
                    {event.document.fileName}
                  </p>
                  <p className="text-slate-500 text-[10px] sm:text-[11px] truncate">
                    {event.document.label}
                    {event.document.reference && (
                      <>
                        <span className="mx-1.5 text-slate-700">·</span>
                        <span className="font-mono tabular-nums">
                          Ref: {event.document.reference}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              {event.document.fileSize && (
                <span className="text-[10px] font-mono tabular-nums text-slate-400 bg-slate-800/60 border border-slate-700/60 rounded px-2 py-0.5 shrink-0">
                  PDF · {event.document.fileSize}
                </span>
              )}
            </div>

            {/* Inline PDF viewer — fixed height so a portrait letter doesn't dominate the timeline */}
            <div className="relative w-full h-[380px] sm:h-[440px] bg-slate-200">
              <iframe
                src={`${event.document.src}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                className="absolute inset-0 w-full h-full"
                title={event.document.fileName}
                loading="lazy"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/30 to-transparent pointer-events-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 sm:p-4 border-t border-slate-800">
              <a
                href={event.document.src}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Full Document
              </a>
              <a
                href={event.document.src}
                download={event.document.fileName}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-slate-700 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 font-semibold text-xs px-4 py-2.5 rounded transition-all"
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
    <div className="border border-dashed border-kd-border rounded-2xl px-6 py-16 flex flex-col items-center gap-4 bg-kd-card/30">
      <div className="w-14 h-14 rounded-full bg-kd-card border border-kd-border flex items-center justify-center">
        <Search className="w-6 h-6 text-slate-500" />
      </div>
      <div className="text-center max-w-md space-y-2">
        <p className="text-white font-semibold text-base">
          No updates recorded yet.
        </p>
        <p className="text-slate-500 text-sm leading-relaxed">
          New milestones and field updates will appear here as they are
          published.
        </p>
      </div>
    </div>
  );
}
