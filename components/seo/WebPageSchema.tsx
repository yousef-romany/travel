interface WebPageSchemaProps {
  name: string;
  description: string;
  url?: string;
}

export default function WebPageSchema({ name, description, url = "/" }: WebPageSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": name,
    "description": description,
    "url": `${siteUrl}${url}`,
    "publisher": {
      "@type": "TravelAgency",
      "name": "ZoeHoliday",
      "url": siteUrl
    },
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "ZoeHoliday",
      "url": siteUrl
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
