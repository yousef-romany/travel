import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

  const robotsTxt = `# ZoeHoliday Robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /login
Disallow: /signup
Disallow: /complete-profile
Disallow: /reset-password
Disallow: /forgot-password
Disallow: /email-confirmation
Disallow: /me
Disallow: /wishlist

User-agent: Googlebot-Image
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
