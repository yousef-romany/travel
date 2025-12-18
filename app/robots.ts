import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/login',
          '/signup',
          '/complete-profile',
          '/reset-password',
          '/email-confirmation',
          '/me',
          '/me/*',
          '/_next/static/',
          '/admin/',
          '/*.json$',
          '/search?*',
          '/videos/*',
          '/*?video=*',
          '/seo-dashboard',
          '/dashboard',
          '/dashboard/*',
          '/edit-profile',
          '/wishlist',
          '/compare',
          '/invoices/*',
          '/book-custom-trip/*',
        ],
        crawlDelay: 1, // Be respectful to servers
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/login',
          '/signup',
          '/complete-profile',
          '/reset-password',
          '/email-confirmation',
          '/me',
          '/me/*',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
        ],
      },
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/login',
          '/signup',
          '/complete-profile',
          '/reset-password',
          '/email-confirmation',
          '/me',
          '/me/*',
          '/admin/',
        ],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/image-sitemap.xml`,
      `${SITE_URL}/video-sitemap.xml`,
      `${SITE_URL}/news-sitemap.xml`,
    ],
    host: SITE_URL,
  };
}
