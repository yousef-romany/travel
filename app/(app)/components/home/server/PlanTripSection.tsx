import { Calendar } from "lucide-react";
import TripTabs from "../client/TripTabs";

/**
 * Plan Your Trip Section - Server Component
 * Wraps client tabs component with server-rendered heading
 */
export default function PlanTripSection() {
  return (
    <section id="plan-your-trip" className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
        <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-3 sm:mb-4">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
          Plan Your Trip
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
          Everything you need to create your perfect Egyptian adventure
        </p>
      </div>

      <TripTabs />
    </section>
  );
}
