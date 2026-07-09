import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kore Digital Limited | NSE Listed Deep-Tech Infrastructure Conglomerate",
    template: "%s | Kore Digital Limited",
  },
  description:
    "Kore Digital Limited (NSE: KOREDIGIT) is a multi-sector deep-tech conglomerate building India's next-generation digital and industrial infrastructure — spanning 701 km fiber backbone, 1 GW AI hyperscale datacenter, and precision aerospace manufacturing.",
  keywords: [
    "Kore Digital",
    "NSE listed",
    "fiber optic",
    "AI datacenter",
    "infrastructure",
    "Samruddhi Mahamarg",
    "NAINA Mumbai",
    "investor relations",
    "SEBI",
  ],
  openGraph: {
    title: "Kore Digital Limited — India's Next-Gen Infrastructure Conglomerate",
    description:
      "NSE-listed deep-tech company building fiber connectivity, AI compute infrastructure, and aerospace precision hardware.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-kd-bg text-slate-100">
        {children}
      </body>
    </html>
  );
}
