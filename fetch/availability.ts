// fetch/availability.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface ProgramAvailability {
  id: number;
  documentId: string;
  date: string;
  availableSpots: number;
  totalSpots: number;
  isAvailable: boolean;
  availabilityStatus: "available" | "limited" | "sold-out" | "cancelled";
  priceOverride?: number;
  minimumBooking?: number;
  maximumBooking?: number;
  notes?: string;
  program?: {
    id: number;
    documentId: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityResponse {
  data: ProgramAvailability[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetch availability for a specific program
 */
export const fetchProgramAvailability = async (
  programId: string,
  startDate?: string,
  endDate?: string
): Promise<AvailabilityResponse> => {
  try {
    let url = `${API_URL}/api/program-availabilities?filters[program][documentId][$eq]=${programId}&populate=program&sort=date:asc`;

    // Add date range filters if provided
    if (startDate) {
      url += `&filters[date][$gte]=${startDate}`;
    }
    if (endDate) {
      url += `&filters[date][$lte]=${endDate}`;
    }

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching program availability:", error);
    throw error;
  }
};

/**
 * Check if a specific date is available for a program
 */
export const checkDateAvailability = async (
  programId: string,
  date: string
): Promise<ProgramAvailability | null> => {
  try {
    const url = `${API_URL}/api/program-availabilities?filters[program][documentId][$eq]=${programId}&filters[date][$eq]=${date}&populate=program`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error("Error checking date availability:", error);
    throw error;
  }
};

/**
 * Create availability record for a program
 */
export const createAvailability = async (availabilityData: {
  programId: string;
  date: string;
  totalSpots: number;
  availableSpots?: number;
}): Promise<{ data: ProgramAvailability }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const payload = {
      program: availabilityData.programId,
      date: availabilityData.date,
      totalSpots: availabilityData.totalSpots,
      availableSpots: availabilityData.availableSpots ?? availabilityData.totalSpots,
      isAvailable: (availabilityData.availableSpots ?? availabilityData.totalSpots) > 0,
    };

    const response = await axios.post(
      `${API_URL}/api/program-availabilities`,
      { data: payload },
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating availability:", error);
    throw error;
  }
};

/**
 * Update available spots when a booking is made
 */
export const updateAvailableSpots = async (
  availabilityId: string,
  spotsToBook: number
): Promise<{ data: ProgramAvailability }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    // First, fetch current availability
    const currentResponse = await axios.get(
      `${API_URL}/api/program-availabilities/${availabilityId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
        },
      }
    );

    const current = currentResponse.data.data;
    const newAvailableSpots = Math.max(0, current.availableSpots - spotsToBook);

    // Update with new available spots
    const response = await axios.put(
      `${API_URL}/api/program-availabilities/${availabilityId}`,
      {
        data: {
          availableSpots: newAvailableSpots,
          isAvailable: newAvailableSpots > 0,
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
    console.error("Error updating available spots:", error);
    throw error;
  }
};

/**
 * Get available dates for the next N days
 */
export const getAvailableDates = async (
  programId: string,
  daysAhead: number = 90
): Promise<string[]> => {
  try {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + daysAhead);

    const startDateStr = today.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    const response = await fetchProgramAvailability(
      programId,
      startDateStr,
      endDateStr
    );

    return response.data
      .filter((availability) => availability.isAvailable && availability.availableSpots > 0)
      .map((availability) => availability.date);
  } catch (error) {
    console.error("Error getting available dates:", error);
    return [];
  }
};
