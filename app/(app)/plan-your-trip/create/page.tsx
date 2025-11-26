import { Metadata } from "next";
import CreateTripContent from "./CreateTripContent";

export const metadata: Metadata = {
  title: "Create Your Trip - Custom Itinerary Builder",
  description: "Create your perfect Egypt trip with our interactive itinerary builder. Drag and drop destinations, create custom travel plans, and build your dream Egyptian adventure.",
  keywords: ["create Egypt trip", "Egypt itinerary builder", "custom Egypt tour", "Egypt travel planner"],
};

export default function CreateTripPage() {
  return <CreateTripContent />;
}
