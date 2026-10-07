// src/fetch/programs.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

interface MediaFormat {
  url: string;
  width: number;
  height: number;
}

interface Media {
  id: number;
  name: string;
  url: string;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
}

import { ProgramType } from "@/type/programs";
export type { ProgramType };

interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface ProgramsResponse {
  data: ProgramType[];
  meta: Meta;
}

/**
 * Fetch all programs from Strapi with retry logic
 */
export const fetchProgramsList = async (limit = 100): Promise<ProgramsResponse> => {
  const retries = 2;
  let lastError: Error = new Error('Failed to fetch programs');

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const url = `${API_URL}/api/programs?populate=images&pagination[limit]=${limit}&sort=rating:desc`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        timeout: 10000, // 10 second timeout
      });

      return response.data;
    } catch (error) {
      lastError = error as Error;
      const axiosError = error as any;

      // Don't retry on client errors (4xx)
      if (axiosError.response?.status >= 400 && axiosError.response?.status < 500) {
        break;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Handle the error after all retries
  const axiosError = lastError as any;
  if (axiosError.code === 'ECONNREFUSED') {
    throw new Error("Cannot connect to Strapi backend. Please ensure it's running on port 1337.");
  }

  if (axiosError.code === 'ETIMEDOUT' || axiosError.code === 'ECONNABORTED') {
    throw new Error("Request timed out. The server is not responding.");
  }

  if (axiosError.response) {
    const status = axiosError.response.status;
    if (status === 404) {
      throw new Error("Programs not found. Please check your Strapi content.");
    } else if (status >= 500) {
      throw new Error("Server error. Please try again later.");
    }
  }

  throw new Error("Failed to fetch programs. Please check your connection and try again.");
};

/**
 * Decode a route/fetch identifier without ever throwing: `decodeURIComponent`
 * raises on stray `%` sequences that can appear in legacy title-based URLs.
 */
export const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/**
 * Fetch a single program by slug, documentId or title.
 *
 * Order matters: slug is the canonical URL identifier, documentId keeps old
 * share/bookmarked links working (the page then 308s to the slug), and title
 * is a last-resort legacy fallback.
 *
 * Every step is best-effort so a backend that has not been redeployed with the
 * `slug` field yet (which answers `400 Invalid key slug`) still resolves the
 * old way instead of breaking the page.
 */
const LEGACY_PROGRAM_DETAIL_POPULATE =
  "populate[content_steps][populate][0]=image&populate[content_steps][populate][place_to_go_subcategories][populate]=*&populate[includes]=true&populate[images]=true&populate[excludes]=true&populate[services][populate]=image";
const PROGRAM_DETAIL_POPULATES = [
  `${LEGACY_PROGRAM_DETAIL_POPULATE}&populate[group_tiers]=*`,
  LEGACY_PROGRAM_DETAIL_POPULATE,
] as const;

async function getProgramWithCompatiblePopulate(
  createUrl: (populate: string) => string,
  headers: Record<string, string>,
) {
  let lastError: unknown;

  for (const populate of PROGRAM_DETAIL_POPULATES) {
    try {
      return await axios.get(createUrl(populate), { headers });
    } catch (error: any) {
      lastError = error;
      // A 400 commonly means production Strapi has not received the new
      // group_tiers relation yet. Retry with the legacy population query.
      if (error?.response?.status !== 400) throw error;
    }
  }

  throw lastError;
}

export const fetchProgramOne = async (identifier: string) => {
  const cleanInput = safeDecode(identifier).trim();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  };

  // 1) Canonical: resolve by slug
  try {
    const responseBySlug = await getProgramWithCompatiblePopulate(
      (populate) => `${API_URL}/api/programs?${populate}&filters[slug][$eq]=${encodeURIComponent(cleanInput)}`,
      headers,
    );
    if (responseBySlug.data.data && responseBySlug.data.data.length > 0) {
      return responseBySlug.data;
    }
  } catch {
    // Slug unsupported/unavailable - fall through to the legacy identifiers.
  }

  // 2) Legacy: resolve by documentId
  try {
    const responseById = await getProgramWithCompatiblePopulate(
      (populate) => `${API_URL}/api/programs/${encodeURIComponent(cleanInput)}?${populate}`,
      headers,
    );

    if (responseById.data.data) {
      return {
        data: [responseById.data.data],
        meta: responseById.data.meta || {},
      };
    }
  } catch (idError: any) {
    // Anything other than "not found" is a real failure
    if (idError.response?.status !== 404) {
      throw idError;
    }
  }

  // 3) Legacy: resolve by exact title
  try {
    const responseByTitle = await getProgramWithCompatiblePopulate(
      (populate) => `${API_URL}/api/programs?${populate}&filters[title][$eq]=${encodeURIComponent(cleanInput)}`,
      headers,
    );
    if (responseByTitle.data.data && responseByTitle.data.data.length > 0) {
      return responseByTitle.data;
    }
  } catch {
    // fall through to the "not found" error below
  }

  throw new Error(`Program not found with identifier: ${cleanInput}`);
};

