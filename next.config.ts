import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    Whitelist LAN origins for `next dev` so a phone on the same Wi-Fi can
    hit the Mac's private IP without tripping Next's cross-origin guard.
    Combine with `npm run dev:lan` (binds to 0.0.0.0).
  */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  // Keep the Node-only market-data lib external (don't bundle it into the route).
  serverExternalPackages: ["yahoo-finance2"],
  experimental: {
    /*
      Inline the (small, atomic Tailwind) CSS into <head> as <style> instead
      of a render-blocking <link>. Removes the CSS request from the critical
      path — improves FCP/LCP for first-time visitors (esp. slow mobile).
      Production-only; not applied in `next dev`.
    */
    inlineCss: true,
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
