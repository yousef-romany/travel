import "../app/globals.css"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import NavBar from "@/components/layout/NavBar";
import { ThemeProvider } from "@/components/Providers";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZoeHoliday - Egypt Travel & Tours - Explore Pyramids, Nile Cruises & Ancient Temples",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@zoeholiday",
    creator: "@zoeholiday",
    title: "ZoeHoliday - Explore the Beauty of Egypt | Tour Packages",
    description: "Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure. Expert guides, secure booking, 24/7 support.",
    images: ["/og-image.jpg"],
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
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
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
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NavBar />
          <div className="pt-[76px]">{children}</div>
          <div id="google_translate_element"></div>
          <Toaster />
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
