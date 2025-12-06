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

    // Query using testimonialId and userId fields (not relation filters)
    const response = await axios.get(
      `${API_URL}/api/testimonial-votes?filters[testimonialId][$eq]=${testimonialId}&filters[userId][$eq]=${userId}`,
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

    const payload = {
      data: {
        testimonialId: testimonialId,
        userId: userId,
        voteType,
      },
    };

    console.log("Creating vote with payload:", JSON.stringify(payload, null, 2));
    console.log("testimonialId:", testimonialId);
    console.log("userId:", userId);
    console.log("voteType:", voteType);

    // Backend expects testimonialId and userId (not testimonial/user)
    const response = await axios.post(
      `${API_URL}/api/testimonial-votes`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error creating vote:", error);
    // Log full error for debugging
    if (error.response) {
      console.error("Error response FULL:", JSON.stringify(error.response.data, null, 2));
      console.error("Error status:", error.response.status);
      console.error("Error details:", error.response.data?.error?.details);
    }

    // If endpoint doesn't exist (404), throw helpful error
    if (error.response?.status === 404) {
      throw new Error("Testimonial votes feature not configured in backend. Please create the testimonial-votes collection in Strapi.");
    }

    // If validation error (400), provide details
    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.error?.message || "Invalid vote data";
      const errorDetails = error.response?.data?.error?.details || {};
      console.error("Validation error details:", errorDetails);
      throw new Error(`Vote creation failed: ${errorMsg}`);
    }

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
  } catch (error: any) {
    console.error("Error updating vote:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
    }
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
  } catch (error: any) {
    console.error("Error deleting vote:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
    }
    throw error;
  }
};
