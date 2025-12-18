/**
 * Advanced Social Media Meta Tags
 * Pinterest, LinkedIn Rich Cards, WhatsApp, Telegram
 */

export interface AdvancedMetaTagsProps {
  title: string;
  description: string;
  image: string;
  url: string;
  price?: number;
  availability?: 'instock' | 'outofstock';
  type?: 'website' | 'article' | 'product';
}

export default function AdvancedMetaTags({
  title,
  description,
  image,
  url,
  price,
  availability = 'instock',
  type = 'website',
}: AdvancedMetaTagsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <>
      {/* Pinterest Rich Pins */}
      <meta name="pinterest-rich-pin" content="true" />
      <meta property="og:type" content={type === 'product' ? 'product' : 'article'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />

      {price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content="USD" />
          <meta property="product:availability" content={availability} />
        </>
      )}

      {/* LinkedIn Rich Cards */}
      <meta property="og:site_name" content="ZoeHoliday" />
      <meta property="og:locale" content="en_US" />

      {/* WhatsApp & Telegram Preview */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Apple Messages Rich Links */}
      <meta name="apple-mobile-web-app-title" content="ZoeHoliday" />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      {/* Microsoft Tiles */}
      <meta name="msapplication-TileColor" content="#d4af37" />
      <meta name="msapplication-TileImage" content={`${siteUrl}/icons/icon-144x144.png`} />
      <meta name="msapplication-config" content={`${siteUrl}/browserconfig.xml`} />

      {/* Dublin Core Metadata (Academic/Library Systems) */}
      <meta name="DC.title" content={title} />
      <meta name="DC.description" content={description} />
      <meta name="DC.creator" content="ZoeHoliday" />
      <meta name="DC.publisher" content="ZoeHoliday Travel Agency" />
      <meta name="DC.type" content="Text" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.language" content="en" />
      <meta name="DC.coverage" content="Egypt" />

      {/* Additional Social Optimization */}
      <meta property="og:see_also" content={`${siteUrl}/programs`} />
      <meta property="og:see_also" content={`${siteUrl}/destinations`} />

      {/* Rich Link Preview for Messaging Apps */}
      <meta property="al:web:url" content={fullUrl} />
      <meta property="al:ios:url" content={fullUrl} />
      <meta property="al:android:url" content={fullUrl} />
    </>
  );
}
