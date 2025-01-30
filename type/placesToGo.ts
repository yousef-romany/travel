export interface PlacesToGoCategory {
  data: PlacesToGoCategoryData[];
  meta: meta;
}
export interface PlacesToGoCategoryData {
  id: number;
  documentId: number;
  categoryName: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  place_to_go_subcategories: PlacesToGoSubcategories[];
  place_to_go_blogs: PlacesToGoBlogs[];
}

export interface PlacesToGoSubcategories {
  id: number;
  documentId: string;
  categoryName: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  place_to_go_blogs?: PlacesToGoBlogs[];
}

export interface PlacesToGoBlogs {
  id: number;
  documentId: string;
  title: string;
  imageUrl: string;
  details: string;
  youtubeUrl: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  lng: number;
  lat: number
}

export interface meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}
