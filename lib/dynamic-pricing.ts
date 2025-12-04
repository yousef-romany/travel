// lib/dynamic-pricing.ts - Dynamic pricing engine for travel programs

export interface PricingRule {
  id: string;
  name: string;
  type: "seasonal" | "early-bird" | "last-minute" | "demand" | "special-event";
  adjustmentType: "percentage" | "fixed";
  adjustmentValue: number;
  startDate?: string;
  endDate?: string;
  daysBeforeDeparture?: number;
  conditions?: PricingCondition[];
  priority: number; // Higher priority rules are applied first
}

export interface PricingCondition {
  field: "availability" | "bookings" | "dayOfWeek" | "groupSize";
  operator: "lt" | "lte" | "gt" | "gte" | "eq";
  value: number | string;
}

export interface DynamicPrice {
  originalPrice: number;
  finalPrice: number;
  adjustments: PriceAdjustment[];
  savings: number;
  savingsPercentage: number;
}

export interface PriceAdjustment {
  ruleName: string;
  ruleType: string;
  amount: number;
  isIncrease: boolean;
}

/**
 * Default pricing rules
 */
export const DEFAULT_PRICING_RULES: PricingRule[] = [
  // Seasonal Pricing
  {
    id: "summer-peak",
    name: "Summer Peak Season",
    type: "seasonal",
    adjustmentType: "percentage",
    adjustmentValue: 20, // 20% increase
    startDate: "06-01", // June 1st
    endDate: "08-31", // August 31st
    priority: 10,
  },
  {
    id: "winter-discount",
    name: "Winter Off-Season Discount",
    type: "seasonal",
    adjustmentType: "percentage",
    adjustmentValue: -15, // 15% discount
    startDate: "01-01", // January 1st
    endDate: "02-28", // February 28th
    priority: 10,
  },
  {
    id: "spring-promo",
    name: "Spring Promotion",
    type: "seasonal",
    adjustmentType: "percentage",
    adjustmentValue: -10, // 10% discount
    startDate: "03-01", // March 1st
    endDate: "04-30", // April 30th
    priority: 10,
  },

  // Early Bird Discounts
  {
    id: "early-bird-90",
    name: "Early Bird 90+ Days",
    type: "early-bird",
    adjustmentType: "percentage",
    adjustmentValue: -20, // 20% discount
    daysBeforeDeparture: 90,
    priority: 20,
  },
  {
    id: "early-bird-60",
    name: "Early Bird 60+ Days",
    type: "early-bird",
    adjustmentType: "percentage",
    adjustmentValue: -15, // 15% discount
    daysBeforeDeparture: 60,
    priority: 19,
  },
  {
    id: "early-bird-30",
    name: "Early Bird 30+ Days",
    type: "early-bird",
    adjustmentType: "percentage",
    adjustmentValue: -10, // 10% discount
    daysBeforeDeparture: 30,
    priority: 18,
  },

  // Last Minute Deals
  {
    id: "last-minute-7",
    name: "Last Minute Deal (7 days)",
    type: "last-minute",
    adjustmentType: "percentage",
    adjustmentValue: -25, // 25% discount
    daysBeforeDeparture: 7,
    conditions: [
      {
        field: "availability",
        operator: "gt",
        value: 5, // At least 5 spots available
      },
    ],
    priority: 25,
  },
  {
    id: "last-minute-3",
    name: "Last Minute Deal (3 days)",
    type: "last-minute",
    adjustmentType: "percentage",
    adjustmentValue: -30, // 30% discount
    daysBeforeDeparture: 3,
    conditions: [
      {
        field: "availability",
        operator: "gt",
        value: 3,
      },
    ],
    priority: 26,
  },

  // Demand-Based Pricing
  {
    id: "high-demand",
    name: "High Demand Adjustment",
    type: "demand",
    adjustmentType: "percentage",
    adjustmentValue: 15, // 15% increase
    conditions: [
      {
        field: "availability",
        operator: "lte",
        value: 3, // 3 or fewer spots left
      },
    ],
    priority: 15,
  },
  {
    id: "low-availability",
    name: "Limited Availability",
    type: "demand",
    adjustmentType: "percentage",
    adjustmentValue: 10, // 10% increase
    conditions: [
      {
        field: "availability",
        operator: "lte",
        value: 5, // 5 or fewer spots left
      },
    ],
    priority: 14,
  },

  // Special Events
  {
    id: "ramadan-special",
    name: "Ramadan Special Pricing",
    type: "special-event",
    adjustmentType: "percentage",
    adjustmentValue: -12, // 12% discount
    startDate: "03-10", // Approximate, varies by year
    endDate: "04-10",
    priority: 12,
  },
  {
    id: "black-friday",
    name: "Black Friday Sale",
    type: "special-event",
    adjustmentType: "percentage",
    adjustmentValue: -30, // 30% discount
    startDate: "11-24",
    endDate: "11-27",
    priority: 30,
  },
];

/**
 * Calculate dynamic price based on rules
 */
