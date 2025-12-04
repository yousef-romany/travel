export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "ZoeHoliday",
    "description": "Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com"}/logo.png`,
    "image": `${process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com"}/og-image.jpg`,
    "telephone": "+20-1555-100-961",
    "email": "yousefromany527@example.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "EG",
      "addressLocality": "Cairo",
      "addressRegion": "Cairo",
    },
    "sameAs": [
      "https://www.instagram.com/yourprofile",
      "https://www.linkedin.com/in/yousef-romany-09a2a5233/",
      "https://github.com/yousef-romany"
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
