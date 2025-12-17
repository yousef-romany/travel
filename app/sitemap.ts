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
    const response = await axios.get(`${API_URL}/api/programs`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching programs for sitemap:', error);
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
    console.error('Error fetching events for sitemap:', error);
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
    console.error('Error fetching place categories for sitemap:', error);
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

  // Dynamic program pages
  const programPages: MetadataRoute.Sitemap = programs.map((program) => ({
    url: `${SITE_URL}/programs/${program.documentId}`,
    lastModified: program.updatedAt ? new Date(program.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic event pages
  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${SITE_URL}/events/${event.documentId}`,
    lastModified: event.updatedAt ? new Date(event.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

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
