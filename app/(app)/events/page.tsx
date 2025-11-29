"use client";

import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import EventsContent from "./EventsContent";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Events" },
        ]}
      />

      <EventsContent />
    </div>
  );
}
