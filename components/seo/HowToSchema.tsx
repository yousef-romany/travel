/**
 * HowTo Schema for Travel Guides
 * Shows step-by-step instructions in Google search results
 */

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 format: PT2H30M (2 hours 30 minutes)
  estimatedCost?: string;
  steps: HowToStep[];
  image?: string;
}

export default function HowToSchema({
  name,
  description,
  totalTime,
  estimatedCost,
  steps,
  image,
}: HowToSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';
  const fullImage = image?.startsWith('http')
    ? image
    : image
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${image}`
      : `${siteUrl}/og-image.jpg`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "image": fullImage,
    ...(totalTime && { "totalTime": totalTime }),
    ...(estimatedCost && {
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": estimatedCost,
      },
    }),
    "step": steps.map((step, index) => {
      const stepImage = step.image?.startsWith('http')
        ? step.image
        : step.image
          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${step.image}`
          : undefined;

      return {
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text,
        ...(stepImage && { "image": stepImage }),
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
