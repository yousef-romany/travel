/**
 * LocalBusiness Schema for SEO
 * Helps Google show ZoeHoliday in local search results and Google Maps
 */

import { getSiteReviews } from "@/lib/reviews";

export default async function LocalBusinessSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholidays.com";
  const { aggregate, reviews } = await getSiteReviews();

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#organization`,
    "name": "ZoeHoliday",
    "alternateName": "Zoe Holiday Egypt Tours",
    "description": "Premium family-run travel agency with 40+ years of experience offering authentic Egyptian tours, luxury Nile cruises, and private pyramids visits. Expert local guides and personal service based in Luxor.",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/logo.png`,
      "width": 512,
      "height": 512,
    },
    "image": [
      `${siteUrl}/logo.png`,
      "https://res.cloudinary.com/dir8ao2mt/image/upload/v1764631854/__1_l2obyo.jpg",
    ],
    "telephone": "+20-100-000-0000", // Replace with actual phone
    "email": "info@zoeholidays.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Luxor, Egypt",
      "addressLocality": "Luxor",
      "addressRegion": "Luxor Governorate",
      "addressCountry": "EG",
      "postalCode": "85951",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.6872,
      "longitude": 32.6396,
    },
    "areaServed": {
      "@type": "Country",
      "name": "Egypt",
    },
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59",
      },
    ],
    "sameAs": [
      "https://www.facebook.com/zoeholiday",
      "https://www.instagram.com/zoeholiday",
      "https://www.twitter.com/zoeholiday",
      "https://www.linkedin.com/company/zoeholiday",
      ...(process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL
        ? [process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL]
        : []),
      ...(process.env.NEXT_PUBLIC_TRUSTPILOT_URL
        ? [process.env.NEXT_PUBLIC_TRUSTPILOT_URL]
        : []),
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Egypt Tour Packages",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Pyramids Tours",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Giza Pyramids Day Tour",
              },
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          "name": "Nile Cruises",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Luxury Nile Cruise Luxor to Aswan",
              },
            },
          ],
        },
      ],
    },
  };

  if (aggregate) {
    schema["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": aggregate.ratingValue.toFixed(1),
      "bestRating": String(aggregate.bestRating),
      "worstRating": String(aggregate.worstRating),
      "ratingCount": String(aggregate.ratingCount),
    };
  }

  if (reviews.length > 0) {
    schema["review"] = reviews.map((review) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author,
        ...(review.sourceUrl && { "sameAs": review.sourceUrl }),
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1,
      },
      "reviewBody": review.reviewBody,
      ...(review.datePublished && { "datePublished": review.datePublished }),
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
