/**
 * VideoObject Schema for Individual Videos
 * More detailed than video sitemap, shows video rich results
 */

interface VideoObjectSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string; // ISO 8601
  duration?: string; // ISO 8601 duration (PT1M30S = 1 min 30 sec)
  contentUrl?: string;
  embedUrl?: string;
  interactionStatistic?: {
    interactionType: 'WatchAction';
    userInteractionCount: number;
  };
  publisher?: {
    name: string;
    logo: string;
  };
  expires?: string;
  hasPart?: {
    name: string;
    startOffset: number;
    endOffset: number;
    url: string;
  }[];
}

export default function VideoObjectSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl,
  interactionStatistic,
  publisher = {
    name: 'ZoeHoliday',
    logo: 'https://zoeholiday.com/icons/icon-512x512.png',
  },
  expires,
  hasPart,
}: VideoObjectSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    ...(duration && { duration }),
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl }),
    ...(interactionStatistic && { interactionStatistic }),
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: publisher.logo,
      },
    },
    ...(expires && { expires }),
    ...(hasPart && { hasPart }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
