import Script from "next/script";

/**
 * Enhanced ImageObject Schema with Detailed Metadata
 * Improves image search rankings, attribution, and copyright protection
 */

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
  encodingFormat?: string;
  creator?: {
    name: string;
    url?: string;
  };
  creditText?: string;
  copyrightHolder?: string;
  copyrightYear?: number;
  license?: string;
  acquireLicensePage?: string;
  representativeOfPage?: boolean;
  exifData?: {
    camera?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    iso?: string;
    exposureTime?: string;
  };
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
  encodingFormat = 'image/jpeg',
  creator,
  creditText,
  copyrightHolder = 'ZoeHoliday',
  copyrightYear = new Date().getFullYear(),
  license,
  acquireLicensePage,
  representativeOfPage = false,
  exifData,
}: ImageObjectSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": url,
    "contentUrl": contentUrl || url,
    "name": name,
    "caption": caption || name,
    "description": description || caption || name,
    "encodingFormat": encodingFormat,
    "author": {
      "@type": "Organization",
      "name": author,
    },
    ...(creator && {
      "creator": {
        "@type": creator.url ? "Organization" : "Person",
        "name": creator.name,
        ...(creator.url && { "url": creator.url }),
      },
    }),
    ...(creditText && { "creditText": creditText }),
    "copyrightHolder": {
      "@type": "Organization",
      "name": copyrightHolder,
    },
    "copyrightYear": copyrightYear,
    ...(license && { "license": license }),
    ...(acquireLicensePage && { "acquireLicensePage": acquireLicensePage }),
    "representativeOfPage": representativeOfPage,
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
    ...(exifData && { "exifData": exifData }),
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
