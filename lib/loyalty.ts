// lib/loyalty.ts - Loyalty program management

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
  icon: string;
  discount: number; // Discount percentage for bookings
}

export interface LoyaltyPoints {
  userId: number;
  totalPoints: number;
  currentTier: string;
  pointsToNextTier: number;
  lifetimeSpent: number;
  bookingsCount: number;
  earnedThisMonth: number;
  history: PointTransaction[];
}

export interface PointTransaction {
  id: string;
  type: "earned" | "redeemed" | "expired" | "bonus";
  amount: number;
  description: string;
  date: string;
  relatedBooking?: string;
}

// Loyalty tier definitions
export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: "Explorer",
    minPoints: 0,
    color: "#94a3b8",
    icon: "🌟",
    discount: 0,
    benefits: [
      "Earn 1 point per $1 spent",
      "Birthday bonus: 100 points",
      "Priority customer support",
    ],
  },
  {
    name: "Adventurer",
    minPoints: 500,
    color: "#3b82f6",
    icon: "⭐",
    discount: 5,
    benefits: [
      "Earn 1.25 points per $1 spent",
      "5% discount on all bookings",
      "Early access to new programs",
      "Birthday bonus: 250 points",
      "Priority customer support",
    ],
  },
  {
    name: "Nomad",
    minPoints: 2000,
    color: "#8b5cf6",
    icon: "💎",
    discount: 10,
    benefits: [
      "Earn 1.5 points per $1 spent",
      "10% discount on all bookings",
      "Free travel insurance (Basic)",
      "Exclusive Nomad-only programs",
      "Complimentary airport transfers",
      "Birthday bonus: 500 points",
      "Dedicated concierge service",
    ],
  },
  {
    name: "Legend",
    minPoints: 5000,
    color: "#f59e0b",
    icon: "👑",
    discount: 15,
    benefits: [
      "Earn 2 points per $1 spent",
      "15% discount on all bookings",
      "Free travel insurance (Premium)",
      "Exclusive Legend-only programs",
      "Complimentary upgrades",
      "Priority booking & reservations",
      "Birthday bonus: 1000 points",
      "Personal travel consultant",
      "VIP airport lounge access",
    ],
  },
];

/**
 * Calculate points earned from a booking
 */
export function calculatePoints(amount: number, currentTier: string): number {
  const tier = LOYALTY_TIERS.find((t) => t.name === currentTier) || LOYALTY_TIERS[0];

  let multiplier = 1;
  switch (tier.name) {
    case "Adventurer":
      multiplier = 1.25;
      break;
    case "Nomad":
      multiplier = 1.5;
      break;
    case "Legend":
      multiplier = 2;
      break;
    default:
      multiplier = 1;
  }

  return Math.floor(amount * multiplier);
}

/**
 * Get tier discount percentage
 */
export function getTierDiscount(tierName: string): number {
  switch (tierName) {
    case "Adventurer":
      return 5;
    case "Nomad":
      return 10;
    case "Legend":
      return 15;
    default:
      return 0;
  }
}

/**
 * Determine user's current tier based on points
 */
export function getCurrentTier(points: number): LoyaltyTier {
  // Find the highest tier the user qualifies for
  const qualifiedTiers = LOYALTY_TIERS.filter((tier) => points >= tier.minPoints);
  return qualifiedTiers[qualifiedTiers.length - 1] || LOYALTY_TIERS[0];
}

/**
 * Calculate points needed for next tier
 */
export function getPointsToNextTier(currentPoints: number): number | null {
  const currentTier = getCurrentTier(currentPoints);
  const currentTierIndex = LOYALTY_TIERS.findIndex((t) => t.name === currentTier.name);

  // If already at highest tier
  if (currentTierIndex === LOYALTY_TIERS.length - 1) {
    return null;
  }

  const nextTier = LOYALTY_TIERS[currentTierIndex + 1];
  return nextTier.minPoints - currentPoints;
}

/**
 * Get next tier information
 */
export function getNextTier(currentPoints: number): LoyaltyTier | null {
  const currentTier = getCurrentTier(currentPoints);
  const currentTierIndex = LOYALTY_TIERS.findIndex((t) => t.name === currentTier.name);

  if (currentTierIndex === LOYALTY_TIERS.length - 1) {
    return null; // Already at highest tier
  }

  return LOYALTY_TIERS[currentTierIndex + 1];
}

