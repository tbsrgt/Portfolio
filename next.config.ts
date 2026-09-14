import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
      },
      {
        protocol: "https",
        hostname: "parentez.vercel.app",
      },
      {
        protocol: "https",
        hostname: "mistraltp.vercel.app",
      },
    ],
  },
};

export default nextConfig;
