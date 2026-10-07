// lib/tiered-pricing.ts
//
// Client-side group pricing.
//
// The rules in this file MUST stay identical to
// `travel-backend/src/utils/group-pricing.ts`: the server re-computes the total
// at `validate-price` / `verify-payment` time and rejects payments that drift
// more than 5% from what it calculated. When in doubt, change both files
// together.
//
// Tier precedence: the program's own tiers -> the global pricing settings
// singleton (`GET /api/pricing-settings`) -> DEFAULT_PRICE_TIERS below.
//
// Per tier:
//   groupTotalPrice set  -> flat total for the whole group (wins over everything)
//   otherwise            -> pricePerPerson ?? base price, then discountPercent
//                           applied, multiplied by the number of travelers.

export interface GroupTier {
  label?: string | null;
  minTravelers: number;
  maxTravelers?: number | null;
  pricePerPerson?: number | null;
  groupTotalPrice?: number | null;
  discountPercent?: number | null;
}

export type TierSource = "program" | "global" | "default";

export interface TieredPrice {
  /** Travelers the price was resolved for (always >= 1). */
  numberOfTravelers: number;
  /** Catalog price per person before any tier adjustments. */
  basePricePerPerson: number;
  /** Effective per-person rate (total / travelers for flat tiers). */
  pricePerPerson: number;
  /** Undiscounted total: basePricePerPerson * travelers. */
  baseTotal: number;
  /** Total for the whole booking. */
  total: number;
  /** Amount saved against the undiscounted total, never negative. */
  savings: number;
  /** The tier that applied, or null when nothing covers this group size. */
  tier: GroupTier | null;
  /** Display label for the applied tier, safe to render as-is. */
  tierLabel: string;
  /** Percent discount the tier granted, when it is a percent-off tier. */
  discountPercent: number | null;
  /** True when the tier supplied a flat group total. */
  flat: boolean;
  /** Where the tiers came from. */
  source: TierSource;
}

/**
 * Built-in fallback, kept byte-for-byte identical to `DEFAULT_GROUP_TIERS` on
 * the server so that deploying either half alone changes no prices.
 *
 * These are only used while the admin has saved no global pricing settings
 * and the program defines no tiers of its own.
 */
export const DEFAULT_PRICE_TIERS: GroupTier[] = [
  { label: "Single traveler", minTravelers: 1, maxTravelers: 1, discountPercent: 0 },
  { label: "Small group", minTravelers: 2, maxTravelers: 3, discountPercent: 5 },
  { label: "Standard group", minTravelers: 4, maxTravelers: 6, discountPercent: 8 },
  { label: "Large group", minTravelers: 7, maxTravelers: 9, discountPercent: 10 },
  { label: "Big group", minTravelers: 10, maxTravelers: 15, discountPercent: 12 },
  { label: "Mega group", minTravelers: 16, maxTravelers: null, discountPercent: 15 },
];

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

/**
 * Pick the first tier whose [minTravelers, maxTravelers] range covers the group.
 * `maxTravelers` of null/undefined/0 means "no upper limit".
 * Tiers are sorted by minTravelers so overlapping ranges resolve
 * deterministically.
 */
export function pickTier(
  tiers: GroupTier[] | null | undefined,
  numberOfTravelers: number
): GroupTier | null {
  if (!Array.isArray(tiers) || tiers.length === 0) return null;
  if (!Number.isFinite(numberOfTravelers) || numberOfTravelers < 1) return null;

  const sorted = [...tiers].sort((a, b) => (a.minTravelers || 1) - (b.minTravelers || 1));

  for (const tier of sorted) {
    const min = toNumber(tier.minTravelers) ?? 1;
    const max = toNumber(tier.maxTravelers);
    if (numberOfTravelers < min) continue;
    if (max !== null && max > 0 && numberOfTravelers > max) continue;
    return tier;
  }

  return null;
}

/**
 * Resolve the price for a group size against a set of tiers.
 * Always returns a price — falls back to `basePrice * numberOfTravelers`
 * when no tier applies.
 */
export function resolveTieredPrice(
  basePrice: number,
  tiers: GroupTier[] | null | undefined,
  numberOfTravelers: number,
  source: TierSource = "default"
): TieredPrice {
  const base = Math.max(toNumber(basePrice) ?? 0, 0);
  const travelers = Math.max(Math.floor(toNumber(numberOfTravelers) || 1), 1);
  const tier = pickTier(tiers, travelers);

  const baseTotal = base * travelers;
  let pricePerPerson = base;
  let total = baseTotal;
  let flat = false;

  if (tier) {
    const flatTotal = toNumber(tier.groupTotalPrice);
    if (flatTotal !== null && flatTotal >= 0) {
      // Flat group price wins — it does not scale with headcount.
      flat = true;
      total = round2(flatTotal);
      pricePerPerson = round2(total / travelers);
    } else {
      const tierPerPerson = toNumber(tier.pricePerPerson);
      pricePerPerson = tierPerPerson !== null && tierPerPerson >= 0 ? tierPerPerson : base;

      const discountPercent = toNumber(tier.discountPercent);
      if (discountPercent !== null && discountPercent > 0) {
        pricePerPerson = pricePerPerson * (1 - Math.min(discountPercent, 100) / 100);
      }

      pricePerPerson = round2(pricePerPerson);
      total = round2(pricePerPerson * travelers);
    }
  }

  return {
    numberOfTravelers: travelers,
    basePricePerPerson: round2(base),
    pricePerPerson,
    baseTotal: round2(baseTotal),
    total,
    savings: round2(Math.max(baseTotal - total, 0)),
    tier,
    tierLabel: tier?.label?.trim() || "Group discount",
    discountPercent: tier ? toNumber(tier.discountPercent) : null,
    flat,
    source,
  };
}

/**
 * Backwards-compatible wrapper kept for existing call sites.
 * Prefer `resolveTieredPrice` when you also need `source` / `flat`.
 */
export function getTieredPrice(
  numberOfTravelers: number,
  basePrice: number,
  tiers: GroupTier[] | null | undefined = DEFAULT_PRICE_TIERS,
  source: TierSource = "default"
): TieredPrice {
  return resolveTieredPrice(basePrice, tiers, numberOfTravelers, source);
}

/** The tier that applies to `numberOfTravelers`, or null when none does. */
export function getPriceTier(
  numberOfTravelers: number,
  tiers: GroupTier[] | null | undefined = DEFAULT_PRICE_TIERS
): GroupTier | null {
  return pickTier(tiers, numberOfTravelers);
}

export function getPriceTiers(
  tiers: GroupTier[] | null | undefined = DEFAULT_PRICE_TIERS
): GroupTier[] {
  return Array.isArray(tiers) && tiers.length > 0 ? tiers : DEFAULT_PRICE_TIERS;
}

/**
 * The next tier the group could reach, used for "add N more travelers"
 * upgrade hints. Returns null when the current group already sits in the
 * last tier.
 */
export function getNextPriceTier(
  currentTravelers: number,
  tiers: GroupTier[] | null | undefined = DEFAULT_PRICE_TIERS
): GroupTier | null {
  const list = getPriceTiers(tiers);
  return list.find((tier) => currentTravelers < (toNumber(tier.minTravelers) ?? 1)) || null;
}
