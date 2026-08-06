import type { Metadata } from "next";

/*
  The admin console is a private operations tool — keep it out of search
  indexes, AI/AEO crawlers, and any automated site audit. This `robots`
  metadata emits <meta name="robots" content="noindex, nofollow, …"> on every
  /admin page; robots.txt and an X-Robots-Tag header (next.config) reinforce it.
*/
export const metadata: Metadata = {
  title: "Admin · Kore Digital",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
