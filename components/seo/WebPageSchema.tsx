/**
 * Enhanced WebPage Schema with Speakable Content
 * Optimized for voice search and smart assistants (Google Assistant, Alexa, Siri)
 */

interface WebPageSchemaProps {
  name: string;
  description: string;
  url?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
  breadcrumb?: {
    name: string;
    url: string;
  }[];
  speakable?: {
    cssSelector?: string[];
    xpath?: string[];
  };
  inLanguage?: string;
  keywords?: string[];
}

export default function WebPageSchema({
  name,
  description,
  url = "/",
  image,
  datePublished,
  dateModified,
  author = { name: 'ZoeHoliday', url: 'https://zoeholiday.com' },
  breadcrumb,
  speakable,
  inLanguage = 'en-US',
  keywords,
}: WebPageSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com";
  const fullUrl = `${siteUrl}${url}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": name,
    "description": description,
    "url": fullUrl,
    ...(image && { "image": image }),
    ...(datePublished && { "datePublished": datePublished }),
    ...(dateModified && { "dateModified": dateModified }),
    "inLanguage": inLanguage,
    "author": {
      "@type": "Organization",
      "name": author.name,
      ...(author.url && { "url": author.url }),
    },
    "publisher": {
      "@type": "TravelAgency",
      "name": "ZoeHoliday",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/icons/icon-512x512.png`,
      },
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "ZoeHoliday",
      "url": siteUrl
    },
    ...(breadcrumb && {
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumb.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `${siteUrl}${item.url}`,
        })),
      },
    }),
    ...(speakable && {
      "speakable": {
        "@type": "SpeakableSpecification",
        ...(speakable.cssSelector && { "cssSelector": speakable.cssSelector }),
        ...(speakable.xpath && { "xpath": speakable.xpath }),
      },
    }),
    ...(keywords && { "keywords": keywords.join(', ') }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
