import "../app/globals.css"
import type { Metadata } from "next";
import { Suspense } from "react";
import ServerNavBar from "@/components/layout/ServerNavBar";
import { ThemeProvider } from "@/components/Providers";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import BackgroundAudio from "@/components/BackgroundAudio";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

// Using system fonts to avoid Google Fonts network dependency during build
const fontVariables = {
  sans: "--font-geist-sans",
  mono: "--font-geist-mono",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'),
  title: {
    default: "ZoeHoliday - Explore the Beauty of Egypt | Travel & Tour Packages",
    template: "%s | ZoeHoliday"
  },
  description: "Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure. Book your Egyptian journey today with our curated travel packages and tours. Expert local guides, secure booking, 24/7 support.",
  keywords: [
    "Egypt travel", "Egypt tours", "Egyptian vacation", "pyramids tour", "Nile cruise",
    "Cairo tours", "Luxor travel", "Egyptian holidays", "travel packages Egypt", "Egypt tourism",
    "Giza pyramids", "Valley of Kings", "Red Sea diving", "Aswan tours", "Alexandria travel",
    "Egypt tour operator", "Egyptian adventure", "ancient Egypt tours", "Karnak Temple",
    "Abu Simbel", "Egypt cultural tours", "Egypt family vacation", "Egypt honeymoon packages"
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
    title: "ZoeHoliday - Explore the Beauty of Egypt | Expert Tour Packages",
    description: "Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure with our licensed tour operator. Book now!",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "ZoeHoliday - Egypt Travel & Tours - Explore Pyramids, Nile Cruises & Ancient Temples",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@zoeholiday",
    creator: "@zoeholiday",
    title: "ZoeHoliday - Explore the Beauty of Egypt | Tour Packages",
    description: "Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure. Expert guides, secure booking, 24/7 support.",
    images: ["/icons/icon-512x512.png"],
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
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <OrganizationSchema />

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
        className="antialiased relative"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}
      >
        <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ServerNavBar />
          <div className="pt-[76px]">{children}</div>
          <div id="google_translate_element"></div>
          <BackgroundAudio />
          <InstallPrompt />
          <Toaster />
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
