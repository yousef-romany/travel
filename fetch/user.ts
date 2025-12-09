import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface UserProfile {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  dateOfBirth: string;
  isProfileCompleted: boolean;
  avatar?: string;
  role?: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface UserTrip {
  id: number;
  documentId: string;
  tripDate: string;
  endDate: string;
  bookingStatus: "upcoming" | "confirmed" | "completed" | "cancelled";
  numberOfTravelers: number;
  totalPrice: number;
  program: {
    id: number;
    documentId: string;
    title: string;
    Location: string;
    duration: number;
    images?: Array<{
      imageUrl: string;
    }>;
  };
}

export interface UserWishlistItem {
  id: number;
  documentId: string;
  program: {
    id: number;
    documentId: string;
    title: string;
    Location: string;
    price: number;
    duration: number;
    rating: number;
    images?: Array<{
      imageUrl: string;
    }>;
  };
}

export interface UserInvoice {
  id: number;
  documentId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  invoiceStatus: "paid" | "pending" | "overdue";
  tripName: string;
  booking?: {
    id: number;
    program: {
      title: string;
    };
  };
}

export interface UserStats {
  totalTrips: number;
  totalSpent: number;
  wishlistCount: number;
  upcomingTrips: number;
}

/**
 * Get user profile by user ID
 * Note: Strapi v5 uses integer id for user relations, not documentId
 */
export const getUserProfile = async (userId: number, token: string): Promise<UserProfile | null> => {
  try {
    // For Strapi v5, we can use the /me endpoint to get current user's profile
    const url = `${API_URL}/api/profiles?populate=user`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.data || response.data.data.length === 0) {
      return null;
    }

    // Return the profile that matches the userId
    const userProfile = response.data.data.find((profile: any) => profile.user?.id === userId);
    return userProfile || response.data.data[0];
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * Get user trips/bookings
 * For Strapi v5, fetch all bookings and filter client-side
 * Or use custom API endpoint if available
 */
export const getUserTrips = async (userId: number, token: string): Promise<UserTrip[]> => {
  try {
    // Fetch all bookings for authenticated user with proper population
    // Fixed: Only populate fields that exist in plan_trip (no user, no startDate/endDate)
    const url = `${API_URL}/api/bookings?populate[program][populate]=images&populate[plan_trip][fields][0]=tripName&populate[plan_trip][fields][1]=destinations&populate[plan_trip][fields][2]=totalPrice&populate[plan_trip][fields][3]=tripStatus&populate[event]=*&sort[0]=tripDate:desc`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Filter client-side to get only this user's bookings
    const allBookings = response.data.data || [];
    return allBookings.filter((booking: any) => booking.user?.id === userId);
  } catch (error) {
    console.error("Error fetching user trips:", error);
    // Return empty array if bookings collection doesn't exist yet
    return [];
  }
};

/**
 * Get user wishlist
 */
export const getUserWishlist = async (token: string): Promise<UserWishlistItem[]> => {
  try {
    const url = `${API_URL}/api/wishlists/me`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching user wishlist:", error);
    return [];
  }
};

/**
 * Get user invoices
 * For Strapi v5, fetch all invoices and filter client-side
 */
export const getUserInvoices = async (userId: number, token: string): Promise<UserInvoice[]> => {
  try {
    const url = `${API_URL}/api/invoices?populate=booking.program&populate=user&sort=issueDate:desc`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Filter client-side to get only this user's invoices
    const allInvoices = response.data.data || [];
    return allInvoices.filter((invoice: any) => invoice.user?.id === userId);
  } catch (error) {
    console.error("Error fetching user invoices:", error);
    // Return empty array if invoices collection doesn't exist yet
    return [];
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (userId: number, token: string): Promise<UserStats> => {
  try {
    const [trips, wishlist] = await Promise.all([
      getUserTrips(userId, token),
      getUserWishlist(token),
    ]);

    const completedTrips = trips.filter(trip => trip.bookingStatus === "completed");
    const upcomingTrips = trips.filter(trip => trip.bookingStatus === "upcoming" || trip.bookingStatus === "confirmed");
    const totalSpent = completedTrips.reduce((sum, trip) => sum + (trip.totalPrice || 0), 0);

    return {
      totalTrips: completedTrips.length,
      totalSpent,
      wishlistCount: wishlist.length,
      upcomingTrips: upcomingTrips.length,
    };
  } catch (error) {
    console.error("Error calculating user stats:", error);
    return {
      totalTrips: 0,
      totalSpent: 0,
      wishlistCount: 0,
      upcomingTrips: 0,
    };
  }
};

/**
 * Remove item from wishlist
 */
export const removeFromWishlist = async (wishlistItemId: string, token: string): Promise<void> => {
  try {
    const url = `${API_URL}/api/wishlists/${wishlistItemId}`;

    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

/**
 * Update user profile
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  dateOfBirth?: string;
  avatar?: string;
}

export const updateUserProfile = async (
  profileDocumentId: string,
  data: UpdateProfileData,
  token: string
): Promise<UserProfile> => {
  try {
    const url = `${API_URL}/api/profiles/${profileDocumentId}`;

    console.log("Updating profile with documentId:", profileDocumentId);
    console.log("Update data:", data);

    const response = await axios.put(
      url,
      { data },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};
