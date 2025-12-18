import { MetadataRoute } from 'next';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.zoeholidays.com';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

interface Program {
  documentId: string;
  title: string;
  updatedAt?: string;
  Location?: string;
  images?: Array<{
    image?: string;
    url?: string;
    imageUrl?: string;
  }>;
}

interface Event {
  documentId: string;
  title: string;
  updatedAt?: string;
  Location?: string;
}

interface PlaceCategory {
  documentId: string;
  categoryName: string;
  updatedAt?: string;
}

async function getPrograms(): Promise<Program[]> {
  try {
    const response = await axios.get(`${API_URL}/api/programs?populate=images`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return response.data.data || [];
  } catch (error) {
    // Silently fail for sitemap generation
    return [];
  }
}

async function getEvents(): Promise<Event[]> {
  try {
    const response = await axios.get(`${API_URL}/api/events`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return response.data.data || [];
  } catch (error) {
    // Silently fail for sitemap generation
    return [];
  }
}

async function getPlaceCategories(): Promise<PlaceCategory[]> {
  try {
    const response = await axios.get(`${API_URL}/api/place-to-go-categories`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return response.data.data || [];
  } catch (error) {
    // Silently fail for sitemap generation
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const programs = await getPrograms();
  const events = await getEvents();
  const placeCategories = await getPlaceCategories();

  // Extract unique locations from programs and events
  const locations = new Set<string>();
  programs.forEach((program) => {
    if (program.Location) {
      locations.add(program.Location.toLowerCase().replace(/\s+/g, '-'));
    }
  });
  events.forEach((event) => {
    if (event.Location) {
      locations.add(event.Location.toLowerCase().replace(/\s+/g, '-'));
    }
  });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/programs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/placesTogo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/inspiration`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/plan-your-trip`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/promo-codes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamic program pages with intelligent priority and changefreq
  const programPages: MetadataRoute.Sitemap = programs.map((program) => {
    const firstImage = program.images?.[0];
    const imageUrl = firstImage?.image || firstImage?.url || firstImage?.imageUrl;
    const fullImageUrl = imageUrl?.startsWith('http')
      ? imageUrl
      : imageUrl
        ? `${API_URL}${imageUrl}`
        : undefined;

    // Calculate intelligent priority based on freshness
    const lastModified = program.updatedAt ? new Date(program.updatedAt) : new Date();
    const daysSinceUpdate = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24));

    // Priority: 0.95 for new/recently updated, decreases with age
    let priority = 0.95;
    if (daysSinceUpdate > 30) priority = 0.85;
    if (daysSinceUpdate > 90) priority = 0.8;
    if (daysSinceUpdate > 180) priority = 0.75;

    // Change frequency based on update recency
    let changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly';
    if (daysSinceUpdate < 7) changeFrequency = 'daily';
    if (daysSinceUpdate > 90) changeFrequency = 'monthly';

    return {
      url: `${SITE_URL}/programs/${program.documentId}`,
      lastModified,
      changeFrequency,
      priority,
      images: fullImageUrl ? [fullImageUrl] : undefined,
    };
  });

  // Dynamic event pages with time-sensitive priority
  const eventPages: MetadataRoute.Sitemap = events.map((event) => {
    const lastModified = event.updatedAt ? new Date(event.updatedAt) : new Date();
    const daysSinceUpdate = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24));

    // Events are time-sensitive, higher priority for recent ones
    let priority = 0.9;
    let changeFrequency: 'daily' | 'weekly' | 'monthly' = 'daily';

    if (daysSinceUpdate < 14) {
      priority = 0.95;
      changeFrequency = 'daily';
    } else if (daysSinceUpdate < 30) {
      priority = 0.85;
      changeFrequency = 'weekly';
    } else {
      priority = 0.7;
      changeFrequency = 'monthly';
    }

    return {
      url: `${SITE_URL}/events/${event.documentId}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });

  // Dynamic destination hub pages
  const destinationPages: MetadataRoute.Sitemap = Array.from(locations).map((location) => ({
    url: `${SITE_URL}/destinations/${location}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Dynamic place category pages
  const placeCategoryPages: MetadataRoute.Sitemap = placeCategories.map((category) => ({
    url: `${SITE_URL}/placesTogo/${encodeURIComponent(category.categoryName)}`,
    lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...programPages,
    ...eventPages,
    ...destinationPages,
    ...placeCategoryPages,
  ];
}
