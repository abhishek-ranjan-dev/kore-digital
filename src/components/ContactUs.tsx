'use client';

import { useState } from 'react';
import { MapPin, Mail, Building2, Copy, Check } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

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
    <section
      id="contact"
      className="border-t border-white/10 bg-obsidian py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div className="space-y-6">
            <SectionHeading
              tone="dark"
              align="left"
              badgeIcon={Mail}
              badgeLabel="Contact us"
              title="Let's start a conversation."
              subtitle="Whether you are an institutional investor, a prospective business partner, or have a general enquiry — our team is ready to assist."
            />

            <div className="glass-obsidian rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-widest">
                <Mail className="w-3.5 h-3.5" />
                General Enquiries
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Kindly email us at{' '}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-emerald hover:brightness-110 font-medium underline decoration-emerald/30 underline-offset-2 hover:decoration-emerald transition"
                >
                  {EMAIL}
                </a>
              </p>

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3">
                <span className="flex-1 font-mono text-sm text-white tracking-wide truncate select-all">
                  {EMAIL}
                </span>
                <button
                  onClick={handleCopy}
                  aria-label="Copy email address to clipboard"
                  className={`shrink-0 inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3.5 py-2 min-h-[44px] rounded-lg border transition-all duration-200 ${
                    copied
                      ? 'bg-emerald/10 border-emerald/40 text-emerald'
                      : 'bg-white/[0.03] border-white/10 text-white/70 hover:border-emerald/50 hover:text-emerald'
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
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>

            <div className="glass-obsidian rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-widest">
                <Building2 className="w-3.5 h-3.5" />
                Registered &amp; Corporate Office
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald shrink-0 mt-1" />
                <address className="not-italic space-y-0.5">
                  {ADDRESS_LINES.map((line) => (
                    <p
                      key={line}
                      className="text-white/80 text-sm leading-relaxed"
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
                className="inline-flex items-center gap-1.5 text-xs text-emerald hover:brightness-110 font-medium transition"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:sticky lg:top-24">
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/5 to-transparent z-10 pointer-events-none"
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
            <p className="text-white/60 text-xs text-center">
              B 1107-1108, Shelton Sapphire · Sector 15, CBD Belapur · Navi
              Mumbai
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
