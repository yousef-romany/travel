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

interface Blog {
  documentId: string;
  title: string;
  updatedAt?: string;
}

interface Category {
  categoryName: string;
  updatedAt?: string;
  subcategories?: Array<{
    categoryName: string;
    updatedAt?: string;
    blogs?: Blog[];
  }>;
}

const STATIC_PAGES_UPDATED = new Date("2026-08-01");
const SITE = SITE_URL;
const enc = encodeURIComponent;

async function getPrograms(): Promise<Program[]> {
  try {
    const response = await axios.get(`${API_URL}/api/programs?populate=images`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    return response.data.data || [];
  } catch (error) {
    return [];
  }
}

async function getEvents(): Promise<Event[]> {
  try {
    const response = await axios.get(`${API_URL}/api/events?populate=*`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    return response.data.data || [];
  } catch (error) {
    return [];
  }
}

async function getPlaceCategories(): Promise<Category[]> {
  try {
    const response = await axios.get(
      `${API_URL}/api/place-to-go-categories?populate[place_to_go_subcategories][populate][place_to_go_blogs]=true`,
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      },
    );
    return (response.data.data || []).map((cat: any) => ({
      categoryName: cat.categoryName,
      updatedAt: cat.updatedAt,
      subcategories: (cat.place_to_go_subcategories || []).map((sub: any) => ({
        categoryName: sub.categoryName,
        updatedAt: sub.updatedAt,
        blogs: (sub.place_to_go_blogs || []).map((b: any) => ({
          title: b.title,
          documentId: b.documentId,
          updatedAt: b.updatedAt,
        })),
      })),
    }));
  } catch (error) {
    return [];
  }
}

async function getInspirationCategories(): Promise<Category[]> {
  try {
    const response = await axios.get(
      `${API_URL}/api/inspire-categories?populate[inspire_subcategories][populate][inspire_blogs]=true`,
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      },
    );
    return (response.data.data || []).map((cat: any) => ({
      categoryName: cat.categoryName,
      updatedAt: cat.updatedAt,
      subcategories: (cat.inspire_subcategories || []).map((sub: any) => ({
        categoryName: sub.categoryName,
        updatedAt: sub.updatedAt,
        blogs: (sub.inspire_blogs || []).map((b: any) => ({
          title: b.title,
          documentId: b.documentId,
          updatedAt: b.updatedAt,
        })),
      })),
    }));
  } catch (error) {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programs, events, placeCategories, inspirationCategories] =
    await Promise.all([
      getPrograms(),
      getEvents(),
      getPlaceCategories(),
      getInspirationCategories(),
    ]);

  // Static pages — only canonical, indexable pages (/terms redirects to /terms-and-conditions)
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/programs`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/events`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/placesTogo`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/inspiration`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/plan-your-trip`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/promo-codes`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/about`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/contact`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/privacy-policy`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/terms-and-conditions`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/business-events`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/media-industry`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/tourism-investment`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.5 },
  ];

  const programPages: MetadataRoute.Sitemap = programs.map((program) => {
    const firstImage = program.images?.[0];
    const imageUrl = firstImage?.image || firstImage?.url || firstImage?.imageUrl;
    const fullImageUrl = imageUrl?.startsWith("http")
      ? imageUrl
      : imageUrl
        ? `${API_URL}${imageUrl}`
        : undefined;

    const lastModified = program.updatedAt ? new Date(program.updatedAt) : STATIC_PAGES_UPDATED;
    const daysSinceUpdate = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24));
    const changeFrequency: "weekly" | "monthly" = daysSinceUpdate > 90 ? "monthly" : "weekly";

    return {
      url: `${SITE}/programs/${program.documentId}`,
      lastModified,
      changeFrequency,
      images: fullImageUrl ? [fullImageUrl] : undefined,
    };
  });

  const eventPages: MetadataRoute.Sitemap = events.map((event) => {
    const eventSlug = event.slug || event.documentId;
    const lastModified = event.updatedAt ? new Date(event.updatedAt) : STATIC_PAGES_UPDATED;
    const daysSinceUpdate = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24));
    const changeFrequency: "weekly" | "monthly" = daysSinceUpdate > 30 ? "monthly" : "weekly";

    return {
      url: `${SITE}/events/${enc(eventSlug)}`,
      lastModified,
      changeFrequency,
    };
  });

  // Places to Go: categories, subcategories, blogs
  const placePages: MetadataRoute.Sitemap = [];
  placeCategories.forEach((cat) => {
    const catName = String(cat.categoryName || "").trim();
    if (!catName) return;
    const catLastMod = cat.updatedAt ? new Date(cat.updatedAt) : STATIC_PAGES_UPDATED;
    placePages.push({
      url: `${SITE}/placesTogo/${enc(catName)}`,
      lastModified: catLastMod,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
    (cat.subcategories || []).forEach((sub) => {
      const subName = String(sub.categoryName || "").trim();
      if (!subName) return;
      const subLastMod = sub.updatedAt ? new Date(sub.updatedAt) : catLastMod;
      placePages.push({
        url: `${SITE}/placesTogo/${enc(catName)}/${enc(subName)}`,
        lastModified: subLastMod,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
      (sub.blogs || []).forEach((blog) => {
        const title = String(blog.title || "").trim();
        if (!title) return;
        placePages.push({
          url: `${SITE}/placesTogo/${enc(catName)}/${enc(subName)}/${enc(title)}`,
          lastModified: blog.updatedAt ? new Date(blog.updatedAt) : subLastMod,
          changeFrequency: "monthly" as const,
          priority: 0.5,
        });
      });
    });
  });

  // Inspiration: categories, subcategories, blogs
  const inspirationPages: MetadataRoute.Sitemap = [];
  inspirationCategories.forEach((cat) => {
    const catName = String(cat.categoryName || "").trim();
    if (!catName) return;
    const catLastMod = cat.updatedAt ? new Date(cat.updatedAt) : STATIC_PAGES_UPDATED;
    inspirationPages.push({
      url: `${SITE}/inspiration/${enc(catName)}`,
      lastModified: catLastMod,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
    (cat.subcategories || []).forEach((sub) => {
      const subName = String(sub.categoryName || "").trim();
      if (!subName) return;
      const subLastMod = sub.updatedAt ? new Date(sub.updatedAt) : catLastMod;
      inspirationPages.push({
        url: `${SITE}/inspiration/${enc(catName)}/${enc(subName)}`,
        lastModified: subLastMod,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
      (sub.blogs || []).forEach((blog) => {
        const title = String(blog.title || "").trim();
        if (!title) return;
        inspirationPages.push({
          url: `${SITE}/inspiration/${enc(catName)}/${enc(subName)}/${enc(title)}`,
          lastModified: blog.updatedAt ? new Date(blog.updatedAt) : subLastMod,
          changeFrequency: "monthly" as const,
          priority: 0.5,
        });
      });
    });
  });

  return [
    ...staticPages,
    ...programPages,
    ...eventPages,
    ...placePages,
    ...inspirationPages,
  ];
}
