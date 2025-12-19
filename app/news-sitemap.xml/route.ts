import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.zoeholidays.com';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

interface Article {
  documentId: string;
  title: string;
  description?: string;
  publishedAt?: string;
  updatedAt?: string;
  category?: string;
}

async function getRecentArticles(): Promise<Article[]> {
  try {
    // Google News sitemaps can include articles up to 2 years old
    // Using 30 days to ensure we always have content
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const response = await axios.get(
      `${API_URL}/api/inspiration?filters[publishedAt][$gte]=${thirtyDaysAgo}&sort=publishedAt:desc&pagination[limit]=100`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    const articles = response.data.data || [];

    // If no articles found with date filter, get the most recent ones
    if (articles.length === 0) {
      const fallbackResponse = await axios.get(
        `${API_URL}/api/inspiration?sort=publishedAt:desc&pagination[limit]=50`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      return fallbackResponse.data.data || [];
    }

    return articles;
  } catch (error) {
    // Even on error, try to get at least some articles
    try {
      const fallbackResponse = await axios.get(
        `${API_URL}/api/inspiration?sort=publishedAt:desc&pagination[limit]=50`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      return fallbackResponse.data.data || [];
    } catch {
      return [];
    }
  }
}

export async function GET() {
  const articles = await getRecentArticles();

  // If no articles found, return a minimal valid sitemap with the inspiration page
  if (articles.length === 0) {
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${SITE_URL}/inspiration</loc>
    <news:news>
      <news:publication>
        <news:name>ZoeHoliday Travel Blog</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date().toISOString()}</news:publication_date>
      <news:title>ZoeHoliday Travel Inspiration</news:title>
      <news:keywords>Egypt travel, travel tips, tourism, vacation planning</news:keywords>
    </news:news>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  }

  const newsEntries = articles
    .map((article) => {
      const pubDate = article.publishedAt || article.updatedAt || new Date().toISOString();

      return `
    <url>
      <loc>${SITE_URL}/inspiration/${article.documentId}</loc>
      <news:news>
        <news:publication>
          <news:name>ZoeHoliday Travel Blog</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${pubDate}</news:publication_date>
        <news:title>${article.title}</news:title>
        <news:keywords>Egypt travel, ${article.category || 'travel tips'}, tourism</news:keywords>
      </news:news>
    </url>`;
    })
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${newsEntries}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache for news
    },
  });
}
