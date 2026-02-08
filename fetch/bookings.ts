// src/fetch/bookings.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";
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
  bookingStatus: "pending" | "confirmed" | "cancelled";
  totalAmount: number;
  bookingType?: "program" | "custom-trip" | "event";
  customTripName?: string;
  promoCodeId?: string;
  discountAmount?: number;
  finalPrice?: number;
  program?: {
    id: number;
    documentId: string;
    title: string;
    price: number;
    duration: number;
    Location?: string;
    images?: Array<{
      id: number;
      url: string;
      name: string;
    }>;
  };
  plan_trip?: {
    id: number;
    documentId: string;
    tripName: string;
    estimatedDuration: number;
    totalPrice: number;
    destinations?: Array<{
      title: string;
      location?: string;
      price: number;
    }>;
  };
  event?: {
    id: number;
    documentId: string;
    title: string;
    price?: number;
    location?: string;
    startDate?: string;
    endDate?: string;
    featuredImage?: {
      id: number;
      url: string;
      name: string;
    };
    gallery?: Array<{
      id: number;
      url: string;
      name: string;
    }>;
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

    // Build URL with proper deep population syntax for Strapi v5
    // Event has 'featuredImage' and 'gallery', not 'images'
    // plan_trip: Only populate safe fields (tripName, destinations, totalPrice, status, notes)
    // Do NOT populate: user (causes conflict), startDate/endDate (don't exist)
    let url = `${API_URL}/api/bookings?populate[program][populate][0]=images&populate[plan_trip][fields][0]=tripName&populate[plan_trip][fields][1]=destinations&populate[plan_trip][fields][2]=totalPrice&populate[plan_trip][fields][3]=status&populate[plan_trip][fields][4]=notes&populate[event][populate][0]=featuredImage&populate[event][populate][1]=gallery&sort[0]=createdAt:desc`;

    // If userId is provided, filter by user documentId
    if (userId) {
      url += `&filters[user][documentId][$eq]=${userId}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN || authToken}`,
      },
      timeout: 10000, // 10 second timeout
    });

    return response.data;
  } catch (error) {
    const axiosError = error as any;
    // Handle specific error types
    if (axiosError.code === 'ECONNREFUSED') {
      throw new Error("Unable to connect to the server. Please check if the backend is running.");
    }

    if (axiosError.response) {
      // Server responded with error status
      const status = axiosError.response.status;
      const message = axiosError.response.data?.error?.message || "An error occurred";

      if (status === 400) {
        throw new Error(`Invalid request: ${message}`);
      } else if (status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      } else if (status === 403) {
        throw new Error("Access forbidden. You don't have permission to view these bookings.");
      } else if (status === 404) {
        throw new Error("Bookings not found.");
      } else if (status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(message);
    }

    if (axiosError.request) {
      // Request made but no response received
      throw new Error("No response from server. Please check your internet connection.");
    }

    // Generic error
    throw new Error("Failed to fetch bookings. Please try again.");
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
  programId?: string;
  planTripId?: string;
  customTripName?: string;
  bookingType?: "program" | "custom-trip" | "event";
  userId?: string;
  totalAmount: number;
  promoCodeId?: string;
  discountAmount?: number;

  finalPrice?: number;
  selectedServices?: string[];
}): Promise<{ data: BookingType }> => {
  try {
    // Get auth token from localStorage
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const payload: Record<string, unknown> = {
      fullName: bookingData.fullName,
      email: bookingData.email,
      phone: bookingData.phone,
      numberOfTravelers: bookingData.numberOfTravelers,
      travelDate: bookingData.travelDate,
      specialRequests: bookingData.specialRequests,
      totalAmount: bookingData.totalAmount,
      bookingStatus: "pending",
      bookingType: bookingData.bookingType || "program",
      ...(bookingData.promoCodeId && { promoCode: bookingData.promoCodeId }),
      ...(bookingData.discountAmount && { discountAmount: bookingData.discountAmount }),
      ...(bookingData.finalPrice && { finalPrice: bookingData.finalPrice }),
      ...(bookingData.selectedServices && { selectedServices: bookingData.selectedServices }),
    };

    // Add custom trip name if provided
    if (bookingData.customTripName) {
      payload.customTripName = bookingData.customTripName;
    }

    // Add program relation if provided
    if (bookingData.programId) {
      payload.program = bookingData.programId;
    }

    // Add plan trip relation if provided
    if (bookingData.planTripId) {
      payload.plan_trip = bookingData.planTripId;
    }

    // Add user relation if provided
    if (bookingData.userId) {
      payload.user = bookingData.userId;
    }

    const response = await axios.post(
      `${API_URL}/api/bookings`,
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
      `${API_URL}/api/bookings/${bookingId}?populate[program][populate][0]=images&populate[plan_trip][fields][0]=tripName&populate[plan_trip][fields][1]=totalPrice&populate[event][populate][0]=featuredImage`,
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (
  bookingId: string,
  bookingStatus: "pending" | "confirmed" | "cancelled"
): Promise<{ data: BookingType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await axios.put(
      `${API_URL}/api/bookings/${bookingId}`,
      {
        data: { bookingStatus },
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
    throw error;
  }
};

// Cancel booking with 24-hour policy check
export const cancelBooking = async (
  bookingId: string,
  bookingCreatedAt: string
): Promise<{ data: BookingType }> => {
  try {
    // Check 24-hour cancellation policy
    const createdDate = new Date(bookingCreatedAt);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreation > 24) {
      throw new Error(
        "Cancellation period has expired. Bookings can only be cancelled within 24 hours of creation."
      );
    }

    // Update booking status to cancelled
    const bookingResponse = await updateBookingStatus(bookingId, "cancelled");

    // Also update related invoice status to cancelled
    try {
      const { updateInvoiceStatusByBookingId } = await import("@/fetch/invoices");
      await updateInvoiceStatusByBookingId(bookingId, "cancelled");
    } catch (invoiceError) {
      // Don't throw error here - booking cancellation should succeed even if invoice update fails
    }

    return bookingResponse;
  } catch (error) {
    throw error;
  }
};

// Verify payment and create booking
export const verifyBookingPayment = async (
  orderID: string,
  bookingData: {
    fullName: string;
    email: string;
    phone: string;
    numberOfTravelers: number;
    travelDate: string;
    specialRequests?: string;
    programId?: string;
    planTripId?: string;
    customTripName?: string;
    bookingType?: "program" | "custom-trip" | "event";
    userId?: string;
    totalAmount: number;
    promoCodeId?: string;
    discountAmount?: number;
    finalPrice?: number;
    selectedServices?: string[];
  }
): Promise<{ data: BookingType }> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const payload: Record<string, unknown> = {
      fullName: bookingData.fullName,
      email: bookingData.email,
      phone: bookingData.phone,
      numberOfTravelers: bookingData.numberOfTravelers,
      travelDate: bookingData.travelDate,
      specialRequests: bookingData.specialRequests,
      totalAmount: bookingData.totalAmount,
      bookingStatus: "pending",
      bookingType: bookingData.bookingType || "program",
      ...(bookingData.promoCodeId && { promoCode: bookingData.promoCodeId }),
      ...(bookingData.discountAmount && { discountAmount: bookingData.discountAmount }),
      ...(bookingData.finalPrice && { finalPrice: bookingData.finalPrice }),
      ...(bookingData.selectedServices && { selectedServices: bookingData.selectedServices }),
    };

    // Add relations
    if (bookingData.programId) payload.program = bookingData.programId;
    if (bookingData.planTripId) payload.plan_trip = bookingData.planTripId;
    if (bookingData.userId) payload.user = bookingData.userId;
    if (bookingData.customTripName) payload.customTripName = bookingData.customTripName;

    const response = await axios.post(
      `${API_URL}/api/bookings/verify-payment`,
      {
        orderID,
        bookingData: payload,
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
    throw error;
  }
};
