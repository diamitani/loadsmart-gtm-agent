import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [],
  turbopack: process.env.VERCEL
    ? undefined
    : {
        root: "/Users/patmini",
      },
  outputFileTracingIncludes: {
    "/api/**": ["./docs/**/*", "./knowledge/**/*", "./automations/**/*"],
    "/app/**": ["./docs/**/*", "./knowledge/**/*", "./automations/**/*"],
  },
};

export default nextConfig;
