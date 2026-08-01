import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
