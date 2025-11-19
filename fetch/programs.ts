// src/fetch/programs.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
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
 * Fetch all programs from Strapi
 */
export const fetchProgramsList = async (): Promise<ProgramsResponse> => {
  try {
    const url = `${API_URL}/api/programs?populate=images&sort=rating:desc`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching programs list:", error);
    throw error;
  }
};

/**
 * Fetch a single program by title
 */
export const fetchProgramOne = async (title: string) => {
  try {
    const url = `${API_URL}/api/programs?populate[content_steps][populate][place_to_go_subcategories][populate]=place_to_go_categories&populate[includes]=true&populate[images]=true&populate[excludes]=true&filters[title][$eq]=${title}`;

    const response = await axios.get(String(url), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching program by title:", error);
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
    console.error("Error fetching program by ID:", error);
    throw error;
  }
};

/**
 * Search programs by location or title
 */
export const searchPrograms = async (query: string): Promise<ProgramsResponse> => {
  try {
    const url = `${API_URL}/api/programs?populate=images&filters[$or][0][title][$containsi]=${query}&filters[$or][1][Location][$containsi]=${query}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error searching programs:", error);
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
    console.error("Error filtering programs by price:", error);
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
    console.error("Error fetching program details:", error);
    throw error;
  }
};