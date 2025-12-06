// fetch/loyalty.ts - Loyalty API integration

import axios from "axios";
import { LoyaltyPoints, PointTransaction } from "@/lib/loyalty";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Fetch user's loyalty points and stats from Strapi
 */
export async function fetchUserLoyalty(authToken: string): Promise<LoyaltyPoints> {
  try {
    // Try to get user with loyalty_points relation
    // If relation doesn't exist, catch error and return default data
    const response = await axios.get(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const user = response.data;

    // Try to fetch loyalty_points separately if it exists as a relation
    let loyaltyData = null;
    try {
      const loyaltyResponse = await axios.get(`${API_URL}/api/users/me?populate[loyalty_points]=*`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      loyaltyData = loyaltyResponse.data.loyalty_points || loyaltyResponse.data.loyaltyPoints;
    } catch (loyaltyError) {
      // Loyalty relation doesn't exist, will use default data
      console.log("Loyalty points relation not configured, using defaults");
    }

    if (!loyaltyData) {
      // Return default data if user has no loyalty points yet
      return {
        userId: user.id,
        totalPoints: 0,
        currentTier: "Explorer",
        pointsToNextTier: 500,
        lifetimeSpent: 0,
        bookingsCount: 0,
        earnedThisMonth: 0,
        history: [],
      };
    }

    return {
      userId: user.id,
      totalPoints: loyaltyData.totalPoints || 0,
      currentTier: loyaltyData.currentTier || "Explorer",
      pointsToNextTier: loyaltyData.pointsToNextTier || 500,
      lifetimeSpent: loyaltyData.lifetimeSpent || 0,
      bookingsCount: loyaltyData.bookingsCount || 0,
      earnedThisMonth: loyaltyData.earnedThisMonth || 0,
      history: loyaltyData.history || [],
    };
  } catch (error: any) {
    console.error("Error fetching loyalty data:", error);

    // If the endpoint doesn't exist or the relation isn't populated, return default data
    if (error.response?.status === 404 || error.response?.status === 400 || error.code === 'ERR_BAD_REQUEST') {
      console.warn("Loyalty points not available. Using default data.");
      return {
        userId: 0,
        totalPoints: 0,
        currentTier: "Explorer",
        pointsToNextTier: 500,
        lifetimeSpent: 0,
        bookingsCount: 0,
        earnedThisMonth: 0,
        history: [],
      };
    }

    throw error;
  }
}

/**
 * Fetch user's point transaction history
 */
export async function fetchPointHistory(authToken: string): Promise<PointTransaction[]> {
  try {
    const response = await axios.get(
      `${API_URL}/api/loyalty-transactions?populate=*&sort[0]=createdAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data.data.map((transaction: any) => ({
      id: transaction.documentId || transaction.id.toString(),
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.createdAt,
      relatedBooking: transaction.relatedBooking,
    }));
  } catch (error: any) {
    console.error("Error fetching point history:", error);

    // Return empty array if endpoint doesn't exist
    if (error.response?.status === 404) {
      console.warn("Loyalty transactions endpoint not found. Using empty history.");
      return [];
    }

    throw error;
  }
}

/**
 * Add loyalty points for a booking
 */
export async function addLoyaltyPoints(
  authToken: string,
  bookingId: string,
  amount: number
): Promise<{ success: boolean; pointsAdded: number; newTotal: number }> {
  try {
    const response = await axios.post(
      `${API_URL}/api/loyalty/add-points`,
      {
        bookingId,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding loyalty points:", error);
    throw error;
  }
}

/**
 * Redeem loyalty points
 */
export async function redeemPoints(
  authToken: string,
  points: number,
  bookingId?: string
): Promise<{ success: boolean; pointsRedeemed: number; dollarValue: number }> {
  try {
    const response = await axios.post(
      `${API_URL}/api/loyalty/redeem-points`,
      {
        points,
        bookingId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error redeeming points:", error);
    throw error;
  }
}
