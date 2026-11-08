import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The agent reads its skills and instructions from /agent at runtime.
  outputFileTracingIncludes: {
    "/api/**": ["./agent/**/*"],
    "/app/**": ["./agent/**/*"],
  },
};

export default nextConfig;
