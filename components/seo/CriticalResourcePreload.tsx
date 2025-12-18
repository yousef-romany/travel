/**
 * Critical Resource Preload Component
 * Preloads fonts, images, and scripts for faster initial render
 */

export default function CriticalResourcePreload() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.zoeholidays.com';

  return (
    <>
      {/* Preload Critical Images */}
      <link
        rel="preload"
        as="image"
        href={`${siteUrl}/logo.png`}
        type="image/png"
      />
      <link
        rel="preload"
        as="image"
        href="https://res.cloudinary.com/dir8ao2mt/image/upload/v1764631854/__1_l2obyo.jpg"
        type="image/jpeg"
        imageSizes="(max-width: 768px) 100vw, 1200px"
      />

      {/* Preload Critical CSS (if using custom fonts) */}
      {/*
      <link
        rel="preload"
        as="style"
        href="/fonts/custom-font.css"
      />
      */}

      {/* Prefetch Next Page Resources */}
      <link rel="prefetch" href={`${siteUrl}/programs`} />
      <link rel="prefetch" href={`${siteUrl}/destinations`} />

      {/* Preconnect to External Domains (Additional) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS Prefetch for Third-party Services */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://stats.g.doubleclick.net" />

      {/* Preload Critical API Endpoints (for faster data fetching) */}
      <link
        rel="preconnect"
        href={strapiUrl}
        crossOrigin="use-credentials"
      />
    </>
  );
}
