export interface ContentStep {
  title: string;
  imageUrl?: string;
  image?: Media;
  price?: number;
  description?: string;
  place_to_go_subcategories?: {
    id: number;
    documentId: string;
    categoryName: string;
    place_to_go_categories?: {
      id: number;
      documentId: string;
      categoryName: string;
    }[];
  }[];
}

export interface dataTypeCardTravel {
  Location?: string;
  content_steps?: ContentStep[];
  createdAt?: string;
  descraption?: string;
  documentId?: string;
  duration?: string;
  tripType?: "single-day" | "multi-day";
  startTime?: string;
  endTime?: string;
  meetingPoint?: string;
  departureLocation?: string;
  returnLocation?: string;
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


// src/type/programs.ts


interface MediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface Media {
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