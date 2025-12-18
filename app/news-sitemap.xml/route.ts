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
    // Get articles from the last 2 days (Google News requirement)
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

    const response = await axios.get(
      `${API_URL}/api/inspiration?filters[publishedAt][$gte]=${twoDaysAgo}&sort=publishedAt:desc&pagination[limit]=100`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );
    return response.data.data || [];
  } catch (error) {
    return [];
  }
}

export async function GET() {
  const articles = await getRecentArticles();

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
