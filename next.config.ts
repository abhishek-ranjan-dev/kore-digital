import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    Whitelist LAN origins for `next dev` so a phone on the same Wi-Fi can
    hit the Mac's private IP without tripping Next's cross-origin guard.
    Combine with `npm run dev:lan` (binds to 0.0.0.0).
  */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  // Keep Node-only libs external (don't bundle them into the server bundle):
  // the market-data lib, and the PDF tools used by /admin AI auto-extract
  // (pdf.js-based; they can break when bundled).
  serverExternalPackages: ["yahoo-finance2", "unpdf", "pdf-lib", "@google/genai"],
  /*
    Reinforce the /admin exclusion at the HTTP layer. X-Robots-Tag applies even
    when a crawler skips the <meta> tag / robots.txt, and `noai`/`noimageai`
    signal AI/AEO crawlers to leave the admin console out entirely.
  */
  async headers() {
    const value = "noindex, nofollow, noarchive, noai, noimageai";
    return [
      { source: "/admin", headers: [{ key: "X-Robots-Tag", value }] },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value }] },
    ];
  },
  experimental: {
    /*
      Inline the (small, atomic Tailwind) CSS into <head> as <style> instead
      of a render-blocking <link>. Removes the CSS request from the critical
      path — improves FCP/LCP for first-time visitors (esp. slow mobile).
      Production-only; not applied in `next dev`.
    */
    inlineCss: true,
    // Tree-shake barrel imports from heavy UI libs so only the used bits ship
    // (smaller JS → less parse/eval → lower Total Blocking Time).
    optimizePackageImports: ["framer-motion", "recharts", "lucide-react"],
    serverActions: {
      /*
        Default is 1 MB. Bumped to 25 MB so the /admin document ingestion
        console can accept full annual-report and policy PDFs (which the
        server action itself caps at 25 MB via MAX_UPLOAD_BYTES).
      */
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
