import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ["res.cloudinary.com","th.bing.com"],
    remotePatterns: [
      {
        protocol: "https", // or "http" if needed
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "th.bing.com",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
      },
    ],
  },
};

export default nextConfig;
