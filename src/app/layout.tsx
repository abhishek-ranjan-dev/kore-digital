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
    "Kore Digital Limited (NSE: KDL) is a multi-sector deep-tech conglomerate building India's telecom infrastructure network — 701 km underground fiber optic network on the Samruddhi Mahamarg, a 1 GW AI datacenter hub in NAINA Mumbai, and on-demand metal additive manufacturing & reverse engineering for aerospace and defence.",
  keywords: [
    // Primary SEO targets
    "AI datacenter",
    "telecom infrastructure network",
    "on demand metal additive manufacturing",
    "reverse engineering",
    "underground fiber optic network",
    // Brand & listing
    "Kore Digital",
    "Kore Digital Limited",
    "KDL",
    "KOREDIGIT",
    "NSE listed",
    "SEBI",
    "investor relations",
    // Programme & project keywords
    "Samruddhi Mahamarg fiber",
    "NAINA Mumbai datacenter",
    "1 GW hyperscale datacenter",
    "701 km fiber backbone",
    "dark fiber lease",
    "metal 3D printing India",
    "aerospace precision manufacturing",
    "titanium nickel alloy spares",
    "SINE IIT Bombay",
  ],
  openGraph: {
    title: "Kore Digital Limited — India's Next-Gen Infrastructure Conglomerate",
    description:
      "NSE-listed. Underground fiber optic network, AI datacenter infrastructure, and on-demand metal additive manufacturing & reverse engineering for aerospace and defence.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kore Digital Limited (NSE: KDL)",
    description:
      "Telecom infrastructure network · AI datacenter · On-demand metal additive manufacturing · Reverse engineering.",
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-obsidian text-white">
        {children}
      </body>
    </html>
  );
}
