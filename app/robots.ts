import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
