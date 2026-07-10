'use client';

import { useState } from 'react';
import { MapPin, Mail, Building2, Copy, Check } from 'lucide-react';

const EMAIL = 'cs@koredigital.com';

const ADDRESS_LINES = [
  'B 1107-1108, Shelton Sapphire,',
  'Plot 18-19, Sector 15,',
  'CBD Belapur, Navi Mumbai – 400614,',
  'Maharashtra, India',
];

const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=Shelton%20Sapphire%20Sector%2015%20CBD%20Belapur%20Navi%20Mumbai%20400614&t=&z=15&ie=UTF8&iwloc=&output=embed';

const MAP_EXTERNAL_URL =
  'https://maps.google.com/maps?q=Shelton+Sapphire+Sector+15+CBD+Belapur+Navi+Mumbai+400614';

export default function ContactUs() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent fail — clipboard unavailable (e.g. non-secure context) */
    }
  }

  return (
    <section id="contact" className="border-t border-neutral-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-column grid — header lives inside the left column */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* ── Left: heading + contact details ── */}
          <div className="space-y-5">
            {/* Section header */}
            <div className="pb-2">
              <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">
                Contact Us
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-50 tracking-tight mb-4">
                Let&apos;s Start a{' '}
                <span className="bg-gradient-to-r from-accent to-alt bg-clip-text text-transparent">
                  Conversation
                </span>
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Whether you are an institutional investor, a prospective
                business partner, or have a general enquiry — our team is ready
                to assist.
              </p>
            </div>
            {/* Email card with copy button */}
            <div className="glass border rounded-2xl p-6 space-y-4 hover:border-accent/35 transition-all duration-300">
              <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase tracking-widest">
                <Mail className="w-3.5 h-3.5" />
                General Enquiries
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Kindly email us at{' '}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-accent hover:text-accent font-medium transition-colors"
                >
                  {EMAIL}
                </a>
              </p>

              {/* Email display + copy row */}
              <div className="flex items-center gap-3 bg-elevated border border-neutral-600 rounded-xl px-4 py-3">
                <span className="flex-1 font-mono text-sm text-neutral-50 tracking-wide truncate select-all">
                  {EMAIL}
                </span>
                <button
                  onClick={handleCopy}
                  aria-label="Copy email address to clipboard"
                  className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                    copied
                      ? 'bg-accent/10 border-accent/40 text-accent'
                      : 'bg-surface border-neutral-600 text-neutral-300 hover:border-accent/50 hover:text-accent'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Registered office address */}
            <div className="glass border rounded-2xl p-6 space-y-4 hover:border-neutral-500 transition-all duration-300">
              <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase tracking-widest">
                <Building2 className="w-3.5 h-3.5" />
                Registered &amp; Corporate Office
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-alt shrink-0 mt-1" />
                <address className="not-italic space-y-0.5">
                  {ADDRESS_LINES.map((line) => (
                    <p
                      key={line}
                      className="text-neutral-200 text-sm leading-relaxed"
                    >
                      {line}
                    </p>
                  ))}
                </address>
              </div>
              <a
                href={MAP_EXTERNAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-alt hover:text-alt font-medium transition-colors"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>

          {/* ── Right: Google Maps embed ── */}
          <div className="flex flex-col gap-3 lg:sticky lg:top-24">
            <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-600 shadow-2xl shadow-black/50">
              {/* Subtle top fade to blend into dark UI */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-fg/5 to-transparent z-10 pointer-events-none"
              />
              <iframe
                src={MAP_EMBED_URL}
                width="100%"
                height="420"
                title="Kore Digital Limited – Shelton Sapphire, CBD Belapur, Navi Mumbai"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                style={{
                  border: 0,
                  display: 'block',
                  filter: 'grayscale(0.18) brightness(0.86)',
                }}
              />
            </div>
            <p className="text-neutral-200 text-xs text-center">
              B 1107-1108, Shelton Sapphire · Sector 15, CBD Belapur · Navi
              Mumbai
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