/**
 * Fetch a single program by documentId
 */
export const fetchProgramById = async (documentId: string): Promise<ProgramType> => {
  try {
    const url = `${API_URL}/api/programs/${documentId}?populate[images]=*&populate[includes]=*&populate[excludes]=*&populate[services][populate]=image&populate[content_steps][populate][place_to_go_subcategories][populate]=*&populate[group_tiers]=*`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search programs by location or title
 */
export const searchPrograms = async (query: string, limit: number = 10): Promise<ProgramsResponse> => {
  try {
    // ✅ SECURITY: URL-encode the query to prevent injection
    const encodedQuery = encodeURIComponent(query);
    // Filter by:
    // 1. Title
    // 2. Location string
    // 3. Direct Category relation on ContentStep (if exists)
    // 4. Nested Category relation via Subcategory on ContentStep (most likely path)
    const url = `${API_URL}/api/programs?populate=images` +
      `&filters[$or][0][title][$containsi]=${encodedQuery}` +
      `&filters[$or][1][Location][$containsi]=${encodedQuery}` +
      `&filters[$or][2][content_steps][place_to_go_categories][categoryName][$containsi]=${encodedQuery}` +
      `&filters[$or][3][content_steps][place_to_go_subcategories][place_to_go_categories][categoryName][$containsi]=${encodedQuery}` +
      `&filters[$or][4][content_steps][place_to_go_subcategories][categoryName][$containsi]=${encodedQuery}` +
      `&pagination[limit]=${limit}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Filter programs by price range
 */
export const filterProgramsByPrice = async (
  minPrice: number,
  maxPrice: number
): Promise<ProgramsResponse> => {
  try {
    const url = `${API_URL}/api/programs?populate=images&filters[price][$gte]=${minPrice}&filters[price][$lte]=${maxPrice}&sort=rating:desc`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get program details with all relations
 */
export const fetchProgramDetails = async (titleOrId: string) => {
  try {
    // Try to fetch by title first
    const url = `${API_URL}/api/programs?populate[content_steps][populate][place_to_go_subcategories][populate]=place_to_go_categories&populate[content_steps][populate][place_to_go_categories]=*&populate[includes]=*&populate[images]=*&populate[excludes]=*&filters[title][$eq]=${titleOrId}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    // If found by title, return first result
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }

    // Otherwise try by documentId
    const urlById = `${API_URL}/api/programs/${titleOrId}?populate[content_steps][populate][place_to_go_subcategories][populate]=place_to_go_categories&populate[content_steps][populate][place_to_go_categories]=*&populate[includes]=*&populate[images]=*&populate[excludes]=*`;

    const responseById = await axios.get(urlById, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return responseById.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch related programs (same location or just random others)
 */
export const fetchRelatedPrograms = async (currentId: string, location?: string, limit: number = 3): Promise<ProgramType[]> => {
  try {
    let url = `${API_URL}/api/programs?populate=images&filters[documentId][$ne]=${currentId}&pagination[limit]=${limit}`;

    // If location is provided, prioritize same location
    if (location) {
      url += `&filters[Location][$containsi]=${encodeURIComponent(location)}`;
    }

    url += `&sort=rating:desc`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    let programs = response.data.data;

    // If we didn't get enough related programs by location, fetch generic ones
    if (!programs || programs.length < limit) {
      const remainingLimit = limit - (programs?.length || 0);
      const fallbackUrl = `${API_URL}/api/programs?populate=images&filters[documentId][$ne]=${currentId}&pagination[limit]=${remainingLimit}&sort=rating:desc`;

      const fallbackResponse = await axios.get(fallbackUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      if (fallbackResponse.data.data) {
        // Filter out duplicates just in case
        const existingIds = new Set(programs.map((p: any) => p.documentId));
        const newPrograms = fallbackResponse.data.data.filter((p: any) => !existingIds.has(p.documentId));
        programs = [...programs, ...newPrograms];
      }
    }

    return programs;
  } catch (error) {
    console.error("Error fetching related programs:", error);
    return [];
  }
};
