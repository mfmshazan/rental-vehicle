import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy. Next injects inline bootstrap scripts and styles
// without a nonce, so 'unsafe-inline' is required; dev additionally needs
// 'unsafe-eval' and websockets for Turbopack HMR. The app loads no third-party
// scripts/fonts, so everything else is locked to same-origin. blob:/data: cover
// the client-side image previews. (upgrade-insecure-requests is intentionally
// omitted so it can't break HTTP localhost/preview servers.)
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // HSTS only matters over HTTPS; browsers ignore it on plain HTTP responses.
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig: NextConfig = {
  experimental: {
    // Must cover a full gallery upload: MAX_PHOTOS (6) * MAX_PHOTO_BYTES (5 MB)
    // plus form fields. Keep in sync with those constants if they change.
    serverActions: { bodySizeLimit: "32mb" },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
