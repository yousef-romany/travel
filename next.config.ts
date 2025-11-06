import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "th.bing.com" },
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
      { protocol: "https", hostname: "instagram.fcai21-3.fna.fbcdn.net" },
    ],
  },

  async headers() {
    return [
      {
        // API Requests (لو عندك API Routes في Next)
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "http://localhost:1337" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,PATCH,DELETE,OPTIONS" },
        ],
      },
      {
        // باقي الصفحات
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "http://localhost:1337" },
          { key: "Access-Control-Allow-Credentials", value: "true" }
        ],
      },
    ];
  },
};

export default nextConfig;
