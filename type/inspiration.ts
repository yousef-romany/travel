export interface InspirationCategory {
  data: InspirationCategoryData;
  meta: meta;
}
export interface InspirationCategoryData {
  id: number;
  documentId: number;
  categoryName: string;
  description: string;
  imageUrl: string;
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
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface InspireBlogs {
  id: number;
  documentId: string;
  title: string;
  imageUrl: string;
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
