import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";
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
    const userProfile = response.data.data.find((profile: UserProfile) => profile.user?.id === userId);
    return userProfile || response.data.data[0];
  } catch (error) {
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
    return allBookings.filter((booking: UserTrip) => (booking as any).user?.id === userId);
  } catch (error) {
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
    return allInvoices.filter((invoice: UserInvoice) => (invoice as any).user?.id === userId);
  } catch (error) {
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
  } catch (error) {
    throw error;
  }
};

export interface LoyaltyData {
  id: number;
  documentId: string;
  points: number;
  lifetimePoints: number;
  tier: "Explorer" | "Adventurer" | "Globetrotter";
  history: Array<{
    date: string;
    amount: number;
    reason: string;
    type: "earned" | "redeemed";
  }>;
}

/**
 * Get user loyalty data
 */
export const getLoyaltyData = async (token: string): Promise<LoyaltyData | null> => {
  try {
    // Fetch loyalty record for the authenticated user
    // We assume the user relation is properly set up so we can filter by user.id or use /me if custom endpoint exists
    // But since this is a standard collection, we filter by user in the query
    // Note: In Strapi v5, filtering by relation usually requires populated fields or knowing the user ID structure

    // Better approach: fetch all loyalties and filter client side (for safety if we can't filter by 'me')
    // OR: use a filter query. 'filters[user][id][$eq]=ID'

    const userProfile = await axios.get(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userId = userProfile.data.id;

    const url = `${API_URL}/api/loyalties?filters[user][id][$eq]=${userId}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    return null;
  } catch (error) {
    return null;
  }
};

export interface ReferralData {
  id: number;
  documentId: string;
  code: string;
  usageCount: number;
  earnings: number;
}

/**
 * Get user referral code (lazy load)
 */
export const getMyReferralCode = async (token: string): Promise<ReferralData | null> => {
  try {
    const url = `${API_URL}/api/referrals/me`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    return null;
  }
};
