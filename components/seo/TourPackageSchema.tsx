interface TourPackageSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  duration: number;
  location: string;
  rating?: number;
  reviewCount?: number;
  url: string;
}

export default function TourPackageSchema({
  name,
  description,
  image,
  price,
  duration,
  location,
  rating = 5,
  reviewCount = 0,
  url,
}: TourPackageSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com";
  const fullImageUrl = image.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": name,
    "description": description,
    "image": fullImageUrl,
    "url": `${siteUrl}${url}`,
    "provider": {
      "@type": "TravelAgency",
      "name": "ZoeHoliday",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`,
      },
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "url": `${siteUrl}${url}`,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    },
    "itinerary": {
      "@type": "ItemList",
      "name": `${name} Itinerary`,
      "description": `${duration} ${duration === 1 ? 'day' : 'days'} tour in ${location}`,
      "numberOfItems": duration,
    },
    "duration": `P${duration}D`, // ISO 8601 duration format
    "touristType": [
      "Family",
      "Individual",
      "Group"
    ],
    "subjectOf": {
      "@type": "TouristDestination",
      "name": location,
      "description": `Visit ${location} with ZoeHoliday`,
      "geo": {
        "@type": "GeoCoordinates",
        "addressCountry": "EG",
      },
    },
    "aggregateRating": rating && reviewCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": rating.toFixed(1),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": reviewCount.toString(),
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
