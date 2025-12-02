import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface TestimonialVote {
  id: number;
  documentId: string;
  voteType: "helpful" | "unhelpful";
  createdAt: string;
  updatedAt: string;
}

interface VoteResponse {
  data: TestimonialVote | { removed: boolean } | { switched: boolean };
}

// Submit or toggle a vote on a testimonial
export const voteOnTestimonial = async (
  testimonialId: string,
  voteType: "helpful" | "unhelpful"
): Promise<VoteResponse> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.post(
      `${API_URL}/api/testimonial-votes`,
      {
        data: {
          testimonialId,
          voteType,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error voting on testimonial:", error);
    throw error;
  }
};

// Get user's vote on a specific testimonial
export const getUserVote = async (
  testimonialId: string
): Promise<{ data: TestimonialVote | null }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.get(
      `${API_URL}/api/testimonial-votes/user-vote/${testimonialId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching user vote:", error);
    return { data: null };
  }
};
