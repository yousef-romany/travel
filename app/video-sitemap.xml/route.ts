import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.zoeholidays.com';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

interface Program {
  documentId: string;
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
          : `${SITE_URL}/default-thumbnail.jpg`;

      const videoUrl = program.videoUrl ||
        (program.youtubeId ? `https://www.youtube.com/watch?v=${program.youtubeId}` : null);

      if (!videoUrl) return null;

      const description = program.descraption || `Explore ${program.title} - ${program.Location || 'Egypt'}`;
      const durationSeconds = program.duration ? program.duration * 24 * 60 * 60 : 600; // Convert days to seconds, default 10 min

      return `
    <url>
      <loc>${SITE_URL}/programs/${program.documentId}</loc>
      <video:video>
        <video:thumbnail_loc>${fullThumbnailUrl}</video:thumbnail_loc>
        <video:title>${program.title}</video:title>
        <video:description>${description}</video:description>
        <video:content_loc>${videoUrl}</video:content_loc>
        <video:duration>${durationSeconds}</video:duration>
        <video:publication_date>${program.updatedAt || new Date().toISOString()}</video:publication_date>
        <video:family_friendly>yes</video:family_friendly>
        <video:requires_subscription>no</video:requires_subscription>
        <video:uploader info="${SITE_URL}">ZoeHoliday</video:uploader>
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
