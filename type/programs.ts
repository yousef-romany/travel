export interface dataTypeCardTravel {
  Location?: string;
  content_steps?: {
    title: string;
    place_to_go_subcategories: {
      categoryName: string;
      place_to_go_categories: { categoryName: string }[];
    }[];
  }[];
  createdAt?: string;
  descraption?: string;
  documentId?: string;
  duration?: string;
  excludes?: { id: number; title: string }[];
  id?: number;
  images?: { id: number; title: string; imageUrl: string }[];
  includes?: { id: number; title: string }[];
  overView?: string;
  price?: string;
  publishedAt?: string;
  rating?: string;
  title?: string;
  updatedAt?: string;
}
