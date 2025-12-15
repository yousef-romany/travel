"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PlanTripHeroButtons() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4">
      <Button
        size="lg"
        className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transition-all group text-base px-6 py-6 w-full md:w-auto"
        onClick={() => router.push("/plan-your-trip/create")}
      >
        Start Planning Now
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-base px-6 py-6 w-full md:w-auto"
        onClick={() => router.push("/inspiration")}
      >
        Browse Inspiration
      </Button>
    </div>
  );
}
