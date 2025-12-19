import { Metadata } from "next";
import PlanYourTripContent from "./PlanYourTripContent";
import PlanTripHero from "@/components/plan-trip-hero";

export const metadata: Metadata = {
  title: "Plan Your Egypt Trip - Custom Itinerary Builder",
  description: "Plan your perfect Egypt trip with our interactive itinerary builder. Drag and drop destinations, create custom travel plans, calculate costs, and build your dream Egyptian adventure. Explore pyramids, temples, beaches, and more.",
  keywords: ["plan Egypt trip", "Egypt itinerary", "Egypt trip planner", "custom Egypt tour", "Egypt travel planner", "build Egypt itinerary", "Egypt vacation planner", "trip planning Egypt"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/plan-your-trip`,
  },
  openGraph: {
    title: "Plan Your Egypt Trip - Custom Itinerary Builder | ZoeHoliday",
    description: "Plan your perfect Egypt trip with our interactive itinerary builder. Drag and drop destinations to create your dream adventure.",
    type: "website",
    url: "/plan-your-trip",
    images: [
      {
        url: "/og-plan.jpg",
        width: 1200,
        height: 630,
        alt: "Plan Your Egypt Trip",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plan Your Egypt Trip - Custom Itinerary Builder | ZoeHoliday",
    description: "Plan your perfect Egypt trip with our interactive itinerary builder. Drag and drop destinations to create your dream adventure.",
    images: ["/og-plan.jpg"],
  },
};

export default function PlanYourTripPage() {
  return (
    <>
      <PlanTripHero />
      <PlanYourTripContent />
    </>
  );
}
