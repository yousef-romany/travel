import { PromoCode } from "@/fetch/promo-codes";

interface OfferSchemaProps {
  promoCodes: PromoCode[];
}

export default function OfferSchema({ promoCodes }: OfferSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com";

  const offers = promoCodes.map((code) => ({
    "@type": "Offer",
    "name": code.description || `${code.code} Discount`,
    "description": code.description || `Save ${code.discountType === "percentage" ? `${code.discountValue}%` : `$${code.discountValue}`} on Egypt tour packages`,
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": code.discountType === "fixed" ? code.discountValue : undefined,
      "priceCurrency": "USD",
      ...(code.discountType === "percentage" && {
        "valueAddedTaxIncluded": false,
      }),
    },
    "availability": "https://schema.org/InStock",
    "url": `${baseUrl}/promo-codes`,
    "validFrom": code.validFrom,
    "validThrough": code.validUntil,
    "seller": {
      "@type": "Organization",
      "name": "ZoeHoliday",
    },
    ...(code.minimumPurchase && {
      "eligibleTransactionVolume": {
        "@type": "PriceSpecification",
        "price": code.minimumPurchase,
        "priceCurrency": "USD",
      },
    }),
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": offers.map((offer, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": offer,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
