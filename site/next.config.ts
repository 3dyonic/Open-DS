import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // No Next.js badge in the corner during development.
  devIndicators: false,
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ["@open-ds/ui"],
};

export default nextConfig;
