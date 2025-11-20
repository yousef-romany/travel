interface TourPackageSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  duration: number;
  location: string;
  rating?: number;
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
      "url": siteUrl
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "url": `${siteUrl}${url}`
    },
    "itinerary": {
      "@type": "ItemList",
      "name": `${name} Itinerary`,
      "description": `${duration} days tour in ${location}`
    },
    "touristType": [
      "Family",
      "Individual",
      "Group"
    ],
    "subjectOf": {
      "@type": "TouristDestination",
      "name": location,
      "description": `Visit ${location} with ZoeHoliday`
    },
    "aggregateRating": rating ? {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "1"
    } : undefined
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
