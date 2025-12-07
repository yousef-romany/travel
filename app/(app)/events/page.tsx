import { Metadata } from "next";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import EventsContent from "./EventsContent";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Events & Festivals in Egypt | ZoeHoliday",
  description: "Discover upcoming events, festivals, and cultural celebrations in Egypt. Plan your trip around Egypt's vibrant calendar of events with ZoeHoliday.",
  keywords: ["Egypt events", "Cairo festivals", "Egypt cultural events", "things to do in Egypt", "Egypt calendar", "music festivals Egypt"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/events`,
  },
  openGraph: {
    title: "Events & Festivals in Egypt | ZoeHoliday",
    description: "Discover upcoming events, festivals, and cultural celebrations in Egypt.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/events`,
    images: [
      {
        url: "/og-events.jpg",
        width: 1200,
        height: 630,
        alt: "Events in Egypt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events & Festivals in Egypt | ZoeHoliday",
    description: "Discover upcoming events, festivals, and cultural celebrations in Egypt.",
    images: ["/og-events.jpg"],
    creator: "@zoeholiday",
  },
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Events" },
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Events", item: "/events" }
        ]}
      />

      <EventsContent />
    </div>
  );
}
