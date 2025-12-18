/**
 * AggregateOffer Schema for Products with Multiple Pricing Options
 * Shows price ranges and multiple offers in search results
 */

export interface Offer {
  name: string;
  price: number;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  validFrom?: string;
}

export interface AggregateOfferSchemaProps {
  productName: string;
  offers: Offer[];
  image?: string;
  description?: string;
  url?: string;
}

export default function AggregateOfferSchema({
  productName,
  offers,
  image,
  description,
  url,
}: AggregateOfferSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';
  const fullImage = image?.startsWith('http')
    ? image
    : image
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${image}`
      : `${siteUrl}/og-image.jpg`;

  const prices = offers.map(o => o.price);
  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": description || productName,
    "image": fullImage,
    "url": url ? `${siteUrl}${url}` : siteUrl,
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": lowPrice.toString(),
      "highPrice": highPrice.toString(),
      "priceCurrency": offers[0]?.priceCurrency || "USD",
      "offerCount": offers.length,
      "offers": offers.map(offer => ({
        "@type": "Offer",
        "name": offer.name,
        "price": offer.price.toString(),
        "priceCurrency": offer.priceCurrency || "USD",
        "availability": `https://schema.org/${offer.availability || 'InStock'}`,
        "url": url ? `${siteUrl}${url}` : siteUrl,
        ...(offer.validFrom && { "validFrom": offer.validFrom }),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
