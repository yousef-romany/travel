import { Metadata } from "next";
import BusinessEventsContent from "./BusinessEventsContent";

export const metadata: Metadata = {
  title: "Business Events - ZoeHoliday Egypt",
  description: "Organize corporate events, conferences, team building activities, and business travel in Egypt with ZoeHoliday's professional event management services.",
  keywords: ["corporate events Egypt", "business conferences", "team building", "MICE tourism", "corporate travel", "Egypt event management"],
  openGraph: {
    title: "Business Events in Egypt | ZoeHoliday",
    description: "Elevate your corporate gatherings with our comprehensive MICE services in Egypt's most prestigious venues.",
    type: "website",
    url: "/business-events",
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
    title: "Business Events in Egypt | ZoeHoliday",
    description: "Professional MICE services for corporate events and conferences in Egypt.",
  },
};

export default function BusinessEventsPage() {
  return <BusinessEventsContent />;
}
