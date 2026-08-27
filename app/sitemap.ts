import { MetadataRoute } from "next";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholidays.com";

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
  slug: string;
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
    const response = await axios.get(
      `${API_URL}/api/programs?populate=images`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      },
    );
    return response.data.data || [];
  } catch (error) {
    // Silently fail for sitemap generation
    return [];
  }
}

async function getEvents(): Promise<Event[]> {
  try {
    const response = await axios.get(`${API_URL}/api/events?populate=*`, {
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

  // Use a fixed "last updated" date for static pages (update manually when content changes)
  const STATIC_PAGES_UPDATED = new Date("2026-08-01");

  // Static pages — only include canonical, indexable pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/programs`,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/events`,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/placesTogo`,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/inspiration`,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/plan-your-trip`,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/promo-codes`,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // /terms intentionally excluded — legal page with no search value
  ];

  // Dynamic program pages
  const programPages: MetadataRoute.Sitemap = programs.map((program) => {
    const firstImage = program.images?.[0];
    const imageUrl =
      firstImage?.image || firstImage?.url || firstImage?.imageUrl;
    const fullImageUrl = imageUrl?.startsWith("http")
      ? imageUrl
      : imageUrl
        ? `${API_URL}${imageUrl}`
        : undefined;

    const lastModified = program.updatedAt
      ? new Date(program.updatedAt)
      : STATIC_PAGES_UPDATED;
    const daysSinceUpdate = Math.floor(
      (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24),
    );

    const changeFrequency: "weekly" | "monthly" =
      daysSinceUpdate > 90 ? "monthly" : "weekly";

    return {
      url: `${SITE_URL}/programs/${program.documentId}`,
      lastModified,
      changeFrequency,
      images: fullImageUrl ? [fullImageUrl] : undefined,
    };
  });

  // Dynamic event pages
  const eventPages: MetadataRoute.Sitemap = events.map((event) => {
    const eventSlug = event.slug || event.documentId;
    const lastModified = event.updatedAt
      ? new Date(event.updatedAt)
      : STATIC_PAGES_UPDATED;
    const daysSinceUpdate = Math.floor(
      (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24),
    );

    const changeFrequency: "weekly" | "monthly" =
      daysSinceUpdate > 30 ? "monthly" : "weekly";

    return {
      url: `${SITE_URL}/events/${encodeURIComponent(eventSlug)}`,
      lastModified,
      changeFrequency,
    };
  });

  // Dynamic destination (place category) pages — canonical: /placesTogo (lowercase g)
  const placeCategoryPages: MetadataRoute.Sitemap = placeCategories.map(
    (category) => ({
      url: `${SITE_URL}/placesTogo/${encodeURIComponent(category.categoryName.trim())}`,
      lastModified: category.updatedAt
        ? new Date(category.updatedAt)
        : STATIC_PAGES_UPDATED,
      changeFrequency: "monthly" as const,
    }),
  );

  return [
    ...staticPages,
    ...programPages,
    ...eventPages,
    ...placeCategoryPages,
  ];
}

