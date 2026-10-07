import { NextResponse } from 'next/server';
import axios from 'axios';
import { inspireBlogPath } from '@/lib/links';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.zoeholidays.com';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholidays.com';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface InspireBlog {
  documentId: string;
  slug?: string;
  title: string;
  description?: string;
  publishedAt?: string;
  updatedAt?: string;
  inspire_subcategories?: Array<{
    documentId: string;
    slug?: string;
    categoryName?: string;
    inspire_category?: {
      documentId: string;
      slug?: string;
      categoryName?: string;
    };
  }>;
}

async function getRecentArticles(): Promise<InspireBlog[]> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const response = await axios.get(
      `${API_URL}/api/inspire-blogs?filters[publishedAt][$gte]=${thirtyDaysAgo}&sort=publishedAt:desc&pagination[limit]=100&populate[inspire_subcategories][populate]=inspire_category`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    const articles = response.data.data || [];

    if (articles.length === 0) {
      const fallbackResponse = await axios.get(
        `${API_URL}/api/inspire-blogs?sort=publishedAt:desc&pagination[limit]=50&populate[inspire_subcategories][populate]=inspire_category`,
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
    try {
      const fallbackResponse = await axios.get(
        `${API_URL}/api/inspire-blogs?sort=publishedAt:desc&pagination[limit]=50&populate[inspire_subcategories][populate]=inspire_category`,
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
      const subCategory = article.inspire_subcategories?.at(-1);
      const category = subCategory?.inspire_category;
      const categoryName = category?.categoryName;
      const subCategoryName = subCategory?.categoryName;

      if (!categoryName || !subCategoryName || !article.title) {
        return null;
      }

      const blogUrl = `${SITE_URL}${inspireBlogPath(category, subCategory, article)}`;

      return `
    <url>
      <loc>${blogUrl}</loc>
      <news:news>
        <news:publication>
          <news:name>ZoeHoliday Travel Blog</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${pubDate}</news:publication_date>
        <news:title>${escapeXml(article.title)}</news:title>
        <news:keywords>Egypt travel, ${escapeXml(categoryName)}, tourism</news:keywords>
      </news:news>
    </url>`;
    })
    .filter(Boolean)
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${newsEntries}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
