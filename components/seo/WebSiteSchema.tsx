export default function WebSiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ZoeHoliday",
    "alternateName": "Zoe Holidays Egypt Tours",
    "url": baseUrl,
    "description": "Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure through our curated tour packages.",
    "publisher": {
      "@type": "Organization",
      "name": "ZoeHoliday",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/programs?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en",
    "copyrightYear": new Date().getFullYear(),
    "copyrightHolder": {
      "@type": "Organization",
      "name": "ZoeHoliday"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
