import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface Event {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  eventType: "live_blog" | "music" | "festival" | "cultural" | "sports" | "exhibition" | "other";
  startDate: string;
  endDate?: string;
  location?: string;
  venue?: string;
  price?: number;
  ticketUrl?: string;
  featuredImage?: any;
  gallery?: any[];
  videoUrl?: string;
  youtubeUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  tags?: string[];
  capacity?: number;
  attendees?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface EventsResponse {
  data: Event[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Fetch all events
export const fetchEvents = async (params?: {
  eventType?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sort?: string;
}): Promise<EventsResponse> => {
  try {
    let url = `${API_URL}/api/events?populate=*`;

    if (params) {
      if (params.eventType) {
        url += `&filters[eventType][$eq]=${params.eventType}`;
      }
      if (params.isFeatured !== undefined) {
        url += `&filters[isFeatured][$eq]=${params.isFeatured}`;
      }
      if (params.isActive !== undefined) {
        url += `&filters[isActive][$eq]=${params.isActive}`;
      }
      if (params.page) {
        url += `&pagination[page]=${params.page}`;
      }
      if (params.pageSize) {
        url += `&pagination[pageSize]=${params.pageSize}`;
      }
      if (params.sort) {
        url += `&sort=${params.sort}`;
      } else {
        url += `&sort=startDate:desc`;
      }
    } else {
      url += `&sort=startDate:desc`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Fetch single event by slug or documentId
export const fetchEventBySlug = async (
  slug: string
): Promise<{ data: Event }> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    if (response.data.data && response.data.data.length > 0) {
      return { data: response.data.data[0] };
    }

    throw new Error("Event not found");
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

// Fetch upcoming events
export const fetchUpcomingEvents = async (
  limit: number = 6
): Promise<EventsResponse> => {
  try {
    const today = new Date().toISOString();
    const response = await axios.get(
      `${API_URL}/api/events?filters[startDate][$gte]=${today}&filters[isActive][$eq]=true&populate=*&sort=startDate:asc&pagination[limit]=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
};

// Fetch featured events
export const fetchFeaturedEvents = async (
  limit: number = 3
): Promise<EventsResponse> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/events?filters[isFeatured][$eq]=true&filters[isActive][$eq]=true&populate=*&sort=startDate:desc&pagination[limit]=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching featured events:", error);
    throw error;
  }
};
