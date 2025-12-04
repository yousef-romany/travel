// lib/group-discounts.ts

export interface GroupDiscount {
  minTravelers: number;
  maxTravelers: number;
  discountPercentage: number;
  description: string;
}

// Default group discount tiers
const GROUP_DISCOUNTS: GroupDiscount[] = [
  {
    minTravelers: 4,
    maxTravelers: 6,
    discountPercentage: 5,
    description: "Small Group Discount",
  },
  {
    minTravelers: 7,
    maxTravelers: 10,
    discountPercentage: 10,
    description: "Group Discount",
  },
  {
    minTravelers: 11,
    maxTravelers: 15,
    discountPercentage: 15,
    description: "Large Group Discount",
  },
  {
    minTravelers: 16,
    maxTravelers: Infinity,
    discountPercentage: 20,
    description: "Extra Large Group Discount",
  },
];

/**
 * Calculate group discount based on number of travelers
 */
export function calculateGroupDiscount(
  numberOfTravelers: number,
  basePrice: number,
  customDiscounts?: GroupDiscount[]
): {
  discount: GroupDiscount | null;
  discountAmount: number;
  discountedPrice: number;
  originalTotal: number;
  finalTotal: number;
} {
  const discounts = customDiscounts || GROUP_DISCOUNTS;

  // Find applicable discount tier
  const applicableDiscount = discounts.find(
    (discount) =>
      numberOfTravelers >= discount.minTravelers &&
      numberOfTravelers <= discount.maxTravelers
  );

  const originalTotal = basePrice * numberOfTravelers;

  if (!applicableDiscount) {
    return {
      discount: null,
      discountAmount: 0,
      discountedPrice: basePrice,
      originalTotal,
      finalTotal: originalTotal,
    };
  }

  // Calculate discount
  const discountAmount = (basePrice * applicableDiscount.discountPercentage) / 100;
  const discountedPrice = basePrice - discountAmount;
  const finalTotal = discountedPrice * numberOfTravelers;

  return {
    discount: applicableDiscount,
    discountAmount,
    discountedPrice,
    originalTotal,
    finalTotal,
  };
}

/**
 * Get all available group discount tiers
 */
export function getGroupDiscountTiers(
  customDiscounts?: GroupDiscount[]
): GroupDiscount[] {
  return customDiscounts || GROUP_DISCOUNTS;
}

/**
 * Get next discount tier information
 */
export function getNextDiscountTier(
  currentTravelers: number,
  customDiscounts?: GroupDiscount[]
): GroupDiscount | null {
  const discounts = customDiscounts || GROUP_DISCOUNTS;

  // Find the next tier
  const nextTier = discounts.find(
    (discount) => currentTravelers < discount.minTravelers
  );

  return nextTier || null;
}

/**
 * Calculate savings from group discount
 */
export function calculateGroupSavings(
  numberOfTravelers: number,
  basePrice: number,
  customDiscounts?: GroupDiscount[]
): number {
  const result = calculateGroupDiscount(numberOfTravelers, basePrice, customDiscounts);
  return result.originalTotal - result.finalTotal;
}
