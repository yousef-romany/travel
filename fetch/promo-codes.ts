// fetch/promo-codes.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface PromoCode {
  id: number;
  documentId: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumPurchase?: number;
  maximumDiscount?: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usageCount: number;
  userUsageLimit?: number; // Max uses per user
  firstTimeOnly?: boolean; // Only for first-time users
  stackable?: boolean; // Can combine with other promos
  priority?: number; // For stacking order (higher = applied first)
  description?: string;
  applicablePrograms?: string[]; // Array of program documentIds
  excludedPrograms?: string[]; // Programs to exclude
  categories?: string[]; // Applicable categories
  createdAt: string;
  updatedAt: string;
}

export interface PromoCodeValidation {
  isValid: boolean;
  promoCode?: PromoCode;
  discountAmount?: number;
  finalPrice?: number;
  errorMessage?: string;
}

/**
 * Validate and apply promo code with enhanced checks
 */
export const validatePromoCode = async (
  code: string,
  totalAmount: number,
  programId?: string,
  userEmail?: string,
  userId?: string
): Promise<PromoCodeValidation> => {
  try {
    // Fetch promo code from API (case-insensitive)
    const url = `${API_URL}/api/promo-codes?filters[code][$eqi]=${code.trim()}&filters[isActive][$eq]=true`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.data.data || response.data.data.length === 0) {
      return {
        isValid: false,
        errorMessage: "Invalid promo code. Please check and try again.",
      };
    }

    const promoCode: PromoCode = response.data.data[0];

    // Check if code is still valid (date range)
    const now = new Date();
    const validFrom = new Date(promoCode.validFrom);
    const validUntil = new Date(promoCode.validUntil);

    if (now < validFrom) {
      const daysUntilValid = Math.ceil((validFrom.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        isValid: false,
        errorMessage: `This promo code will be valid in ${daysUntilValid} day${daysUntilValid > 1 ? 's' : ''}`,
      };
    }

    if (now > validUntil) {
      return {
        isValid: false,
        errorMessage: "This promo code has expired",
      };
    }

    // Check global usage limit
    if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
      return {
        isValid: false,
        errorMessage: "This promo code has reached its usage limit",
      };
    }

    // Check user-specific usage limit
    if (promoCode.userUsageLimit && (userEmail || userId)) {
      const userUsageCount = await getUserPromoUsage(promoCode.documentId, userEmail, userId);
      if (userUsageCount >= promoCode.userUsageLimit) {
        return {
          isValid: false,
          errorMessage: "You have already used this promo code the maximum number of times",
        };
      }
    }

    // Check first-time user restriction
    if (promoCode.firstTimeOnly && (userEmail || userId)) {
      const hasBookedBefore = await checkIfUserHasBookedBefore(userEmail, userId);
      if (hasBookedBefore) {
        return {
          isValid: false,
          errorMessage: "This promo code is only valid for first-time users",
        };
      }
    }

    // Check minimum purchase requirement
    if (promoCode.minimumPurchase && totalAmount < promoCode.minimumPurchase) {
      const remaining = promoCode.minimumPurchase - totalAmount;
      return {
        isValid: false,
        errorMessage: `Add $${remaining.toFixed(2)} more to use this promo code (minimum: $${promoCode.minimumPurchase})`,
      };
    }

    // Check if code applies to this program
    if (programId) {
      // Check excluded programs first
      if (promoCode.excludedPrograms && promoCode.excludedPrograms.length > 0) {
        if (promoCode.excludedPrograms.includes(programId)) {
          return {
            isValid: false,
            errorMessage: "This promo code is not applicable to this program",
          };
        }
      }

      // Check applicable programs
      if (promoCode.applicablePrograms && promoCode.applicablePrograms.length > 0) {
        if (!promoCode.applicablePrograms.includes(programId)) {
          return {
            isValid: false,
            errorMessage: "This promo code is not applicable to this program",
          };
        }
      }

      // Check categories (if specified)
      // Note: This would require fetching program details to check category
      // Skipping for now as it adds complexity
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discountType === "percentage") {
      discountAmount = (totalAmount * promoCode.discountValue) / 100;
      // Apply maximum discount cap if exists
      if (promoCode.maximumDiscount && discountAmount > promoCode.maximumDiscount) {
        discountAmount = promoCode.maximumDiscount;
      }
    } else {
      // Fixed discount
      discountAmount = promoCode.discountValue;
    }

    // Ensure discount doesn't exceed total
    discountAmount = Math.min(discountAmount, totalAmount);

    const finalPrice = totalAmount - discountAmount;

    return {
      isValid: true,
      promoCode,
      discountAmount,
      finalPrice,
    };
  } catch (error) {
    console.error("Error validating promo code:", error);
    return {
      isValid: false,
      errorMessage: "Error validating promo code. Please try again.",
    };
  }
};

