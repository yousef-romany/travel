/**
 * SEO-Optimized Related Content Widget
 * Displays related tours/content with proper internal linking and schema markup
 * Improves site architecture and user engagement
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { generateRelatedLinks, type RelatedLink } from '@/lib/internal-linking';

interface RelatedContentItem {
  id: string;
  documentId?: string;
  title: string;
  description?: string;
  image?: string;
  location?: string;
  category?: string;
  tags?: string[];
  price?: number;
  rating?: number;
  type: 'program' | 'destination' | 'article';
}

interface RelatedContentWidgetProps {
  currentContent: RelatedContentItem;
  allContent: RelatedContentItem[];
  maxItems?: number;
  title?: string;
  showImages?: boolean;
  showPrices?: boolean;
  className?: string;
}

export default function RelatedContentWidget({
  currentContent,
  allContent,
  maxItems = 6,
  title = 'You May Also Like',
  showImages = true,
  showPrices = true,
  className = '',
}: RelatedContentWidgetProps) {
  // Generate related links using our internal linking algorithm
  const relatedLinks = generateRelatedLinks(
    {
      type: currentContent.type,
      location: currentContent.location,
      category: currentContent.category,
      tags: currentContent.tags,
    },
    allContent.map(item => ({
      id: item.documentId || item.id,
      title: item.title,
      type: item.type,
      location: item.location,
      category: item.category,
      tags: item.tags,
    })),
    maxItems
  );

  // Get full content details for related items
  const relatedContent = relatedLinks
    .map(link => {
      const id = link.url.split('/').pop() || '';
      return allContent.find(item => item.documentId === id || item.id === id);
    })
    .filter((item): item is RelatedContentItem => item !== undefined);

  if (relatedContent.length === 0) return null;

  return (
    <section
      className={`related-content-widget ${className}`}
      aria-labelledby="related-content-heading"
    >
      {/* Schema.org ItemList for related content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: title,
            numberOfItems: relatedContent.length,
            itemListElement: relatedContent.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'TouristTrip',
                name: item.title,
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/${item.type === 'program' ? 'programs' : item.type === 'destination' ? 'destinations' : 'inspiration'}/${item.documentId || item.id}`,
                ...(item.image && { image: item.image }),
                ...(item.description && { description: item.description }),
              },
            })),
          }),
        }}
      />

      <h2
        id="related-content-heading"
        className="text-2xl md:text-3xl font-bold mb-6"
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedContent.map((item) => {
          const href = `/${item.type === 'program' ? 'programs' : item.type === 'destination' ? 'destinations' : 'inspiration'}/${item.documentId || item.id}`;

          return (
            <Link
              key={item.documentId || item.id}
              href={href}
              className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              title={`Explore ${item.title}`}
            >
              {showImages && item.image && (
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={`${item.title} - ${item.location || 'Egypt'} Tour`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {item.location && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {item.location}
                    </div>
                  )}
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  {showPrices && item.price && (
                    <div className="text-lg font-bold text-primary">
                      ${item.price}
                    </div>
                  )}

                  {item.rating && (
                    <div className="flex items-center text-sm">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {item.category && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {item.category}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* SEO-friendly "View More" link */}
      <div className="mt-8 text-center">
        <Link
          href={`/${currentContent.type === 'program' ? 'programs' : currentContent.type === 'destination' ? 'destinations' : 'inspiration'}`}
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          View All {currentContent.type === 'program' ? 'Tours' : currentContent.type === 'destination' ? 'Destinations' : 'Articles'}
        </Link>
      </div>
    </section>
  );
}

/**
 * Compact Related Content List (for sidebars)
 */
interface RelatedContentListProps {
  currentContent: RelatedContentItem;
  allContent: RelatedContentItem[];
  maxItems?: number;
  title?: string;
}

export function RelatedContentList({
  currentContent,
  allContent,
  maxItems = 5,
  title = 'Related Tours',
}: RelatedContentListProps) {
  const relatedLinks = generateRelatedLinks(
    {
      type: currentContent.type,
      location: currentContent.location,
      category: currentContent.category,
      tags: currentContent.tags,
    },
    allContent.map(item => ({
      id: item.documentId || item.id,
      title: item.title,
      type: item.type,
      location: item.location,
      category: item.category,
      tags: item.tags,
    })),
    maxItems
  );

  const relatedContent = relatedLinks
    .map(link => {
      const id = link.url.split('/').pop() || '';
      return allContent.find(item => item.documentId === id || item.id === id);
    })
    .filter((item): item is RelatedContentItem => item !== undefined);

  if (relatedContent.length === 0) return null;

  return (
    <aside className="related-content-list border rounded-lg p-4">
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      <ul className="space-y-3">
        {relatedContent.map((item) => {
          const href = `/${item.type === 'program' ? 'programs' : item.type === 'destination' ? 'destinations' : 'inspiration'}/${item.documentId || item.id}`;

          return (
            <li key={item.documentId || item.id}>
              <Link
                href={href}
                className="flex gap-3 hover:bg-accent rounded p-2 transition-colors"
                title={item.title}
              >
                {item.image && (
                  <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                  {item.price && (
                    <p className="text-sm text-primary font-semibold mt-1">
                      ${item.price}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
