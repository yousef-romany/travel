interface Review {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished?: string;
  reviewTitle?: string;
}

interface ReviewSchemaProps {
  itemName: string;
  itemType?: "TouristTrip" | "Product" | "Service" | "LocalBusiness";
  reviews: Review[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  itemUrl?: string;
  itemImage?: string;
}

export default function ReviewSchema({
  itemName,
  itemType = "TouristTrip",
  reviews,
  aggregateRating,
  itemUrl,
  itemImage,
}: ReviewSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": itemType,
    "name": itemName,
    ...(itemUrl && { "url": itemUrl }),
    ...(itemImage && { "image": itemImage }),
    ...(aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": aggregateRating.ratingValue.toFixed(1),
        "reviewCount": aggregateRating.reviewCount,
        "bestRating": aggregateRating.bestRating || 5,
        "worstRating": aggregateRating.worstRating || 1,
      },
    }),
    "review": reviews.map((review) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author,
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1,
      },
      "reviewBody": review.reviewBody,
      ...(review.datePublished && { "datePublished": review.datePublished }),
      ...(review.reviewTitle && { "name": review.reviewTitle }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
