import { Metadata } from "next";

const SITE_NAME = "ZoeHoliday";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com";
const DEFAULT_OG_IMAGE = "https://res.cloudinary.com/dir8ao2mt/image/upload/v1764631854/__1_l2obyo.jpg";

/**
 * Generate canonical URL for a given path
 */
export function getCanonicalUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  // Remove trailing slash unless it's the root
  const finalPath = cleanPath && cleanPath.endsWith("/")
    ? cleanPath.slice(0, -1)
    : cleanPath;

  return `${SITE_URL}${finalPath ? `/${finalPath}` : ""}`;
}

/**
 * Generate SEO-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Truncate text to a specific length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Generate meta description from content
 */
export function generateMetaDescription(
  content: string,
  maxLength: number = 160
): string {
  // Strip HTML tags
  const strippedContent = content.replace(/<[^>]*>/g, "");
  // Normalize whitespace
  const normalizedContent = strippedContent.replace(/\s+/g, " ").trim();
  // Truncate to maxLength
  return truncateText(normalizedContent, maxLength);
}

/**
 * Extract keywords from text
 */
export function extractKeywords(
  text: string,
  additionalKeywords: string[] = []
): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "can", "this", "that", "these", "those"
  ]);

  // Extract words from text
  const words = text
    .toLowerCase()
    .replace(/<[^>]*>/g, "") // Remove HTML
    .replace(/[^\w\s]/g, " ") // Replace special chars with space
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Get unique words
  const uniqueWords = Array.from(new Set(words));

  // Combine with additional keywords
  return [...new Set([...additionalKeywords, ...uniqueWords])];
}

/**
 * Generate Open Graph image URL
 */
export function getOgImageUrl(
  imagePath?: string | null,
  fallback: string = DEFAULT_OG_IMAGE
): string {
  if (!imagePath) return fallback;

  // If it's already a full URL, return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a Strapi upload path, prepend the Strapi URL
  if (imagePath.startsWith("/uploads/")) {
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${imagePath}`;
  }

  // Otherwise, prepend the site URL
  return `${SITE_URL}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

/**
 * Generate structured metadata for a page
 */
export interface GenerateMetadataParams {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  author,
}: GenerateMetadataParams): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const ogImage = getOgImageUrl(image);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : [{ name: SITE_NAME }],
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: SITE_NAME,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: "@zoeholiday",
      site: "@zoeholiday",
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Generate metadata for tour programs
 */
export function generateTourMetadata({
  title,
  description,
  location,
  duration,
  price,
  image,
  documentId,
  updatedAt,
}: {
  title: string;
  description?: string | null;
  location: string;
  duration: number;
  price: number;
  image?: string | null;
  documentId: string;
  updatedAt?: string;
}): Metadata {
  const metaDescription = description
    ? generateMetaDescription(description)
    : `Discover ${title} in Egypt. ${duration} days tour starting at $${price}. Visit ${location} and experience authentic Egyptian culture.`;

  const keywords = [
    title,
    `${location} tour`,
    "Egypt travel",
    "Egypt tour package",
    `${duration} days Egypt`,
    "Egyptian vacation",
    location,
    "Egypt tours",
    "Nile cruise",
    "pyramids tour",
  ];

  return generatePageMetadata({
    title: `${title} - ${duration} Days Egypt Tour`,
    description: metaDescription,
    path: `/programs/${documentId}`,
    image,
    keywords,
    type: "article",
    modifiedTime: updatedAt,
  });
}

/**
 * Generate metadata for place pages
 */
export function generatePlaceMetadata({
  name,
  description,
  category,
  image,
  documentId,
}: {
  name: string;
  description?: string | null;
  category?: string;
  image?: string | null;
  documentId: string;
}): Metadata {
  const metaDescription = description
    ? generateMetaDescription(description)
    : `Explore ${name}${category ? ` in ${category}` : ""} with ZoeHoliday. Discover Egypt's amazing destinations and cultural landmarks.`;

  const keywords = [
    name,
    "Egypt destinations",
    "places to visit in Egypt",
    category || "Egypt travel",
    "Egyptian landmarks",
    "Egypt tourism",
  ];

  return generatePageMetadata({
    title: `${name}${category ? ` - ${category}` : ""} | Egypt Travel Guide`,
    description: metaDescription,
    path: `/placesToGo/${documentId}`,
    image,
    keywords,
    type: "article",
  });
}

/**
 * Generate breadcrumb list for structured data
 */
export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function generateBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SITE_URL}${item.item}`,
    })),
  };
}

/**
 * Calculate reading time from text content
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const strippedText = text.replace(/<[^>]*>/g, "");
  const words = strippedText.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate FAQ schema from Q&A pairs
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

/**
 * Validate and format price for structured data
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return numPrice.toFixed(2);
}

/**
 * Generate JSON-LD script tag
 */
export function generateJsonLd(data: object): string {
  return JSON.stringify(data, null, 2);
}
