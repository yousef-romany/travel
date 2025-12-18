/**
 * Pagination SEO Component
 * Adds rel="prev" and rel="next" meta tags for proper pagination indexing
 * Helps Google understand paginated content structure
 */

import Head from 'next/head';

interface PaginationSEOProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string; // e.g., '/programs' or '/destinations/cairo'
  includeQueryParams?: Record<string, string>; // Additional query params like filters
}

export default function PaginationSEO({
  currentPage,
  totalPages,
  baseUrl,
  includeQueryParams = {},
}: PaginationSEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

  // Build query string from additional params
  const queryString = Object.entries(includeQueryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  const queryPrefix = queryString ? `?${queryString}&` : '?';

  // Construct URLs
  const canonicalUrl = currentPage === 1
    ? `${siteUrl}${baseUrl}`
    : `${siteUrl}${baseUrl}${queryPrefix}page=${currentPage}`;

  const prevUrl = currentPage > 1
    ? currentPage === 2
      ? `${siteUrl}${baseUrl}${queryString ? `?${queryString}` : ''}`
      : `${siteUrl}${baseUrl}${queryPrefix}page=${currentPage - 1}`
    : null;

  const nextUrl = currentPage < totalPages
    ? `${siteUrl}${baseUrl}${queryPrefix}page=${currentPage + 1}`
    : null;

  return (
    <>
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Previous page */}
      {prevUrl && <link rel="prev" href={prevUrl} />}

      {/* Next page */}
      {nextUrl && <link rel="next" href={nextUrl} />}

      {/* View All page (if applicable) */}
      {totalPages > 1 && (
        <link
          rel="alternate"
          href={`${siteUrl}${baseUrl}/all${queryString ? `?${queryString}` : ''}`}
          hrefLang="x-default"
        />
      )}

      {/* Schema.org CollectionPage markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            url: canonicalUrl,
            ...(prevUrl && { 'previousItem': prevUrl }),
            ...(nextUrl && { 'nextItem': nextUrl }),
            isPartOf: {
              '@type': 'WebSite',
              name: 'ZoeHoliday',
              url: siteUrl,
            },
          }),
        }}
      />
    </>
  );
}

/**
 * Page Selector Component for SEO-friendly Pagination
 * Generates numbered page links for search engines to crawl
 */
interface PageSelectorProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  onPageChange?: (page: number) => void;
  maxVisiblePages?: number;
}

export function PageSelector({
  currentPage,
  totalPages,
  baseUrl,
  onPageChange,
  maxVisiblePages = 7,
}: PageSelectorProps) {
  if (totalPages <= 1) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

  // Calculate page range to display
  const getPageRange = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Calculate range around current page
      const rangeStart = Math.max(2, currentPage - 2);
      const rangeEnd = Math.min(totalPages - 1, currentPage + 2);

      // Add ellipsis if needed
      if (rangeStart > 2) {
        pages.push('...');
      }

      // Add pages around current
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (rangeEnd < totalPages - 1) {
        pages.push('...');
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageRange();

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className="flex items-center justify-center gap-2 my-8"
    >
      {/* Previous Button */}
      {currentPage > 1 && (
        <a
          href={currentPage === 2 ? baseUrl : `${baseUrl}?page=${currentPage - 1}`}
          onClick={(e) => {
            if (onPageChange) {
              e.preventDefault();
              onPageChange(currentPage - 1);
            }
          }}
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Go to previous page"
        >
          Previous
        </a>
      )}

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;
        const href = pageNum === 1 ? baseUrl : `${baseUrl}?page=${pageNum}`;

        return (
          <a
            key={pageNum}
            href={href}
            onClick={(e) => {
              if (onPageChange) {
                e.preventDefault();
                onPageChange(pageNum);
              }
            }}
            className={`px-4 py-2 border rounded ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label={`${isActive ? 'Current page, page' : 'Go to page'} ${pageNum}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </a>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages && (
        <a
          href={`${baseUrl}?page=${currentPage + 1}`}
          onClick={(e) => {
            if (onPageChange) {
              e.preventDefault();
              onPageChange(currentPage + 1);
            }
          }}
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Go to next page"
        >
          Next
        </a>
      )}
    </nav>
  );
}

/**
 * Generate pagination metadata for page component
 */
export function generatePaginationMetadata(
  currentPage: number,
  totalPages: number,
  baseUrl: string,
  baseTitle: string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

  const title = currentPage === 1
    ? baseTitle
    : `${baseTitle} - Page ${currentPage} of ${totalPages}`;

  const description = currentPage === 1
    ? `Explore our collection of Egypt tours and travel packages.`
    : `Viewing page ${currentPage} of ${totalPages} of Egypt tours and travel packages.`;

  const canonical = currentPage === 1
    ? `${siteUrl}${baseUrl}`
    : `${siteUrl}${baseUrl}?page=${currentPage}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: currentPage <= 10, // Only index first 10 pages
      follow: true,
    },
  };
}
