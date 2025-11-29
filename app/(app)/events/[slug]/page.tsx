"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchEventBySlug } from "@/fetch/events";
import Loading from "@/components/Loading";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import EventDetailContent from "./EventDetailContent";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEventBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) return <Loading />;

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/events")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            View All Events
          </button>
        </div>
      </div>
    );
  }

  const event = data.data;

  return (
    <div className="min-h-screen bg-background">
      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: event.title },
        ]}
      />

      <EventDetailContent event={event} />
    </div>
  );
}
