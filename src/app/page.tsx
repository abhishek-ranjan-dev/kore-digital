import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ExploreCTA />
        <ContactUs />
      </main>
      <Footer />
    </>
  );
}

/*
  ── Explore callout — minimal editorial break ───────────────────────
  Sits between the hero and the contact section. Deliberately sparse:
  one eyebrow, one headline, one line of body copy, two destination
  buttons. Keeps the landing page short so the hero remains the star.
*/
function ExploreCTA() {
  return (
    <section className="bg-surface border-t border-neutral-500/30 py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-accent text-[10px] font-mono tracking-[0.32em] uppercase mb-4">
          Explore &nbsp;·&nbsp; Kore Digital
        </p>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-50 tracking-tighter leading-[1.05] mb-5">
          Deep-tech infrastructure,
          <br className="hidden sm:block" />
          {" "}engineered for India&apos;s next decade.
        </h2>

        <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          Learn how Kore Digital is building the connectivity, compute, and
          hardware layers of India&apos;s digital infrastructure — or catch
          up on the latest field, financial, and exchange updates.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2
                       bg-accent hover:bg-accent/90 text-bg font-bold text-sm
                       px-6 py-3 rounded transition-colors"
          >
            About the Company
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/updates"
            className="inline-flex items-center justify-center gap-2
                       border border-neutral-500 text-neutral-100 hover:border-accent
                       hover:text-accent font-semibold text-sm
                       px-6 py-3 rounded transition-colors"
          >
            Latest Updates
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
