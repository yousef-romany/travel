export default function ServiceSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com";

  const services = [
    {
      "@type": "Service",
      "serviceType": "Egypt Tour Packages",
      "name": "Custom Egypt Tour Packages",
      "description": "Personalized Egypt tour packages tailored to your preferences, including historical sites, Nile cruises, and cultural experiences.",
      "provider": {
        "@type": "TravelAgency",
        "name": "ZoeHoliday"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Egypt"
      },
      "offers": {
        "@type": "Offer",
        "priceRange": "$$-$$$",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@type": "Service",
      "serviceType": "Nile River Cruise",
      "name": "Luxury Nile River Cruises",
      "description": "Experience Egypt from the water with our luxury Nile River cruises between Luxor and Aswan.",
      "provider": {
        "@type": "TravelAgency",
        "name": "ZoeHoliday"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "Luxor"
        },
        {
          "@type": "City",
          "name": "Aswan"
        }
      ]
    },
    {
      "@type": "Service",
      "serviceType": "Day Tours",
      "name": "Egypt Day Tours & Excursions",
      "description": "Guided day tours to Egypt's most iconic sites including the Pyramids of Giza, Egyptian Museum, and ancient temples.",
      "provider": {
        "@type": "TravelAgency",
        "name": "ZoeHoliday"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Egypt"
      }
    },
    {
      "@type": "Service",
      "serviceType": "Cultural Tours",
      "name": "Egyptian Cultural & Historical Tours",
      "description": "Immersive cultural experiences exploring 7,000 years of Egyptian history, monuments, and traditions.",
      "provider": {
        "@type": "TravelAgency",
        "name": "ZoeHoliday"
      }
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": services
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
