import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Must cover a full gallery upload: MAX_PHOTOS (6) * MAX_PHOTO_BYTES (5 MB)
    // plus form fields. Keep in sync with those constants if they change.
    serverActions: { bodySizeLimit: "32mb" },
  },
};

export default nextConfig;
