import { NextResponse } from 'next/server';
import axios from 'axios';
import { programPath } from '@/lib/links';
import { DEFAULT_OG_IMAGE, plainText } from '@/lib/seo-config';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.zoeholidays.com';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholidays.com';

interface Program {
  documentId: string;
  slug?: string;
  title: string;
  descraption?: string;
  Location?: string;
  duration?: number;
  updatedAt?: string;
  videoUrl?: string;
  youtubeId?: string;
  images?: Array<{
    url?: string;
    imageUrl?: string;
  }>;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const encodePath = (path: string) =>
  path.split('/').map((part) => part ? encodeURIComponent(part) : part).join('/');

async function getPrograms(): Promise<Program[]> {
  try {
    const response = await axios.get(`${API_URL}/api/programs?populate=images&pagination[limit]=100`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return response.data.data || [];
  } catch (error) {
    return [];
  }
}

export async function GET() {
  const programs = await getPrograms();

  // Filter programs that have video content
  const programsWithVideos = programs.filter(p => p.videoUrl || p.youtubeId);

  const videoEntries = programsWithVideos
    .map((program) => {
      const thumbnailUrl = program.images?.[0]?.url || program.images?.[0]?.imageUrl;
      const fullThumbnailUrl = thumbnailUrl?.startsWith('http')
        ? thumbnailUrl
        : thumbnailUrl
          ? `${API_URL}${thumbnailUrl}`
          : DEFAULT_OG_IMAGE;

      const videoUrl = program.videoUrl ||
        (program.youtubeId ? `https://www.youtube.com/watch?v=${program.youtubeId}` : null);

      if (!videoUrl) return null;

      const description = plainText(program.descraption) || `Explore ${program.title} in ${program.Location || 'Egypt'}.`;
      const videoLocation = program.youtubeId || /youtu(?:\.be|be\.com)/i.test(videoUrl)
        ? `<video:player_loc allow_embed="yes">${escapeXml(videoUrl)}</video:player_loc>`
        : `<video:content_loc>${escapeXml(videoUrl)}</video:content_loc>`;
      const publicationDate = program.updatedAt
        ? `<video:publication_date>${escapeXml(program.updatedAt)}</video:publication_date>`
        : '';

      return `
    <url>
      <loc>${escapeXml(`${SITE_URL}${encodePath(programPath(program))}`)}</loc>
      <video:video>
        <video:thumbnail_loc>${escapeXml(fullThumbnailUrl)}</video:thumbnail_loc>
        <video:title>${escapeXml(program.title)}</video:title>
        <video:description>${escapeXml(description)}</video:description>
        ${videoLocation}
        ${publicationDate}
        <video:family_friendly>yes</video:family_friendly>
        <video:requires_subscription>no</video:requires_subscription>
        <video:uploader info="${escapeXml(SITE_URL)}">ZoeHoliday</video:uploader>
        <video:live>no</video:live>
      </video:video>
    </url>`;
    })
    .filter(Boolean)
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${videoEntries}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
