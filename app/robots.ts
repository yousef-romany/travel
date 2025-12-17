import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

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
          '/forgot-password',
          '/email-confirmation',
          '/me',
          '/wishlist',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        crawlDelay: 1,
      },
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/image-sitemap.xml`,
    ],
  };
}
