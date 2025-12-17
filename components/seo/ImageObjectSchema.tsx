import Script from "next/script";

interface ImageObjectSchemaProps {
  url: string;
  name: string;
  caption?: string;
  description?: string;
  width?: number;
  height?: number;
  contentUrl?: string;
  thumbnail?: string;
  uploadDate?: string;
  author?: string;
}

export default function ImageObjectSchema({
  url,
  name,
  caption,
  description,
  width,
  height,
  contentUrl,
  thumbnail,
  uploadDate,
  author = "ZoeHoliday",
}: ImageObjectSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": url,
    "contentUrl": contentUrl || url,
    "name": name,
    "caption": caption || name,
    "description": description || caption || name,
    "author": {
      "@type": "Organization",
      "name": author,
    },
    "copyrightHolder": {
      "@type": "Organization",
      "name": author,
    },
    ...(width && height && {
      "width": width,
      "height": height,
    }),
    ...(thumbnail && {
      "thumbnail": {
        "@type": "ImageObject",
        "url": thumbnail,
      },
    }),
    ...(uploadDate && {
      "uploadDate": uploadDate,
    }),
  };

  return (
    <Script
      id="image-object-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  );
}
