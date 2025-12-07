import { Metadata } from "next";
import BusinessEventsContent from "./BusinessEventsContent";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Business Events & MICE Services in Egypt | ZoeHoliday",
  description: "Organize corporate events, conferences, team building activities, and business travel in Egypt with ZoeHoliday's professional event management services.",
  keywords: ["corporate events Egypt", "business conferences", "team building", "MICE tourism", "corporate travel", "Egypt event management"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/business-events`,
  },
  openGraph: {
    title: "Business Events & MICE Services in Egypt | ZoeHoliday",
    description: "Elevate your corporate gatherings with our comprehensive MICE services in Egypt's most prestigious venues.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/business-events`,
    images: [
      {
        url: "/images/business-events-og.jpg",
        width: 1200,
        height: 630,
        alt: "Business Events in Egypt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Events & MICE Services in Egypt | ZoeHoliday",
    description: "Professional MICE services for corporate events and conferences in Egypt.",
    creator: "@zoeholiday",
  },
};

export default function BusinessEventsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Business Events", item: "/business-events" }
        ]}
      />
      <BusinessEventsContent />
    </>
  );
}
