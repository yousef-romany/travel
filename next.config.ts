import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "th.bing.com" },
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
      { protocol: "https", hostname: "instagram.fcai21-3.fna.fbcdn.net" },
      { protocol: "https", hostname: "scontent-hbe1-1.cdninstagram.com" },
      {protocol: 'https',hostname: 'images.unsplash.com',},
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          // Security Headers
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: http://localhost:1337",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' http://localhost:1337 https://www.google-analytics.com",
              "media-src 'self' blob: data:",
              "frame-src 'self' https://www.google.com",
            ].join("; ")
          },
          // CORS for Strapi
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NODE_ENV === "production" ? "https://yourdomain.com" : "http://localhost:1337"
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true"
          },
        ],
      },
      {
        // API Routes specific headers
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NODE_ENV === "production" ? "https://yourdomain.com" : "http://localhost:1337"
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true"
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization"
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,PATCH,DELETE,OPTIONS"
          },
        ],
      },
      {
        // Cache static assets
        source: "/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache JavaScript and CSS
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
