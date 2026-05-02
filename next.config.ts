import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://snap.licdn.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://i.pravatar.cc https://www.facebook.com https://px.ads.linkedin.com https://www.google-analytics.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.stripe.com https://runpayway-pressuremap.mcallpl.workers.dev https://www.google-analytics.com https://analytics.google.com https://www.facebook.com https://px.ads.linkedin.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://*.stripe.com",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  ...(isStaticExport ? {
    output: "export" as const,
    basePath: "/RunPayway",
  } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // Security headers — only in dynamic mode (static uses .htaccess)
  ...(!isStaticExport
    ? {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: securityHeaders,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
