import { Media } from "./programs";

export interface InspirationCategory {
  data: InspirationCategoryData[];
  meta: meta;
}
export interface InspirationCategoryData {
  id: number;
  documentId: number;
  categoryName: string;
  description: string;
  image: Media;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  inspire_subcategories: InspireSubcategories[];
  inspire_blogs: InspireBlogs[];
}

export interface InspireSubcategories {
  id: number;
  documentId: string;
  categoryName: string;
  image: Media;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  description?: string;
  inspire_blogs?: InspireBlogs[]
}

export interface InspireBlogs {
  id: number;
  documentId: string;
  title: string;
  image: Media;
  details: string;
  youtubeUrl: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}
