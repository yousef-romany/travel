import JsonLd from "./JsonLd";

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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholidays.com";
  const fullImageUrl = image.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": name,
    "@id": `${siteUrl}${url}#tour`,
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
      "url": `${siteUrl}${url}`,
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
    "touristDestination": {
      "@type": "TouristDestination",
      "name": location,
      "description": `Visit ${location} with ZoeHoliday`,
    },
    "aggregateRating": rating && reviewCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": Number(rating).toFixed(1),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": reviewCount.toString(),
    } : undefined,
  };

  return <JsonLd data={schema} />;
}
