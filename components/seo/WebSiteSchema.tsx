import JsonLd from "./JsonLd";
import { SITE_URL } from "@/lib/seo-config";

export default function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ZoeHoliday",
    "alternateName": "Zoe Holidays Egypt Tours",
    "@id": `${SITE_URL}/#website`,
    "url": SITE_URL,
    "description": "Discover the magic of Egypt with zoeholidays. Experience 7,000 years of history, culture, and adventure through our curated tour packages.",
    "publisher": {
      "@id": `${SITE_URL}/#organization`,
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/programs?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en",
    "copyrightYear": new Date().getFullYear(),
    "copyrightHolder": {
      "@id": `${SITE_URL}/#organization`,
    }
  };

  return <JsonLd data={schema} id="website-schema" />;
}
