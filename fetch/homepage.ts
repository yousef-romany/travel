import { Media } from "@/type/programs";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface InspireBlog {
  id: number;
  documentId: string;
  title: string;
  image: Media;
  details: string;
  inspire_category?: {
    categoryName: string;
  };
}

export interface PlaceToGoCategory {
  id: number;
  documentId: string;
  categoryName: string;
  image: Media;
  description: string;
}

export interface ProgramImage {
  id: number;
  imageUrl: string;
}

export interface Program {
  id: number;
  documentId: string;
  title: string;
  descraption: string;
  Location: string;
  price: number;
  duration: number;
  rating: number;
  overView: string;
  images?: ProgramImage[];
}

export interface InstagramPost {
  id: number;
  documentId: string;
  idPost: string;
  place_to_go_blogs?: Array<{
    title: string;
    imageUrl: string;
  }>;
}

interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface HomePageData {
  inspireBlogs: InspireBlog[];
  placeCategories: PlaceToGoCategory[];
  programs: Program[];
  instagramPosts: InstagramPost[];
}

/**
 * Fetch featured inspire blogs for homepage
 */
export const fetchInspireBlogs = async (limit = 3): Promise<{ data: InspireBlog[]; meta: Meta }> => {
  try {
    const url = `${API_URL}/api/inspire-blogs?populate[inspire_category][populate]=image&populate=image&pagination[limit]=${limit}&sort=createdAt:desc`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      timeout: 8000, // 8 second timeout
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching inspire blogs:", error);

    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      throw new Error("Cannot connect to Strapi backend. Please ensure it's running on port 1337.");
    }

    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      throw new Error("Request timed out. The server is taking too long to respond.");
    }

    throw error;
  }
};

/**
 * Fetch place to go categories for homepage
 */
export const fetchPlaceCategories = async (limit = 4): Promise<{ data: PlaceToGoCategory[]; meta: Meta }> => {
  try {
    const url = `${API_URL}/api/place-to-go-categories?populate=*&pagination[limit]=${limit}&sort=createdAt:desc`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      timeout: 8000,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching place categories:", error);

    if (error.code === 'ECONNREFUSED') {
      throw new Error("Cannot connect to Strapi backend. Please ensure it's running.");
    }

    throw error;
  }
};

/**
 * Fetch top-rated programs for homepage
 */
export const fetchFeaturedPrograms = async (limit = 6): Promise<{ data: Program[]; meta: Meta }> => {
  try {
    const url = `${API_URL}/api/programs?populate=images&pagination[limit]=${limit}&sort=rating:desc`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      timeout: 8000,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching featured programs:", error);

    if (error.code === 'ECONNREFUSED') {
      throw new Error("Cannot connect to Strapi backend. Please ensure it's running.");
    }

    throw error;
  }
};

/**
 * Fetch Instagram posts for homepage
 */
export const fetchInstagramPosts = async (limit = 6): Promise<{ data: InstagramPost[]; meta: Meta }> => {
  try {
    const url = `${API_URL}/api/instagram-posts?populate=place_to_go_blogs&pagination[limit]=${limit}&sort=createdAt:desc`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      timeout: 8000,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching Instagram posts:", error);

    if (error.code === 'ECONNREFUSED') {
      throw new Error("Cannot connect to Strapi backend. Please ensure it's running.");
    }

    throw error;
  }
};

/**
 * Fetch all homepage data in parallel with graceful error handling
 */
export const fetchHomePageData = async (): Promise<HomePageData> => {
  try {
    // Fetch all data in parallel with individual error handling
    const [inspireRes, placesRes, programsRes, instaRes] = await Promise.allSettled([
      fetchInspireBlogs(3),
      fetchPlaceCategories(4),
      fetchFeaturedPrograms(6),
      fetchInstagramPosts(6),
    ]);

    // Extract data with fallbacks for failed requests
    const inspireBlogs = inspireRes.status === 'fulfilled' ? inspireRes.value.data : [];
    const placeCategories = placesRes.status === 'fulfilled' ? placesRes.value.data : [];
    const programs = programsRes.status === 'fulfilled' ? programsRes.value.data : [];
    const instagramPosts = instaRes.status === 'fulfilled' ? instaRes.value.data : [];

    // Log any failures for debugging
    if (inspireRes.status === 'rejected') {
      console.warn("Failed to fetch inspire blogs:", inspireRes.reason);
    }
    if (placesRes.status === 'rejected') {
      console.warn("Failed to fetch place categories:", placesRes.reason);
    }
    if (programsRes.status === 'rejected') {
      console.warn("Failed to fetch programs:", programsRes.reason);
    }
    if (instaRes.status === 'rejected') {
      console.warn("Failed to fetch Instagram posts:", instaRes.reason);
    }

    return {
      inspireBlogs,
      placeCategories,
      programs,
      instagramPosts,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);

    // Return empty data instead of throwing - page can still load
    return {
      inspireBlogs: [],
      placeCategories: [],
      programs: [],
      instagramPosts: [],
    };
  }
};
