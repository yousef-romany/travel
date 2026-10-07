"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPricingSettings } from "@/fetch/pricing-settings";
import { DEFAULT_PRICE_TIERS, type GroupTier, type TierSource } from "@/lib/tiered-pricing";

export interface GroupPricing {
  tiers: GroupTier[];
  source: TierSource;
}

/**
 * Resolve the group pricing tiers that apply to a program, using the same
 * precedence the server uses: the program's own tiers -> the global pricing
 * settings singleton -> the built-in defaults.
 *
 * `programTiers` must come from a program fetched with `populate[group_tiers]`,
 * otherwise a per-program override would be silently ignored and the price
 * shown here would not match what the server validates at payment time.
 */
export function useGroupTiers(programTiers?: GroupTier[] | null): GroupPricing {
  const hasProgramTiers = Array.isArray(programTiers) && programTiers.length > 0;

  const { data: globalTiers } = useQuery({
    queryKey: ["pricing-settings"],
    queryFn: fetchPricingSettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !hasProgramTiers,
  });

  if (hasProgramTiers) {
    return { tiers: programTiers as GroupTier[], source: "program" };
  }

  if (Array.isArray(globalTiers) && globalTiers.length > 0) {
    return { tiers: globalTiers, source: "global" };
  }

  return { tiers: DEFAULT_PRICE_TIERS, source: "default" };
}
