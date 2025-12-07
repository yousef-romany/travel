export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "ZoeHoliday",
    "description": "Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com"}/logo.png`,
    "image": `${process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com"}/og-image.jpg`,
    "telephone": "+20-100-000-0000", // Updated placeholder, should be real if available
    "email": "info@zoeholiday.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "EG",
      "addressLocality": "Cairo",
      "addressRegion": "Cairo",
    },
    "sameAs": [
      "https://www.instagram.com/zoeholiday",
      "https://www.facebook.com/zoeholiday",
      "https://twitter.com/zoeholiday"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Egypt"
    },
    "priceRange": "$$"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
