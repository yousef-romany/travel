import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface Testimonial {
  id: number;
  documentId: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  isApproved: boolean;
  testimonialType: "program" | "event" | "custom-trip" | "place" | "general";
  createdAt: string;
  updatedAt: string;
  helpfulVotes?: number;
  unhelpfulVotes?: number;
  reviewSource?: "user" | "viator" | "tripadvisor" | "getyourguide" | "tourhq";
  externalReviewId?: string;
  externalReviewUrl?: string;
  reviewerName?: string;
  reviewDate?: string;
  user?: {
    id: number;
    documentId: string;
    username: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
      phone: string;
      country: string;
    };
  };
  program?: {
    id: number;
    documentId: string;
    title: string;
  };
  event?: {
    id: number;
    documentId: string;
    title: string;
  };
  plan_trip?: {
    id: number;
    documentId: string;
    tripName: string;
  };
  place?: {
    id: number;
    documentId: string;
    title: string;
  };
}

interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

interface TestimonialsResponse {
  data: Testimonial[];
  meta: Meta;
}

// Fetch approved testimonials for a specific program
export const fetchProgramTestimonials = async (
  programId: string
): Promise<TestimonialsResponse> => {
  try {
    const url = `${API_URL}/api/testimonials?filters[program][documentId][$eq]=${programId}&filters[isApproved][$eq]=true&populate[user][populate][0]=profile&sort=createdAt:desc`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching program testimonials:", error);
    throw error;
  }
};

// Fetch approved testimonials for a specific event
export const fetchEventTestimonials = async (
  eventId: string
): Promise<TestimonialsResponse> => {
  try {
    const url = `${API_URL}/api/testimonials?filters[event][documentId][$eq]=${eventId}&filters[isApproved][$eq]=true&populate[user][populate][0]=profile&sort=createdAt:desc`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching event testimonials:", error);
    throw error;
  }
};

// Fetch approved testimonials for a specific custom trip
export const fetchCustomTripTestimonials = async (
  tripId: string
): Promise<TestimonialsResponse> => {
  try {
    const url = `${API_URL}/api/testimonials?filters[plan_trip][documentId][$eq]=${tripId}&filters[isApproved][$eq]=true&populate[user][populate][0]=profile&sort=createdAt:desc`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching custom trip testimonials:", error);
    throw error;
  }
};

// Fetch approved testimonials for a specific place
export const fetchPlaceTestimonials = async (
  placeId: string
): Promise<TestimonialsResponse> => {
  try {
    const url = `${API_URL}/api/testimonials?filters[place][documentId][$eq]=${placeId}&filters[isApproved][$eq]=true&populate[user][populate][0]=profile&sort=createdAt:desc`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching place testimonials:", error);
    throw error;
  }
};

// Fetch all approved testimonials for homepage (general + latest from all types)
export const fetchApprovedTestimonials = async (
  limit: number = 10
): Promise<TestimonialsResponse> => {
  try {
    const url = `${API_URL}/api/testimonials?filters[isApproved][$eq]=true&populate[user][populate][0]=profile&populate[program][fields][0]=title&populate[event][fields][0]=title&populate[plan_trip][fields][0]=tripName&populate[place][fields][0]=title&sort=createdAt:desc&pagination[pageSize]=${limit}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching approved testimonials:", error);
    throw error;
  }
};

// Fetch user's own testimonials
export const fetchUserTestimonials = async (
  userId?: string
): Promise<TestimonialsResponse> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    let url = `${API_URL}/api/testimonials?populate[user][populate][0]=profile&populate[program][fields][0]=title&populate[event][fields][0]=title&populate[plan_trip][fields][0]=tripName&populate[place][fields][0]=title&sort=createdAt:desc`;

    if (userId) {
      url += `&filters[user][documentId][$eq]=${userId}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken || API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user testimonials:", error);
    throw error;
  }
};

// Create a new testimonial
export const createTestimonial = async (testimonialData: {
  rating: number;
  comment: string;
  testimonialType: "program" | "event" | "custom-trip" | "place" | "general";
  userId: string;
  programId?: string;
  eventId?: string;
  planTripId?: string;
  placeId?: string;
}): Promise<{ data: Testimonial }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const data: any = {
      rating: testimonialData.rating,
      comment: testimonialData.comment,
      testimonialType: testimonialData.testimonialType === "custom-trip" ? "custom_trip" : testimonialData.testimonialType,
      isVerified: false,
      isApproved: false,
      user: testimonialData.userId,
    };

    // Add the appropriate relation based on type
    if (testimonialData.programId) {
      data.program = testimonialData.programId;
    }
    if (testimonialData.eventId) {
      data.event = testimonialData.eventId;
    }
    if (testimonialData.planTripId) {
      data.plan_trip = testimonialData.planTripId;
    }
    if (testimonialData.placeId) {
      data.place = testimonialData.placeId;
    }

    const response = await axios.post(
      `${API_URL}/api/testimonials`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw error;
  }
};

// Update testimonial
export const updateTestimonial = async (
  testimonialId: string,
  data: {
    rating?: number;
    comment?: string;
  }
): Promise<{ data: Testimonial }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.put(
      `${API_URL}/api/testimonials/${testimonialId}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
};

// Delete testimonial
export const deleteTestimonial = async (
  testimonialId: string
): Promise<void> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    await axios.delete(`${API_URL}/api/testimonials/${testimonialId}`, {
      headers: {
        Authorization: `Bearer ${authToken || API_TOKEN}`,
      },
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
};
// Check if user has already reviewed a specific item
// Get user's existing testimonial for a specific item
export const getUserTestimonial = async (
  userId: string,
  type: "program" | "event" | "custom-trip" | "place",
  relatedId: string
): Promise<Testimonial | null> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    let filterField = "";
    switch (type) {
      case "program":
        filterField = "program";
        break;
      case "event":
        filterField = "event";
        break;
      case "custom-trip":
        filterField = "plan_trip";
        break;
      case "place":
        filterField = "place";
        break;
    }

    const url = `${API_URL}/api/testimonials?filters[user][documentId][$eq]=${userId}&filters[${filterField}][documentId][$eq]=${relatedId}&populate=*`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken || API_TOKEN}`,
      },
    });

    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error("Error checking existing testimonial:", error);
    return null;
  }
};