export function calculateDynamicPrice(
  basePrice: number,
  departureDate: Date,
  availableSpots: number,
  totalSpots: number,
  customRules?: PricingRule[]
): DynamicPrice {
  const rules = customRules || DEFAULT_PRICING_RULES;
  const adjustments: PriceAdjustment[] = [];
  let currentPrice = basePrice;

  // Sort rules by priority (highest first)
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  const now = new Date();
  const daysUntilDeparture = Math.ceil(
    (departureDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  for (const rule of sortedRules) {
    if (isRuleApplicable(rule, now, departureDate, daysUntilDeparture, availableSpots)) {
      const adjustment = calculateAdjustment(currentPrice, rule);

      // Only apply if there's an actual adjustment
      if (adjustment !== 0) {
        adjustments.push({
          ruleName: rule.name,
          ruleType: rule.type,
          amount: Math.abs(adjustment),
          isIncrease: adjustment > 0,
        });

        currentPrice += adjustment;
      }

      // For certain rule types, stop after first match
      if (rule.type === "early-bird" || rule.type === "last-minute") {
        break; // Only apply one early-bird or last-minute rule
      }
    }
  }

  // Ensure price doesn't go below minimum (e.g., 50% of original)
  const minimumPrice = basePrice * 0.5;
  currentPrice = Math.max(currentPrice, minimumPrice);

  // Round to 2 decimal places
  currentPrice = Math.round(currentPrice * 100) / 100;

  const savings = basePrice - currentPrice;
  const savingsPercentage = Math.round((savings / basePrice) * 100);

  return {
    originalPrice: basePrice,
    finalPrice: currentPrice,
    adjustments,
    savings,
    savingsPercentage,
  };
}

/**
 * Check if a pricing rule is applicable
 */
function isRuleApplicable(
  rule: PricingRule,
  currentDate: Date,
  departureDate: Date,
  daysUntilDeparture: number,
  availableSpots: number
): boolean {
  // Check seasonal rules
  if (rule.startDate && rule.endDate) {
    const currentMonthDay = `${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(
      currentDate.getDate()
    ).padStart(2, "0")}`;

    if (currentMonthDay < rule.startDate || currentMonthDay > rule.endDate) {
      return false;
    }
  }

  // Check days before departure rules
  if (rule.daysBeforeDeparture !== undefined) {
    if (rule.type === "early-bird") {
      if (daysUntilDeparture < rule.daysBeforeDeparture) {
        return false;
      }
    } else if (rule.type === "last-minute") {
      if (daysUntilDeparture > rule.daysBeforeDeparture) {
        return false;
      }
    }
  }

  // Check conditions
  if (rule.conditions) {
    for (const condition of rule.conditions) {
      if (!evaluateCondition(condition, availableSpots)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Evaluate a pricing condition
 */
function evaluateCondition(condition: PricingCondition, availableSpots: number): boolean {
  const value = condition.field === "availability" ? availableSpots : 0;

  switch (condition.operator) {
    case "lt":
      return value < (condition.value as number);
    case "lte":
      return value <= (condition.value as number);
    case "gt":
      return value > (condition.value as number);
    case "gte":
      return value >= (condition.value as number);
    case "eq":
      return value === condition.value;
    default:
      return false;
  }
}

/**
 * Calculate the adjustment amount
 */
function calculateAdjustment(currentPrice: number, rule: PricingRule): number {
  if (rule.adjustmentType === "percentage") {
    return (currentPrice * rule.adjustmentValue) / 100;
  } else {
    return rule.adjustmentValue;
  }
}

/**
 * Get applicable badges/labels for display
 */
export function getPricingBadges(dynamicPrice: DynamicPrice): string[] {
  const badges: string[] = [];

  for (const adjustment of dynamicPrice.adjustments) {
    if (!adjustment.isIncrease) {
      // Only show discount badges
      switch (adjustment.ruleType) {
        case "early-bird":
          badges.push("Early Bird");
          break;
        case "last-minute":
          badges.push("Last Minute Deal");
          break;
        case "seasonal":
          badges.push("Seasonal Discount");
          break;
        case "special-event":
          badges.push("Special Offer");
          break;
      }
    }
  }

  if (dynamicPrice.savingsPercentage >= 20) {
    badges.push(`Save ${dynamicPrice.savingsPercentage}%`);
  }

  return [...new Set(badges)]; // Remove duplicates
}

/**
 * Format price with savings
 */
export function formatPriceWithSavings(dynamicPrice: DynamicPrice): {
  display: string;
  hasDiscount: boolean;
} {
  if (dynamicPrice.savings > 0) {
    return {
      display: `$${dynamicPrice.finalPrice.toFixed(2)}`,
      hasDiscount: true,
    };
  }

  return {
    display: `$${dynamicPrice.originalPrice.toFixed(2)}`,
    hasDiscount: false,
  };
}

/**
 * Get urgency message based on pricing
 */
export function getUrgencyMessage(
  dynamicPrice: DynamicPrice,
  availableSpots: number
): string | null {
  // Check for last-minute deals
  const hasLastMinute = dynamicPrice.adjustments.some((a) => a.ruleType === "last-minute");
  if (hasLastMinute) {
    return "Last minute deal - Book now before it's gone!";
  }

  // Check for high demand
  const hasHighDemand = dynamicPrice.adjustments.some(
    (a) => a.ruleType === "demand" && a.isIncrease
  );
  if (hasHighDemand) {
    return `Only ${availableSpots} spots left at this price!`;
  }

  // Check for early bird expiring
  const hasEarlyBird = dynamicPrice.adjustments.some((a) => a.ruleType === "early-bird");
  if (hasEarlyBird && dynamicPrice.savingsPercentage >= 15) {
    return "Early bird discount available - Book soon!";
  }

  return null;
}
