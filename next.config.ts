import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