/**
 * Convert points to dollars (redemption rate)
 * 100 points = $1 USD
 */
export function pointsToDollars(points: number): number {
  return points / 100;
}

/**
 * Convert dollars to points (earning rate)
 */
export function dollarsToPoints(dollars: number): number {
  return Math.floor(dollars);
}

/**
 * Check if user qualifies for birthday bonus
 * Returns bonus points if birthday is within 7 days
 */
export function checkBirthdayBonus(
  userBirthday: string,
  currentTier: string,
  lastBonusYear?: number
): { eligible: boolean; points: number; message?: string } {
  const today = new Date();
  const currentYear = today.getFullYear();

  // Check if already claimed this year
  if (lastBonusYear === currentYear) {
    return { eligible: false, points: 0 };
  }

  const birthday = new Date(userBirthday);
  birthday.setFullYear(currentYear);

  // Check if birthday is within 7 days (before or after)
  const diffTime = birthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (Math.abs(diffDays) <= 7) {
    let bonusPoints = 100; // Explorer default

    switch (currentTier) {
      case "Adventurer":
        bonusPoints = 250;
        break;
      case "Nomad":
        bonusPoints = 500;
        break;
      case "Legend":
        bonusPoints = 1000;
        break;
    }

    return {
      eligible: true,
      points: bonusPoints,
      message: `Happy Birthday! You've earned ${bonusPoints} bonus points!`,
    };
  }

  return { eligible: false, points: 0 };
}

/**
 * Apply loyalty discount to booking amount
 */
export function applyLoyaltyDiscount(
  bookingAmount: number,
  tierName: string
): { discount: number; finalAmount: number; percentage: number } {
  const percentage = getTierDiscount(tierName);
  const discount = (bookingAmount * percentage) / 100;
  const finalAmount = bookingAmount - discount;

  return {
    discount,
    finalAmount,
    percentage,
  };
}

/**
 * Simulate point transaction history
 * In production, this would come from backend
 */
export function generateMockTransactions(): PointTransaction[] {
  return [
    {
      id: "1",
      type: "earned",
      amount: 500,
      description: "Booking: Cairo & Giza 5-Day Tour",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      relatedBooking: "BOK-2024-001",
    },
    {
      id: "2",
      type: "earned",
      amount: 750,
      description: "Booking: Luxor Temple Adventure",
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      relatedBooking: "BOK-2024-002",
    },
    {
      id: "3",
      type: "bonus",
      amount: 250,
      description: "Birthday Bonus - Adventurer Tier",
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      type: "redeemed",
      amount: -200,
      description: "Redeemed: $2 discount on booking",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      relatedBooking: "BOK-2024-003",
    },
    {
      id: "5",
      type: "earned",
      amount: 300,
      description: "Booking: Red Sea Diving Experience",
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      relatedBooking: "BOK-2024-004",
    },
  ];
}

/**
 * Format points with commas
 */
export function formatPoints(points: number): string {
  return points.toLocaleString();
}

/**
 * Get tier progress percentage
 */
export function getTierProgress(currentPoints: number): number {
  const currentTier = getCurrentTier(currentPoints);
  const nextTier = getNextTier(currentPoints);

  if (!nextTier) {
    return 100; // Already at max tier
  }

  const tierStart = currentTier.minPoints;
  const tierEnd = nextTier.minPoints;
  const tierRange = tierEnd - tierStart;
  const pointsInTier = currentPoints - tierStart;

  return Math.min(100, Math.floor((pointsInTier / tierRange) * 100));
}

/**
 * Get mock loyalty data (replace with API call in production)
 */
export function getMockLoyaltyData(userId: number): LoyaltyPoints {
  const totalPoints = 1600;
  const currentTier = getCurrentTier(totalPoints);
  const pointsToNextTier = getPointsToNextTier(totalPoints);

  return {
    userId,
    totalPoints,
    currentTier: currentTier.name,
    pointsToNextTier: pointsToNextTier || 0,
    lifetimeSpent: 5200,
    bookingsCount: 8,
    earnedThisMonth: 350,
    history: generateMockTransactions(),
  };
}
