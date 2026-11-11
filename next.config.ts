import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // tesseract.js spawns worker threads from its own files — keep it out of the bundle.
  serverExternalPackages: ["tesseract.js"],
  // The agent reads its skills and instructions from /agent at runtime.
  outputFileTracingIncludes: {
    "/api/**": ["./agent/**/*", "./agents/**/*", "./build/**/*"],
    "/app/**": ["./agent/**/*", "./agents/**/*", "./build/**/*"],
  },
};

export default nextConfig;
