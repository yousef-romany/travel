import Link from "next/link";
import Image from "next/image";
import { MapPin, Compass, ArrowRight } from "lucide-react";
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
      className="bg-[#111111] !w-full relative overflow-hidden flex flex-col justify-center min-h-[100dvh]"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full h-full relative z-10">
        <PlacesCarousel categories={categories} />
      </div>
    </section>
  );
}
