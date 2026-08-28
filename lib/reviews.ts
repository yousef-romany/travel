import { cache } from "react";
import { fetchApprovedTestimonials } from "@/fetch/testimonials";

export interface SiteAggregateRating {
  ratingValue: number;
  ratingCount: number;
  bestRating: number;
  worstRating: number;
}

export interface SiteReview {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished?: string;
  sourceUrl?: string;
}

export interface SiteReviews {
  aggregate: SiteAggregateRating | null;
  reviews: SiteReview[];
}

/**
 * Fetch approved testimonials and derive a real site-wide aggregate rating plus
 * a small set of representative reviews for structured-data markup.
 * Deduped within a single render pass via React.cache.
 *
 * When NEXT_PUBLIC_GOOGLE_RATING / NEXT_PUBLIC_GOOGLE_REVIEW_COUNT are set
 * (written by `scripts/fetch-google-reviews.js --write`), the Google Business
 * Profile data is used as the authoritative aggregate rating.
 */
export const getSiteReviews = cache(async (): Promise<SiteReviews> => {
  try {
    const response = await fetchApprovedTestimonials(1000);
    const withRating = (response?.data ?? []).filter((t) => t.rating > 0);

    const googleRating = parseFloat(
      process.env.NEXT_PUBLIC_GOOGLE_RATING || ""
    );
    const googleCount = parseInt(
      process.env.NEXT_PUBLIC_GOOGLE_REVIEW_COUNT || "",
      10
    );

    let aggregate: SiteAggregateRating | null = null;

    if (!isNaN(googleRating) && !isNaN(googleCount) && googleCount > 0) {
      aggregate = {
        ratingValue: Number(googleRating.toFixed(1)),
        ratingCount: googleCount,
        bestRating: 5,
        worstRating: 1,
      };
    } else if (withRating.length > 0) {
      const sum = withRating.reduce((acc, t) => acc + t.rating, 0);
      aggregate = {
        ratingValue: Math.round((sum / withRating.length) * 10) / 10,
        ratingCount:
          response?.meta?.pagination?.total ?? withRating.length,
        bestRating: 5,
        worstRating: 1,
      };
    }

    const reviews: SiteReview[] = withRating
      .slice(0, 5)
      .map((t) => ({
        author:
          t.reviewerName ||
          t.user?.profile?.firstName ||
          t.user?.username ||
          "Anonymous",
        rating: t.rating,
        reviewBody: t.comment,
        datePublished: t.reviewDate || t.createdAt,
        sourceUrl: t.externalReviewUrl,
      }));

    return { aggregate, reviews };
  } catch (error) {
    console.error("Error computing site reviews:", error);
    return { aggregate: null, reviews: [] };
  }
});

/** Convenience wrapper returning only the aggregate rating. */
export const getSiteAggregateRating = cache(
  async (): Promise<SiteAggregateRating | null> => {
    const { aggregate } = await getSiteReviews();
    return aggregate;
  }
);
