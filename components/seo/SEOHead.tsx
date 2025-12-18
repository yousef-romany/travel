/**
 * Reusable SEO Head Component
 * Provides comprehensive SEO meta tags for any page
 */

import { generateCanonicalUrl, generatePageTitle, generateMetaDescription } from '@/lib/seo-utils';

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
}

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
}: SEOHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';
  const fullTitle = generatePageTitle(title);
  const metaDescription = generateMetaDescription(description);
  const canonical = url ? generateCanonicalUrl(url) : siteUrl;
  const ogImage = image?.startsWith('http')
    ? image
    : image
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${image}`
      : `${siteUrl}/og-image.jpg`;

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {author && <meta name="author" content={author} />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="ZoeHoliday" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@zoeholiday" />
      <meta name="twitter:creator" content="@zoeholiday" />

      {/* Additional SEO */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="MobileOptimized" content="width" />

      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="EG" />
      <meta name="geo.placename" content="Egypt" />
      <meta name="geo.position" content="30.0444;31.2357" />
      <meta name="ICBM" content="30.0444, 31.2357" />
    </>
  );
}
