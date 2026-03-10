import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const, basePath: "/RunPayway" } : {}),
  trailingSlash: true,
};

export default nextConfig;
