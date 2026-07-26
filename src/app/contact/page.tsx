import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import SectionBadge from "@/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Kore Digital Limited. Email us at cs@koredigital.com or visit our corporate office at Shelton Sapphire, CBD Belapur, Navi Mumbai.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-obsidian pt-32 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionBadge icon={MessageSquare} label="Get in touch" tone="dark" />
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.05]">
              Talk to Kore Digital.
            </h1>
            <p className="mt-4 text-lg text-white/60 max-w-2xl leading-relaxed">
              One team. One inbox. Ready for investor enquiries, partnership conversations, and press.
            </p>
          </div>
        </section>
        <ContactUs />
      </main>
      <Footer />
    </>
  );
}
