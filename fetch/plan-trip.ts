// fetch/plan-trip.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface PlanTripDestination {
  id: number;
  title: string;
  price: number;
  location?: string;
  description?: string;
}

export interface PlanTripType {
  id: number;
  documentId: string;
  tripName: string;
  destinations: PlanTripDestination[];
  totalPrice: number;
  estimatedDuration: number;
  pricePerDay: number;
  status: "draft" | "quoted" | "booked" | "completed" | "cancelled";
  notes?: string;
  user?: any;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface PlanTripsResponse {
  data: PlanTripType[];
  meta: Meta;
}

// Fetch all plan trips for the current user
export const fetchUserPlanTrips = async (
  userId?: string
): Promise<PlanTripsResponse> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    let url = `${API_URL}/api/plan-trips?populate=*&sort=createdAt:desc`;

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
    console.error("Error fetching plan trips:", error);
    throw error;
  }
};

// Fetch popular/best custom trips (excluding drafts and cancelled, sorted by total price or creation date)
export const fetchBestCustomTrips = async (
  limit: number = 6
): Promise<PlanTripsResponse> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/plan-trips?populate=user&filters[status][$ne]=cancelled&filters[status][$ne]=draft&sort=totalPrice:desc&pagination[limit]=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching best custom trips:", error);
    throw error;
  }
};

// Create a new plan trip
export const createPlanTrip = async (planTripData: {
  tripName: string;
  destinations: PlanTripDestination[];
  totalPrice: number;
  estimatedDuration: number;
  pricePerDay: number;
  notes?: string;
  userId?: string;
  status?: "draft" | "quoted" | "booked" | "completed" | "cancelled";
}): Promise<{ data: PlanTripType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const payload: any = {
      tripName: planTripData.tripName,
      destinations: planTripData.destinations,
      totalPrice: planTripData.totalPrice,
      estimatedDuration: planTripData.estimatedDuration,
      pricePerDay: planTripData.pricePerDay,
      notes: planTripData.notes,
      status: planTripData.status || "draft",
    };

    // Add user relation if provided
    if (planTripData.userId) {
      payload.user = planTripData.userId;
    }

    console.log("Creating plan trip with payload:", payload);
    console.log("Auth token present:", !!authToken);

    const response = await axios.post(
      `${API_URL}/api/plan-trips`,
      {
        data: payload,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error creating plan trip:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

// Fetch a single plan trip by ID
export const fetchPlanTripById = async (
  planTripId: string
): Promise<{ data: PlanTripType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.get(
      `${API_URL}/api/plan-trips/${planTripId}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching plan trip:", error);
    throw error;
  }
};

// Update plan trip status
export const updatePlanTripStatus = async (
  planTripId: string,
  status: "draft" | "quoted" | "booked" | "completed" | "cancelled"
): Promise<{ data: PlanTripType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.put(
      `${API_URL}/api/plan-trips/${planTripId}`,
      {
        data: { status },
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
    console.error("Error updating plan trip:", error);
    throw error;
  }
};

// Delete plan trip
export const deletePlanTrip = async (
  planTripId: string
): Promise<{ data: PlanTripType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.delete(
      `${API_URL}/api/plan-trips/${planTripId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting plan trip:", error);
    throw error;
  }
};
