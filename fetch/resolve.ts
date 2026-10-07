import axios from "axios";
import type { AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.zoeholidays.com";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_TOKEN}`,
};

/**
 * Resolve one entry of a collection where the URL carries its slug, falling
 * back to a legacy text field (`categoryName`, `title`, ...) so every URL that
 * was published before slugs existed keeps resolving.
 *
 * The slug lookup is best-effort: a backend that has not been redeployed with
 * the `slug` field answers `400 Invalid key slug`, which must not break the
 * page — we simply fall through to the legacy filter, whose errors still
 * propagate exactly as they did before.
 *
 * Returns the raw Strapi `{ data, meta }` payload, or `{ data: [] }`.
 * The payload type is left to the caller (defaults to `any`) because the
 * shape differs per collection and the pages already declare it themselves.
 */
export async function resolveBySlugThenField<TResult = any>(options: {
  collection: string;
  query: string;
  legacyField: string;
  populate: string;
}): Promise<TResult> {
  const { collection, query, legacyField, populate } = options;
  const queryBase = populate.startsWith("&") ? populate.slice(1) : populate;
  const base = `${API_URL}/api/${collection}?${queryBase}`;
  const encodedQuery = encodeURIComponent(query);

  try {
    const bySlug: AxiosResponse = await axios.get(
      `${base}&filters[slug][$eq]=${encodedQuery}`,
      { headers }
    );
    if (bySlug.data?.data?.length > 0) {
      return bySlug.data;
    }
  } catch {
    // slug key unavailable - fall back
  }

  const byLegacy: AxiosResponse = await axios.get(
    `${base}&filters[${legacyField}][$eq]=${encodedQuery}`,
    { headers }
  );
  return byLegacy.data ?? { data: [] };
}