/**
 * Check how many times a user has used a specific promo code
 */
export const getUserPromoUsage = async (
  promoCodeId: string,
  userEmail?: string,
  userId?: string
): Promise<number> => {
  try {
    // Build filter for user identification
    let userFilter = "";
    if (userId) {
      userFilter = `&filters[userId][$eq]=${userId}`;
    } else if (userEmail) {
      userFilter = `&filters[email][$eqi]=${userEmail}`;
    } else {
      return 0;
    }

    const url = `${API_URL}/api/bookings?filters[promoCodeId][$eq]=${promoCodeId}${userFilter}&pagination[limit]=1000`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data.meta?.pagination?.total || 0;
  } catch (error) {
    console.error("Error checking user promo usage:", error);
    return 0;
  }
};

/**
 * Check if user has made any bookings before (for first-time user promos)
 */
export const checkIfUserHasBookedBefore = async (
  userEmail?: string,
  userId?: string
): Promise<boolean> => {
  try {
    let userFilter = "";
    if (userId) {
      userFilter = `filters[userId][$eq]=${userId}`;
    } else if (userEmail) {
      userFilter = `filters[email][$eqi]=${userEmail}`;
    } else {
      return false;
    }

    const url = `${API_URL}/api/bookings?${userFilter}&pagination[limit]=1`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return (response.data.meta?.pagination?.total || 0) > 0;
  } catch (error) {
    console.error("Error checking user booking history:", error);
    return false;
  }
};

/**
 * Increment promo code usage count with race condition protection
 */
export const incrementPromoCodeUsage = async (
  promoCodeId: string
): Promise<void> => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const authToken =
        typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      // Fetch current data with version/timestamp
      const currentResponse = await axios.get(
        `${API_URL}/api/promo-codes/${promoCodeId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken || API_TOKEN}`,
          },
        }
      );

      const currentCount = currentResponse.data.data.usageCount || 0;
      const currentUpdatedAt = currentResponse.data.data.updatedAt;

      // Increment usage count with optimistic locking check
      await axios.put(
        `${API_URL}/api/promo-codes/${promoCodeId}`,
        {
          data: {
            usageCount: currentCount + 1,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken || API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Success - exit loop
      return;
    } catch (error: any) {
      attempt++;

      // If it's a conflict or the last attempt failed, throw
      if (attempt >= maxRetries) {
        console.error("Error incrementing promo code usage after retries:", error);
        throw error;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
    }
  }
};

/**
 * Get recommended promo codes for a user based on cart/program
 */
export const getRecommendedPromos = async (
  totalAmount: number,
  programId?: string,
  userEmail?: string,
  userId?: string
): Promise<PromoCode[]> => {
  try {
    const now = new Date().toISOString();
    let url = `${API_URL}/api/promo-codes?filters[isActive][$eq]=true&filters[validUntil][$gte]=${now}&filters[validFrom][$lte]=${now}`;

    // Filter by minimum purchase
    url += `&filters[minimumPurchase][$lte]=${totalAmount}`;

    // Sort by discount value (highest first)
    url += `&sort=discountValue:desc&pagination[limit]=5`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    const promoCodes: PromoCode[] = response.data.data || [];

    // Filter client-side for more complex conditions
    const validPromos = [];
    for (const promo of promoCodes) {
      // Check usage limits
      if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
        continue;
      }

      // Check user-specific limits
      if (promo.userUsageLimit && (userEmail || userId)) {
        const userUsage = await getUserPromoUsage(promo.documentId, userEmail, userId);
        if (userUsage >= promo.userUsageLimit) {
          continue;
        }
      }

      // Check first-time user restriction
      if (promo.firstTimeOnly && (userEmail || userId)) {
        const hasBooked = await checkIfUserHasBookedBefore(userEmail, userId);
        if (hasBooked) {
          continue;
        }
      }

      // Check program restrictions
      if (programId) {
        if (promo.excludedPrograms?.includes(programId)) {
          continue;
        }
        if (promo.applicablePrograms && promo.applicablePrograms.length > 0) {
          if (!promo.applicablePrograms.includes(programId)) {
            continue;
          }
        }
      }

      validPromos.push(promo);
    }

    return validPromos;
  } catch (error) {
    console.error("Error fetching recommended promo codes:", error);
    return [];
  }
};

/**
 * Get active promo codes (for admin/display purposes)
 */
export const getActivePromoCodes = async (): Promise<PromoCode[]> => {
  try {
    const now = new Date().toISOString();
    const url = `${API_URL}/api/promo-codes?filters[isActive][$eq]=true&filters[validUntil][$gte]=${now}&sort=createdAt:desc`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching active promo codes:", error);
    return [];
  }
};
