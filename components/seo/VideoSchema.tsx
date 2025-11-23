interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate?: string;
  duration?: string; // ISO 8601 format like "PT30S" for 30 seconds
  embedUrl?: string;
}

/**
 * VideoSchema Component for SEO
 * Implements schema.org VideoObject markup for improved search visibility
 */
export default function VideoSchema({
  name,
  description,
  thumbnailUrl,
  contentUrl,
  uploadDate = new Date().toISOString(),
  duration = "PT30S",
  embedUrl,
}: VideoSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    contentUrl,
    uploadDate,
    duration,
    ...(embedUrl && { embedUrl }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
