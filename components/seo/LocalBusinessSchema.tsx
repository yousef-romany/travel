/**
 * LocalBusiness Schema for SEO
 * Helps Google show ZoeHoliday in local search results and Google Maps
 */

export default function LocalBusinessSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#organization`,
    "name": "ZoeHoliday",
    "alternateName": "Zoe Holiday Egypt Tours",
    "description": "Leading travel agency offering authentic Egyptian tours, Nile cruises, pyramids visits, and Red Sea adventures. Expert guides, custom packages, 24/7 support.",
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
    "email": "info@zoeholiday.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Cairo, Egypt", // Add specific address
      "addressLocality": "Cairo",
      "addressRegion": "Cairo Governorate",
      "addressCountry": "EG",
      "postalCode": "11511",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.0444,
      "longitude": 31.2357,
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
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "250",
    },
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
