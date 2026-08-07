// lib/tiered-pricing.ts
//
// Global dynamic per-person pricing rule.
//
// The price per person drops as the group grows. Each tier defines a
// percentage discount off the program's base price per person, e.g.:
//   base $1000 -> 1 person $1000 each, 2 people $950 each, 3 people $920 each
//
// Edit DEFAULT_PRICE_TIERS below to change the rule for every program.

export interface PriceTier {
  minTravelers: number;
  maxTravelers: number;
  discountPercent: number;
  description: string;
}

export interface TieredPrice {
  tier: PriceTier;
  basePricePerPerson: number;
  discountPerPerson: number;
  pricePerPerson: number;
  baseTotal: number;
  total: number;
  savings: number;
}

export const DEFAULT_PRICE_TIERS: PriceTier[] = [
  { minTravelers: 1, maxTravelers: 1, discountPercent: 0, description: "Single traveler" },
  { minTravelers: 2, maxTravelers: 3, discountPercent: 5, description: "Small group" },
  { minTravelers: 4, maxTravelers: 6, discountPercent: 8, description: "Standard group" },
  { minTravelers: 7, maxTravelers: 9, discountPercent: 10, description: "Large group" },
  { minTravelers: 10, maxTravelers: 15, discountPercent: 12, description: "Big group" },
  { minTravelers: 16, maxTravelers: Infinity, discountPercent: 15, description: "Mega group" },
];

export function getPriceTier(
  numberOfTravelers: number,
  tiers: PriceTier[] = DEFAULT_PRICE_TIERS
): PriceTier {
  return (
    tiers.find(
      (tier) =>
        numberOfTravelers >= tier.minTravelers &&
        numberOfTravelers <= tier.maxTravelers
    ) || tiers[0]
  );
}

export function getTieredPrice(
  numberOfTravelers: number,
  basePrice: number,
  tiers: PriceTier[] = DEFAULT_PRICE_TIERS
): TieredPrice {
  const tier = getPriceTier(numberOfTravelers, tiers);
  const basePricePerPerson = basePrice;
  const discountPerPerson = (basePrice * tier.discountPercent) / 100;
  const pricePerPerson = basePrice - discountPerPerson;
  const baseTotal = basePrice * numberOfTravelers;
  const total = pricePerPerson * numberOfTravelers;

  return {
    tier,
    basePricePerPerson,
    discountPerPerson,
    pricePerPerson,
    baseTotal,
    total,
    savings: baseTotal - total,
  };
}

export function getPriceTiers(tiers: PriceTier[] = DEFAULT_PRICE_TIERS): PriceTier[] {
  return tiers;
}

export function getNextPriceTier(
  currentTravelers: number,
  tiers: PriceTier[] = DEFAULT_PRICE_TIERS
): PriceTier | null {
  return tiers.find((tier) => currentTravelers < tier.minTravelers) || null;
}
