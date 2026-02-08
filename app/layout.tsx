import "../app/globals.css"
import type { Metadata } from "next";
import { Suspense } from "react";
import ServerNavBar from "@/components/layout/ServerNavBar";
import { ThemeProvider } from "@/components/Providers";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import WebSiteSchema from "@/components/seo/WebSiteSchema";
import ServiceSchema from "@/components/seo/ServiceSchema";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import BackgroundAudio from "@/components/BackgroundAudio";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import ErrorBoundary from "@/components/ErrorBoundary";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import CriticalResourcePreload from "@/components/seo/CriticalResourcePreload";
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";

// Using system fonts to avoid Google Fonts network dependency during build
const fontVariables = {
  sans: "--font-geist-sans",
  mono: "--font-geist-mono",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'),
  title: {
    default: "Egypt Travel & Tour Packages | ZoeHoliday - Explore Pyramids, Nile Cruises & Ancient Wonders",
    template: "%s | ZoeHoliday"
  },
  description: "Discover Egypt's magic with ZoeHoliday! Explore pyramids, Nile cruises, temples & Red Sea beaches. Expert guides, custom tours, best prices. Visit October-April for perfect weather. Book your Egyptian adventure today!",
  keywords: [
    "Egypt travel", "Egypt tours", "Egyptian vacation", "pyramids tour", "Nile cruise",
    "Cairo tours", "Luxor travel", "Egyptian holidays", "travel packages Egypt", "Egypt tourism",
    "Giza pyramids", "Valley of Kings", "Red Sea diving", "Aswan tours", "Alexandria travel",
    "Egypt tour operator", "Egyptian adventure", "ancient Egypt tours", "Karnak Temple",
    "Abu Simbel", "Egypt cultural tours", "Egypt family vacation", "Egypt honeymoon packages",
    "best time to visit Egypt", "Egypt October to April", "Egypt winter travel", "Egypt tour packages 2025"
  ],
  authors: [{ name: "ZoeHoliday", url: "https://zoeholiday.com" }],
  creator: "ZoeHoliday",
  publisher: "ZoeHoliday",
  category: "Travel & Tourism",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ZoeHoliday',
    startupImage: [
      {
        url: '/icons/icon-512x512.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
  applicationName: 'ZoeHoliday',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'ar-EG': '/ar-EG',
    },
  },
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ['ar_EG', 'fr_FR', 'de_DE'],
    url: "/",
    siteName: "ZoeHoliday - Egypt Travel & Tours",
    title: "Egypt Travel & Tour Packages | ZoeHoliday - Pyramids, Nile & Ancient Temples",
    description: "Explore Egypt's pyramids, Nile cruises, temples & Red Sea with ZoeHoliday. Best time: October-April. Expert guides, custom tours, 24/7 support. Book your Egyptian adventure today!",
    images: [
      {
        url: "https://res.cloudinary.com/dir8ao2mt/image/upload/v1764631854/__1_l2obyo.jpg",
        width: 1200,
        height: 630,
        alt: "ZoeHoliday - Egypt Tours: Pyramids of Giza, Nile Cruises, Luxor Temples & Red Sea Adventures",
        type: "image/jpeg",
      },
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "ZoeHoliday Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@zoeholiday",
    creator: "@zoeholiday",
    title: "Egypt Travel & Tours | Pyramids, Nile Cruises & Ancient Wonders | ZoeHoliday",
    description: "Explore Egypt's pyramids, Nile cruises & temples. Best time: October-April. Expert guides, custom tours. Book your Egyptian adventure with ZoeHoliday!",
    images: ["https://res.cloudinary.com/dir8ao2mt/image/upload/v1764631854/__1_l2obyo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    // yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    // bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
  other: {
    'geo.region': 'EG',
    'geo.placename': 'Cairo',
    'geo.position': '30.0444;31.2357',
    'ICBM': '30.0444, 31.2357',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* DNS Prefetch & Preconnect for Performance */}
        <link rel="preconnect" href="https://dashboard.zoeholidays.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://dashboard.zoeholidays.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://translate.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://translate.google.com" />
        <link rel="preconnect" href="https://cdninstagram.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdninstagram.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <OrganizationSchema />
        <WebSiteSchema />
        <ServiceSchema />
        <LocalBusinessSchema />

        <meta name="google-site-verification" content="lPn8MP-8chhi7XKEZeAbSyMqBcRpx4khZK6aKDqS4vs" />
        {/* PWA Meta Tags */}
        <meta name="application-name" content="ZoeHoliday" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ZoeHoliday" />
        <meta name="theme-color" content="#d4af37" />
        <meta name="msapplication-TileColor" content="#d4af37" />
        <meta name="msapplication-tap-highlight" content="no" />

        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* Optimized: Only include most common iPhone/iPad splash screens */}
        {/* iPhone 14 Pro Max / 15 Pro Max */}
        <link rel="apple-touch-startup-image" href="icons/apple-splash-1290-2796.jpg" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        {/* iPhone 14/15 Pro */}
        <link rel="apple-touch-startup-image" href="icons/apple-splash-1179-2556.jpg" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        {/* iPhone 11 Pro / X / XS */}
        <link rel="apple-touch-startup-image" href="icons/apple-splash-1125-2436.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        {/* iPad Pro 12.9" */}
        <link rel="apple-touch-startup-image" href="icons/apple-splash-2048-2732.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-72x72.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Apple Splash Screens */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />

        {/* Google Translate Script */}
        <Script
          src="/assets/scripts/lang-config.js"
          // strategy="beforeInteractive"
          defer
        />
        <Script
          src="/assets/scripts/translation.js"
          // strategy="beforeInteractive"
          defer
        />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
          // strategy="beforeInteractive"
          defer
        />
        {/* Leaflet CSS - Load asynchronously via script to avoid blocking render */}
        <Script
          id="leaflet-css-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
                document.head.appendChild(link);
              })();
            `
          }}
        />
        <Script
          src="https://www.instagram.com/embed.js"
          strategy="lazyOnload"
        // onLoad={() => {
        //   console.log("Instagram embed script loaded");
        //   if (window?.instgrm) {
        //     window?.instgrm.Embeds.process(); // Manually process embeds
        //   }
        // }}
        />
      </head>
      <body
        className={`antialiased relative ${fontVariables.sans} ${fontVariables.mono}`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <PerformanceMonitor />
              <ServerNavBar />
              <div className="pt-[70px]">{children}</div>
              <div id="google_translate_element" className="hidden"></div>
              <BackgroundAudio />
              <InstallPrompt />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
