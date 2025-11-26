import { Metadata } from "next";
import TripDetailsContent from "./TripDetailsContent";

export const metadata: Metadata = {
  title: "Trip Details - Custom Itinerary",
  description: "View custom trip itinerary details, destinations, pricing, and booking information for this Egypt travel plan.",
  keywords: ["Egypt trip details", "custom itinerary", "trip planner", "Egypt travel"],
};

export default async function TripDetailsPage({ params }: { params: Promise<{ tripId: string }> }) {
  const resolvedParams = await params;
  return <TripDetailsContent tripId={resolvedParams.tripId} />;
}
