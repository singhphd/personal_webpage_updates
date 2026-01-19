import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/personal_webpage",
  assetPrefix: "/personal_webpage",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
