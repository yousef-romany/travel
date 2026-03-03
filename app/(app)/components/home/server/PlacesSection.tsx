import Link from "next/link";
import Image from "next/image";
import { MapPin, Compass, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";

import PlacesCarousel from "../client/PlacesCarousel";

interface PlaceCategory {
  id: number;
  documentId?: string;
  categoryName: string;
  description?: string;
  image: any;
}

interface PlacesSectionProps {
  categories: PlaceCategory[];
}

/**
 * Places to Go Section - Server Component
 * Renders place category cards with a custom automated carousel design.
 */
export default function PlacesSection({ categories }: PlacesSectionProps) {
  return (
    <section
      id="places-to-go"
      className="py-16 sm:py-24 bg-background/50 !w-full px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center mb-12 sm:mb-16 text-center animate-on-scroll">
        <div className="inline-flex items-center justify-center px-4 py-1.5 bg-primary/10 text-primary rounded-full mb-6 font-semibold text-sm tracking-wide uppercase shadow-sm gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          Unforgettable Adventures Await
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Discover Egypt's Hidden Treasures
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl font-medium px-4">
          Journey through millennia of wonder, where ancient mysteries meet modern luxury. 
          Experience the magic of the Nile, the grandeur of pyramids, and the warmth of Egyptian hospitality 
          on adventures crafted exclusively for discerning travelers.
        </p>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <PlacesCarousel categories={categories} />
      </div>

      <div className="flex justify-center mt-12 sm:mt-16 relative z-10">
        <Link href="/placesTogo">
          <Button
            variant="outline"
            size="lg"
            className="gap-3 text-base font-semibold px-8 py-6 rounded-full border border-amber-600/30 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl"
          >
            <Compass className="h-5 w-5" aria-hidden="true" />
            View All Destinations
          </Button>
        </Link>
      </div>
    </section>
  );
}
