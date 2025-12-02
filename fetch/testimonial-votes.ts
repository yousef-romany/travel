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

// Get user's vote on a specific testimonial
export const getUserVote = async (
  testimonialId: string,
  userId: string
): Promise<TestimonialVote | null> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.get(
      `${API_URL}/api/testimonial-votes?filters[testimonial][documentId][$eq]=${testimonialId}&filters[user][documentId][$eq]=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
        },
      }
    );

    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error("Error fetching user vote:", error);
    return null;
  }
};

// Create a new vote
export const createVote = async (
  testimonialId: string,
  userId: string,
  voteType: "helpful" | "unhelpful"
): Promise<TestimonialVote> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.post(
      `${API_URL}/api/testimonial-votes`,
      {
        data: {
          testimonial: testimonialId,
          user: userId,
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

    return response.data.data;
  } catch (error) {
    console.error("Error creating vote:", error);
    throw error;
  }
};

// Update an existing vote
export const updateVote = async (
  voteId: string,
  voteType: "helpful" | "unhelpful"
): Promise<TestimonialVote> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.put(
      `${API_URL}/api/testimonial-votes/${voteId}`,
      {
        data: {
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

    return response.data.data;
  } catch (error) {
    console.error("Error updating vote:", error);
    throw error;
  }
};

// Delete a vote
export const deleteVote = async (voteId: string): Promise<void> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    await axios.delete(`${API_URL}/api/testimonial-votes/${voteId}`, {
      headers: {
        Authorization: `Bearer ${authToken || API_TOKEN}`,
      },
    });
  } catch (error) {
    console.error("Error deleting vote:", error);
    throw error;
  }
};
