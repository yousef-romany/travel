import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholidays.com";

export const metadata: Metadata = {
  title: "Contact Us - Egypt Travel Experts",
  description:
    "Contact ZoeHoliday to plan your dream Egypt trip. Custom itineraries, Nile cruises, Pyramids tours, and expert local guides. Reach us via WhatsApp, email, or our message form - available 24/7.",
  keywords: [
    "contact ZoeHoliday",
    "Egypt tour contact",
    "plan Egypt trip",
    "Egypt travel inquiry",
    "book Egypt tour",
  ],
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Us | ZoeHoliday",
    description:
      "Plan your dream Egypt trip with ZoeHoliday. Contact our expert team 24/7 via WhatsApp, email, or our message form.",
    type: "website",
    url: `${SITE_URL}/contact`,
    siteName: "ZoeHoliday - Egypt Travel & Tours",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | ZoeHoliday",
    description:
      "Plan your dream Egypt trip with ZoeHoliday. Contact our expert team 24/7.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
