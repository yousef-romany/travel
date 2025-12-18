/**
 * OG Image Generator Utilities
 * Helper functions to generate dynamic Open Graph image URLs
 */

export interface OGImageParams {
  title: string;
  location?: string;
  price?: number;
  rating?: number;
  type?: 'program' | 'destination' | 'article';
  image?: string;
}

/**
 * Generate OG image URL for any content type
 */
export function generateOGImageUrl(params: OGImageParams): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';
  const apiUrl = new URL('/api/og', baseUrl);

  // Add all parameters to URL
  apiUrl.searchParams.set('title', params.title);

  if (params.location) {
    apiUrl.searchParams.set('location', params.location);
  }

  if (params.price !== undefined) {
    apiUrl.searchParams.set('price', params.price.toString());
  }

  if (params.rating !== undefined) {
    apiUrl.searchParams.set('rating', params.rating.toString());
  }

  if (params.type) {
    apiUrl.searchParams.set('type', params.type);
  }

  if (params.image) {
    apiUrl.searchParams.set('image', params.image);
  }

  return apiUrl.toString();
}

/**
 * Generate OG image URL specifically for tour programs
 */
export function generateProgramOGImage(
  title: string,
  location: string,
  price?: number,
  rating?: number
): string {
  return generateOGImageUrl({
    title,
    location,
    price,
    rating,
    type: 'program',
  });
}

/**
 * Generate OG image URL specifically for destinations
 */
export function generateDestinationOGImage(
  title: string,
  location: string,
  rating?: number
): string {
  return generateOGImageUrl({
    title,
    location,
    rating,
    type: 'destination',
  });
}

/**
 * Generate OG image URL specifically for articles/blog posts
 */
export function generateArticleOGImage(
  title: string,
  category?: string
): string {
  return generateOGImageUrl({
    title,
    location: category,
    type: 'article',
  });
}

/**
 * Generate Open Graph metadata for a program
 */
export function generateProgramOGMetadata(
  title: string,
  description: string,
  location: string,
  price?: number,
  rating?: number,
  imageUrl?: string
) {
  const ogImageUrl = imageUrl || generateProgramOGImage(title, location, price, rating);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website' as const,
      url: siteUrl,
      siteName: 'ZoeHoliday',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - ${location} Tour`,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [ogImageUrl],
      creator: '@zoeholiday',
      site: '@zoeholiday',
    },
  };
}

/**
 * Generate Open Graph metadata for a destination
 */
export function generateDestinationOGMetadata(
  title: string,
  description: string,
  location: string,
  rating?: number,
  imageUrl?: string
) {
  const ogImageUrl = imageUrl || generateDestinationOGImage(title, location, rating);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website' as const,
      url: siteUrl,
      siteName: 'ZoeHoliday',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Explore ${title} - ${location}`,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [ogImageUrl],
      creator: '@zoeholiday',
      site: '@zoeholiday',
    },
  };
}

/**
 * Generate Open Graph metadata for articles
 */
export function generateArticleOGMetadata(
  title: string,
  description: string,
  category?: string,
  imageUrl?: string
) {
  const ogImageUrl = imageUrl || generateArticleOGImage(title, category);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article' as const,
      url: siteUrl,
      siteName: 'ZoeHoliday',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [ogImageUrl],
      creator: '@zoeholiday',
      site: '@zoeholiday',
    },
  };
}

/**
 * Fallback OG image for pages without dynamic content
 */
export function getDefaultOGImage(): string {
  return generateOGImageUrl({
    title: 'Discover Egypt with ZoeHoliday',
    location: 'Egypt',
    type: 'program',
  });
}
