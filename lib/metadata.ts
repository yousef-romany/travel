import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

/**
 * Generate canonical URL for a given path
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash if present (except for root)
  const cleanPath = path === '/' ? path : path.replace(/\/$/, '');
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Generate base metadata with canonical URL
 */
export function generateMetadata(
  path: string,
  customMetadata?: Metadata
): Metadata {
  const canonical = getCanonicalUrl(path);

  return {
    ...customMetadata,
    alternates: {
      canonical,
      ...customMetadata?.alternates,
    },
    openGraph: {
      url: canonical,
      ...customMetadata?.openGraph,
    },
  };
}

/**
 * Generate program metadata with SEO optimization
 */
export function generateProgramMetadata(
  title: string,
  description: string,
  image?: string,
  price?: number
): Metadata {
  const path = `/programs/${encodeURIComponent(title)}`;
  const canonical = getCanonicalUrl(path);

  return {
    title: `${title} - Egypt Tour Package`,
    description: description.slice(0, 160),
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | ZoeHoliday Egypt Tours`,
      description: description.slice(0, 160),
      url: canonical,
      type: 'website',
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ZoeHoliday`,
      description: description.slice(0, 160),
      images: image ? [image] : [],
    },
  };
}

/**
 * Generate place metadata with SEO optimization
 */
export function generatePlaceMetadata(
  category: string,
  subCategory: string,
  title: string,
  description: string,
  image?: string
): Metadata {
  const path = `/placesTogo/${category}/${subCategory}/${title}`;
  const canonical = getCanonicalUrl(path);

  return {
    title: `${title} - Egypt Travel Guide`,
    description: description.slice(0, 160),
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | ZoeHoliday Egypt Guide`,
      description: description.slice(0, 160),
      url: canonical,
      type: 'article',
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ZoeHoliday`,
      description: description.slice(0, 160),
      images: image ? [image] : [],
    },
  };
}
