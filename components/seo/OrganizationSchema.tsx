export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness", "Organization"],
    "name": "ZoeHoliday",
    "alternateName": "Zoe Holidays Egypt Tours",
    "description": "Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure. Premium Egypt tour packages, Nile cruises, and cultural experiences.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com",
    "logo": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com"}/logo.png`,
      "width": 250,
      "height": 60
    },
    "image": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com"}/og-image.jpg`,
      "width": 1200,
      "height": 630
    },
    "telephone": "+20-100-000-0000",
    "email": "info@zoeholiday.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Cairo, Egypt",
      "addressLocality": "Cairo",
      "addressRegion": "Cairo Governorate",
      "addressCountry": "EG",
      "postalCode": "11511"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.0444,
      "longitude": 31.2357
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/zoeholiday",
      "https://www.facebook.com/zoeholiday",
      "https://twitter.com/zoeholiday"
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "Egypt"
      },
      {
        "@type": "City",
        "name": "Cairo"
      },
      {
        "@type": "City",
        "name": "Luxor"
      },
      {
        "@type": "City",
        "name": "Aswan"
      },
      {
        "@type": "City",
        "name": "Alexandria"
      }
    ],
    "priceRange": "$$-$$$",
    "paymentAccepted": "Cash, Credit Card, Debit Card, Bank Transfer",
    "currenciesAccepted": "USD, EUR, EGP",
    "knowsLanguage": ["en", "ar", "fr", "de", "es"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Egypt Tour Packages",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Cultural Tours",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "TouristTrip",
                "name": "Egypt Cultural & Historical Tours"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Nile Cruises",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "TouristTrip",
                "name": "Luxury Nile River Cruises"
              }
            }
          ]
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
