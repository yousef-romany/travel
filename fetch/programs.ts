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

export interface ProgramType {
  id: number;
  documentId: string;
  title: string;
  descraption: string;
  Location: string;
  duration: number;
  price: number;
  rating: number;
  overView: string;
  images: Media[];
}

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
 * Fetch a single program by title or documentId
 */
export const fetchProgramOne = async (titleOrId: string) => {
  try {
    // Clean and decode the input
    const cleanInput = decodeURIComponent(titleOrId).trim();

    // First try to fetch by documentId (most efficient)
    try {
      const urlById = `${API_URL}/api/programs/${encodeURIComponent(cleanInput)}?populate[content_steps][populate][0]=image&populate[content_steps][populate][place_to_go_subcategories][populate]=place_to_go_categories&populate[includes]=true&populate[images]=true&populate[excludes]=true`;

      const responseById = await axios.get(urlById, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      // If found by ID, wrap in array format
      if (responseById.data.data) {
        return {
          data: [responseById.data.data],
          meta: responseById.data.meta || {}
        };
      }
    } catch (idError: any) {
      // If 404, continue to try by title
      if (idError.response?.status !== 404) {
        throw idError;
      }
    }

    // If not found by ID, try to fetch by title
    const urlByTitle = `${API_URL}/api/programs?populate[content_steps][populate][0]=image&populate[content_steps][populate][place_to_go_subcategories][populate]=place_to_go_categories&populate[includes]=true&populate[images]=true&populate[excludes]=true&filters[title][$eq]=${encodeURIComponent(cleanInput)}`;

    const responseByTitle = await axios.get(urlByTitle, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    // If found by title, return result
    if (responseByTitle.data.data && responseByTitle.data.data.length > 0) {
      return responseByTitle.data;
    }

    // If still not found, throw error
    throw new Error(`Program not found with identifier: ${cleanInput}`);
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch a single program by documentId
 */
export const fetchProgramById = async (documentId: string): Promise<ProgramType> => {
  try {
    const url = `${API_URL}/api/programs/${documentId}?populate[images]=*&populate[includes]=*&populate[excludes]=*&populate[content_steps][populate][place_to_go_subcategories][populate]=place_to_go_categories`;

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
    // Filter by:
    // 1. Title
    // 2. Location string
    // 3. Direct Category relation on ContentStep (if exists)
    // 4. Nested Category relation via Subcategory on ContentStep (most likely path)
    const url = `${API_URL}/api/programs?populate=images` +
      `&filters[$or][0][title][$containsi]=${query}` +
      `&filters[$or][1][Location][$containsi]=${query}` +
      `&filters[$or][2][content_steps][place_to_go_categories][categoryName][$containsi]=${query}` +
      `&filters[$or][3][content_steps][place_to_go_subcategories][place_to_go_categories][categoryName][$containsi]=${query}` +
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