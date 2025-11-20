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
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching inspire blogs:", error);
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
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching place categories:", error);
    throw error;
  }
};

/**
 * Fetch top-rated programs for homepage
 */
export const fetchFeaturedPrograms = async (limit = 3): Promise<{ data: Program[]; meta: Meta }> => {
  try {
    const url = `${API_URL}/api/programs?populate=images&pagination[limit]=${limit}&sort=rating:desc`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching featured programs:", error);
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
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    throw error;
  }
};

/**
 * Fetch all homepage data in parallel
 */
export const fetchHomePageData = async (): Promise<HomePageData> => {
  try {
    const [inspireRes, placesRes, programsRes, instaRes] = await Promise.all([
      fetchInspireBlogs(3),
      fetchPlaceCategories(4),
      fetchFeaturedPrograms(3),
      fetchInstagramPosts(6),
    ]);

    return {
      inspireBlogs: inspireRes.data,
      placeCategories: placesRes.data,
      programs: programsRes.data,
      instagramPosts: instaRes.data,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    throw error;
  }
};
