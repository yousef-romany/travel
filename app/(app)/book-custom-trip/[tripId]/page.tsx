"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchPlanTripById } from "@/fetch/plan-trip";
import Loading from "@/components/Loading";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import BookCustomTripContent from "./BookCustomTripContent";

export default function BookCustomTripPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["planTrip", tripId],
    queryFn: () => fetchPlanTripById(tripId),
    enabled: !!tripId,
  });

  if (isLoading) return <Loading />;

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Trip Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The custom trip you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/plan-your-trip")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            View All Trips
          </button>
        </div>
      </div>
    );
  }

  const trip = data.data;

  return (
    <div className="min-h-screen bg-background">
      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Plan Your Trip", href: "/plan-your-trip" },
          { label: trip.tripName, href: `/plan-your-trip/${tripId}` },
          { label: "Book Trip" },
        ]}
      />

      <BookCustomTripContent trip={trip} />
    </div>
  );
}
