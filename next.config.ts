import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // tesseract.js spawns worker threads from its own files — keep it out of the bundle.
  serverExternalPackages: ["tesseract.js"],
  // The agent reads its skills and instructions from /agent at runtime.
  outputFileTracingIncludes: {
    "/api/**": ["./agent/**/*"],
    "/app/**": ["./agent/**/*"],
  },
};

export default nextConfig;
