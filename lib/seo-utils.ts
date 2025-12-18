/**
 * SEO Utility Functions
 * Centralized utilities for generating SEO-optimized content
 */

/**
 * Generate SEO-friendly meta description
 * Keeps it between 120-160 characters for optimal display
 */
export function generateMetaDescription(content: string, maxLength: number = 155): string {
  // Remove HTML tags if any
  const cleanContent = content.replace(/<[^>]*>/g, '');

  // Trim and truncate
  const trimmed = cleanContent.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  // Truncate at last complete word before maxLength
  const truncated = trimmed.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Generate dynamic title with brand
 * Format: "Page Title | Brand Name"
 */
export function generatePageTitle(title: string, includeBrand: boolean = true): string {
  const brand = "ZoeHoliday";
  const maxLength = 60; // Google typically shows 50-60 characters

  if (!includeBrand) {
    return title.length <= maxLength ? title : title.substring(0, maxLength - 3) + '...';
  }

  const fullTitle = `${title} | ${brand}`;

  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }

  // Truncate page title to fit with brand
  const availableLength = maxLength - brand.length - 3; // -3 for " | "
  return `${title.substring(0, availableLength)}... | ${brand}`;
}

/**
 * Generate keywords array from content
 */
export function generateKeywords(
  baseKeywords: string[],
  location?: string,
  category?: string
): string[] {
  const keywords = [...baseKeywords];

  if (location) {
    keywords.push(`${location} tours`, `visit ${location}`, `${location} travel`);
  }

  if (category) {
    keywords.push(`${category} tours`, `${category} packages`);
  }

  // Add Egypt-specific keywords
  keywords.push('Egypt tours', 'Egypt travel', 'Egyptian vacation');

  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Generate Open Graph description
 * Slightly longer than meta description (up to 200 chars)
 */
export function generateOGDescription(content: string): string {
  return generateMetaDescription(content, 200);
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';
  // Remove trailing slashes and ensure single leading slash
  const cleanPath = path.replace(/\/+$/, '').replace(/^\/+/, '/');
  return `${siteUrl}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Generate structured breadcrumb data
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbs(items: BreadcrumbItem[]): BreadcrumbItem[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

  return [
    { name: 'Home', url: siteUrl },
    ...items.map(item => ({
      ...item,
      url: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  ];
}

/**
 * Sanitize text for JSON-LD schemas
 */
export function sanitizeForSchema(text: string): string {
  return text
    .replace(/[\n\r]/g, ' ')
    .replace(/"/g, '\\"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate hreflang tags data
 */
export interface HreflangTag {
  lang: string;
  url: string;
}

export function generateHreflangTags(path: string): HreflangTag[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';
  const cleanPath = path.replace(/^\/+/, '/');

  return [
    { lang: 'en', url: `${siteUrl}${cleanPath}` },
    { lang: 'ar', url: `${siteUrl}/ar${cleanPath}` },
    { lang: 'fr', url: `${siteUrl}/fr${cleanPath}` },
    { lang: 'de', url: `${siteUrl}/de${cleanPath}` },
    { lang: 'x-default', url: `${siteUrl}${cleanPath}` },
  ];
}

/**
 * Calculate reading time for articles
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Extract first image from content
 */
export function extractFirstImage(images?: Array<{ url?: string; imageUrl?: string }>): string | undefined {
  if (!images || images.length === 0) return undefined;

  const firstImage = images[0];
  const imageUrl = firstImage.url || firstImage.imageUrl;

  if (!imageUrl) return undefined;

  return imageUrl.startsWith('http')
    ? imageUrl
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`;
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
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}
