import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ecosystem from "@/components/Ecosystem";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, ShieldCheck, BarChart3, FileCheck } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Ecosystem />
        <InvestorCTA />
        <ContactUs />
      </main>
      <Footer />
    </>
  );
}

function InvestorCTA() {
  const highlights = [
    {
      icon: BarChart3,
      title: "Audited Financials",
      body: "FY19-20 through FY24-25 audited results with full annual reports available for download.",
    },
    {
      icon: FileCheck,
      title: "NSE Reg. 30 Disclosures",
      body: "Continuous disclosures including board meetings, material updates, analyst presentations, and corporate actions.",
    },
    {
      icon: ShieldCheck,
      title: "SEBI LODR Compliant",
      body: "Full compliance with SEBI Listing Obligations including Regulation 46 website disclosures and mandatory policies.",
    },
  ];

  return (
    <section className="bg-kd-surface border-t border-kd-border py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-6">
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
              Investor Relations
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Transparency Built
              <br />
              for Institutional Investors
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-lg">
              Kore Digital maintains a fully compliant NSE/SEBI investor
              relations hub — all disclosures, financials, governance documents,
              and board communications are accessible in one place.
            </p>
            <Link
              href="/investor-relations"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded transition-colors text-sm"
            >
              Open Investor Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Highlight cards */}
          <div className="space-y-4">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div
                  key={h.title}
                  className="flex gap-4 bg-kd-card border border-kd-border rounded-xl p-5 hover:border-kd-border-hi transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-kd-elevated border border-kd-border flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">
                      {h.title}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {h.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
