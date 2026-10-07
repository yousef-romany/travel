import { NextResponse } from 'next/server';
import axios from 'axios';
import { encodePath, placeBlogPath, programPath } from '@/lib/links';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.zoeholidays.com';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholidays.com';

interface ProgramImage {
  documentId: string;
  slug?: string;
  title: string;
  images: Array<{
    url?: string;
    imageUrl?: string;
    alternativeText?: string;
  }>;
}

interface PlaceImage {
  title: string;
  url: string;
  image: {
    url: string;
    alternativeText?: string;
  };
}

async function getPrograms(): Promise<ProgramImage[]> {
  try {
    const response = await axios.get(`${API_URL}/api/programs?populate=images`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching programs for image sitemap:', error);
    return [];
  }
}

/**
 * Walk category -> subcategory -> blog so every entry carries its full
 * canonical path. The blog -> parent relations are empty in the CMS, so the
 * chain cannot be read the other way round.
 */
async function getPlaces(): Promise<PlaceImage[]> {
  try {
    const response = await axios.get(
      `${API_URL}/api/place-to-go-categories?populate[place_to_go_subcategories][populate][place_to_go_blogs][populate][image]=true`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } },
    );

    const places: PlaceImage[] = [];
    (response.data.data || []).forEach((category: any) => {
      (category.place_to_go_subcategories || []).forEach((subCategory: any) => {
        (subCategory.place_to_go_blogs || []).forEach((blog: any) => {
          if (!blog.image?.url) return;
          const path = placeBlogPath(category, subCategory, blog);
          if (path.endsWith('/')) return;
          places.push({ title: blog.title, url: path, image: blog.image });
        });
      });
    });
    return places;
  } catch (error) {
    console.error('Error fetching places for image sitemap:', error);
    return [];
  }
}

export async function GET() {
  const [programs, places] = await Promise.all([
    getPrograms(),
    getPlaces(),
  ]);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  // Add program images
  programs.forEach((program) => {
    if (program.images && program.images.length > 0) {
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(`${SITE_URL}${encodePath(programPath(program))}`)}</loc>\n`;

      program.images.slice(0, 5).forEach((image) => {
        const imageUrl = image.url || image.imageUrl;
        if (imageUrl) {
          const fullImageUrl = imageUrl.startsWith('http')
            ? imageUrl
            : `${API_URL}${imageUrl}`;

          xml += `    <image:image>\n`;
          xml += `      <image:loc>${escapeXml(fullImageUrl)}</image:loc>\n`;
          xml += `      <image:title>${escapeXml(program.title)}</image:title>\n`;
          if (image.alternativeText) {
            xml += `      <image:caption>${escapeXml(image.alternativeText)}</image:caption>\n`;
          }
          xml += `    </image:image>\n`;
        }
      });

      xml += `  </url>\n`;
    }
  });

  // Add place images
  places.forEach((place) => {
    if (place.image?.url) {
      const fullImageUrl = place.image.url.startsWith('http')
        ? place.image.url
        : `${API_URL}${place.image.url}`;

      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(`${SITE_URL}${encodePath(place.url)}`)}</loc>\n`;
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(fullImageUrl)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(place.title)}</image:title>\n`;
      if (place.image.alternativeText) {
        xml += `      <image:caption>${escapeXml(place.image.alternativeText)}</image:caption>\n`;
      }
      xml += `    </image:image>\n`;
      xml += `  </url>\n`;
    }
  });

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
