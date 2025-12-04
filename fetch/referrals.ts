// fetch/referrals.ts - Referral API integration

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export interface Referral {
  id: number;
  referralCode: string;
  status: "pending" | "completed" | "expired" | "cancelled";
  referralReward: number;
  referredReward: number;
  bookingId?: string;
  completedAt?: string;
  expiryDate: string;
  isRewardClaimed: boolean;
  claimedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  referrer?: any;
  referred?: any;
}

export interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalEarned: number;
  activeCode: string | null;
}

/**
 * Generate a referral code for the current user
 */
export async function generateReferralCode(): Promise<{
  referralCode: string;
  expiryDate: string;
  message: string;
}> {
  const token = localStorage.getItem("authToken");

  const response = await axios.post(
    `${API_URL}/api/referrals/generate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

/**
 * Validate a referral code
 */
export async function validateReferralCode(referralCode: string): Promise<{
  isValid: boolean;
  referralReward?: number;
  referredReward?: number;
  message: string;
}> {
  const token = localStorage.getItem("authToken");

  const response = await axios.post(
    `${API_URL}/api/referrals/validate`,
    { referralCode },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

/**
 * Complete a referral (called after first booking)
 */
export async function completeReferral(bookingId: string): Promise<{
  success: boolean;
  referralReward: number;
  referredReward: number;
  message: string;
}> {
  const token = localStorage.getItem("authToken");

  const response = await axios.post(
    `${API_URL}/api/referrals/complete`,
    { bookingId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

/**
 * Get user's referral statistics
 */
export async function getReferralStats(): Promise<ReferralStats> {
  const token = localStorage.getItem("authToken");

  const response = await axios.get(
    `${API_URL}/api/referrals/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

/**
 * Get user's referral history
 */
export async function getReferralHistory(): Promise<Referral[]> {
  const token = localStorage.getItem("authToken");

  const response = await axios.get(
    `${API_URL}/api/referrals/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
