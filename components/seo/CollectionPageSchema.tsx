interface CollectionPageSchemaProps {
    name: string;
    description: string;
    url: string;
    items: Array<{
        name: string;
        url: string;
        image?: string;
        description?: string;
    }>;
}

export default function CollectionPageSchema({
    name,
    description,
    url,
    items,
}: CollectionPageSchemaProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com";

    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": name,
        "description": description,
        "url": `${siteUrl}${url}`,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": items.length,
            "itemListElement": items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "TouristTrip",
                    "name": item.name,
                    "url": `${siteUrl}${item.url}`,
                    "image": item.image
                        ? item.image.startsWith("http")
                            ? item.image
                            : `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.image}`
                        : undefined,
                    "description": item.description,
                },
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
