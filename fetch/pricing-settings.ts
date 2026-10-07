// fetch/pricing-settings.ts
//
// Public read of the global default group pricing tiers
// (`api::pricing-settings.pricing-settings`, a singleton).
//
// Used only when a program does not define its own `group_tiers`, so it is
// fetched lazily and cached for the whole session.

import axios from "axios";
import type { GroupTier } from "@/lib/tiered-pricing";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export interface PricingSettingsResponse {
  data: { group_tiers?: GroupTier[] } | null;
  meta?: Record<string, unknown>;
}

/**
 * Fetch the global default group tiers.
 * Resolves to `null` when the admin has never saved pricing settings, in which
 * case callers fall back to the built-in defaults.
 */
export const fetchPricingSettings = async (): Promise<GroupTier[] | null> => {
  try {
    const response = await axios.get<PricingSettingsResponse>(`${API_URL}/api/pricing-settings`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      timeout: 10000,
    });

    const tiers = response.data?.data?.group_tiers;
    return Array.isArray(tiers) && tiers.length > 0 ? tiers : null;
  } catch {
    // The endpoint is additive — an older backend without it must not break
    // booking, so fall back to the built-in tiers instead of throwing.
    return null;
  }
};
