// src/fetch/bookings.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface BookingType {
  id: number;
  documentId: string;
  fullName: string;
  email: string;
  phone: string;
  numberOfTravelers: number;
  travelDate: string;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled";
  totalAmount: number;
  program?: {
    id: number;
    documentId: string;
    title: string;
    price: number;
    duration: number;
  };
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

export interface BookingsResponse {
  data: BookingType[];
  meta: Meta;
}

// Fetch all bookings for the current user
export const fetchUserBookings = async (
  userId?: string
): Promise<BookingsResponse> => {
  try {
    // Get auth token from localStorage
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    let url = `${API_URL}/api/bookings?populate=program&sort=createdAt:desc`;

    // If userId is provided, filter by user
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
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

// Create a new booking
export const createBooking = async (bookingData: {
  fullName: string;
  email: string;
  phone: string;
  numberOfTravelers: number;
  travelDate: string;
  specialRequests?: string;
  programId: string;
  userId?: string;
}): Promise<{ data: BookingType }> => {
  try {
    // Get auth token from localStorage
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.post(
      `${API_URL}/api/bookings`,
      {
        data: {
          fullName: bookingData.fullName,
          email: bookingData.email,
          phone: bookingData.phone,
          numberOfTravelers: bookingData.numberOfTravelers,
          travelDate: bookingData.travelDate,
          specialRequests: bookingData.specialRequests,
          status: "pending",
          program: bookingData.programId,
          user: bookingData.userId,
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
    console.error("Error creating booking:", error);
    throw error;
  }
};

// Fetch a single booking by ID
export const fetchBookingById = async (
  bookingId: string
): Promise<{ data: BookingType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.get(
      `${API_URL}/api/bookings/${bookingId}?populate=program`,
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (
  bookingId: string,
  status: "pending" | "confirmed" | "cancelled"
): Promise<{ data: BookingType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.put(
      `${API_URL}/api/bookings/${bookingId}`,
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
    console.error("Error updating booking:", error);
    throw error;
  }
};
