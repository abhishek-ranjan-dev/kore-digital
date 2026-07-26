import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    Whitelist LAN origins for `next dev` so a phone on the same Wi-Fi can
    hit the Mac's private IP without tripping Next's cross-origin guard.
    Combine with `npm run dev:lan` (binds to 0.0.0.0).
  */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  experimental: {
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
