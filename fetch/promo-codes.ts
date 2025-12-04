// fetch/promo-codes.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
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
  description?: string;
  applicablePrograms?: string[]; // Array of program documentIds
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
 * Validate and apply promo code
 */
export const validatePromoCode = async (
  code: string,
  totalAmount: number,
  programId?: string
): Promise<PromoCodeValidation> => {
  try {
    // Fetch promo code from API
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
        errorMessage: "Invalid promo code",
      };
    }

    const promoCode: PromoCode = response.data.data[0];

    // Check if code is still valid (date range)
    const now = new Date();
    const validFrom = new Date(promoCode.validFrom);
    const validUntil = new Date(promoCode.validUntil);

    if (now < validFrom) {
      return {
        isValid: false,
        errorMessage: "This promo code is not yet valid",
      };
    }

    if (now > validUntil) {
      return {
        isValid: false,
        errorMessage: "This promo code has expired",
      };
    }

    // Check usage limit
    if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
      return {
        isValid: false,
        errorMessage: "This promo code has reached its usage limit",
      };
    }

    // Check minimum purchase requirement
    if (promoCode.minimumPurchase && totalAmount < promoCode.minimumPurchase) {
      return {
        isValid: false,
        errorMessage: `Minimum purchase of $${promoCode.minimumPurchase} required`,
      };
    }

    // Check if code applies to this program
    if (
      programId &&
      promoCode.applicablePrograms &&
      promoCode.applicablePrograms.length > 0
    ) {
      if (!promoCode.applicablePrograms.includes(programId)) {
        return {
          isValid: false,
          errorMessage: "This promo code is not applicable to this program",
        };
      }
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
 * Increment promo code usage count
 */
export const incrementPromoCodeUsage = async (
  promoCodeId: string
): Promise<void> => {
  try {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    // Fetch current usage count
    const currentResponse = await axios.get(
      `${API_URL}/api/promo-codes/${promoCodeId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken || API_TOKEN}`,
        },
      }
    );

    const currentCount = currentResponse.data.data.usageCount || 0;

    // Increment usage count
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
  } catch (error) {
    console.error("Error incrementing promo code usage:", error);
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
