import "../app/globals.css"
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import ServerNavBar from "@/components/layout/ServerNavBar";
import { ThemeProvider } from "@/components/Providers";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import BackgroundAudio from "@/components/BackgroundAudio";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo-config";

// Using system fonts to avoid Google Fonts network dependency during build
const fontVariables = {
  sans: "--font-geist-sans",
  mono: "--font-geist-mono",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Egypt Tours & Travel Packages | ZoeHoliday",
    template: "%s | ZoeHoliday"
  },
  description: "Plan Egypt tours with local experts: private Pyramids visits, Nile cruises, Luxor temples and custom travel packages from ZoeHoliday.",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
    canonical: "/",
  },
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ZoeHoliday - Egypt Travel & Tours",
    title: "Egypt Travel & Tour Packages | ZoeHoliday - Pyramids, Nile & Ancient Temples",
    description: "Premium travel experiences in Egypt. Discover premium private tours of the Pyramids of Giza and luxury Nile cruises with our family-run business and expert local guides.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
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
    description: "Premium travel experiences in Egypt. Discover premium private tours of the Pyramids of Giza and luxury Nile cruises with our family-run business and expert local guides.",
    images: [DEFAULT_OG_IMAGE],
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "lPn8MP-8chhi7XKEZeAbSyMqBcRpx4khZK6aKDqS4vs",
  },
  other: {
    'geo.region': 'EG',
    'geo.placename': 'Cairo',
    'geo.position': '30.0444;31.2357',
    'ICBM': '30.0444, 31.2357',
  },
};

export const viewport: Viewport = {
  themeColor: "#d4af37",
  colorScheme: "dark light",
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
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="ZoeHoliday" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ZoeHoliday" />
        <meta name="msapplication-TileColor" content="#d4af37" />
        <meta name="msapplication-tap-highlight" content="no" />

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
