interface ArticleSchemaProps {
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    authorName?: string;
    url: string;
    keywords?: string[];
}

export default function ArticleSchema({
    headline,
    description,
    image,
    datePublished,
    dateModified,
    authorName = "ZoeHoliday Editorial Team",
    url,
    keywords = [],
}: ArticleSchemaProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com";
    const fullImageUrl = image.startsWith("http")
        ? image
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image}`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": headline,
        "description": description,
        "image": fullImageUrl,
        "datePublished": datePublished,
        "dateModified": dateModified || datePublished,
        "author": {
            "@type": "Person",
            "name": authorName,
            "url": siteUrl,
        },
        "publisher": {
            "@type": "Organization",
            "name": "ZoeHoliday",
            "url": siteUrl,
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`,
            },
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${siteUrl}${url}`,
        },
        "keywords": keywords.join(", "),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
