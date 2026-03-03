import Link from "next/link";
import Image from "next/image";
import { MapPin, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";

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
 * Renders place category cards with a dynamic Bento Grid and hover effects.
 */
export default function PlacesSection({ categories }: PlacesSectionProps) {
  // Determine layout classes based on index for the bento grid effect
  const getBentoClasses = (index: number) => {
    // A 4-column, 2-row grid design for the first 5 items
    // This creates a nice asymmetrical magazine style layout
    switch (index % 5) {
      case 0:
        return "md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[500px]"; // Large featured block
      case 1:
        return "md:col-span-2 md:row-span-1 min-h-[250px]"; // Wide horizontal block
      case 2:
        return "md:col-span-1 md:row-span-1 min-h-[250px]"; // Standard box
      case 3:
        return "md:col-span-1 md:row-span-1 min-h-[250px]"; // Standard box
      case 4:
        return "md:col-span-full min-h-[300px]"; // Full width panorama
      default:
        return "md:col-span-1 md:row-span-1 min-h-[250px]";
    }
  };

  return (
    <section
      id="places-to-go"
      className="py-16 sm:py-24 bg-background !w-full px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center mb-12 sm:mb-16 text-center animate-on-scroll relative z-10">
        <div className="inline-flex items-center justify-center p-2.5 bg-primary/10 rounded-2xl mb-4 sm:mb-6 rotate-3 transform-gpu">
          <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-primary -rotate-3" aria-hidden="true" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 tracking-tight px-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Unmissable Destinations
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl px-4 font-medium">
          Discover handpicked locations that showcase the true magic and timeless heritage of Egypt.
        </p>
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-fr gap-4 sm:gap-6">
            {categories.slice(0, 8).map((category, index) => (
              <article
                key={category.id}
                className={`relative overflow-hidden rounded-3xl group animate-on-scroll shadow-lg ${getBentoClasses(index)}`}
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={getImageUrl(category.image)}
                    alt={`${category.categoryName} - Egypt destination`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                </div>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/80 z-10 transition-opacity duration-500 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 h-3/4 mt-auto transition-all duration-500 translate-y-8 group-hover:translate-y-0" />

                <div className="absolute inset-0 z-20 p-6 sm:p-8 flex flex-col justify-end">
                  <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-4">
                    <h3 className="font-bold text-2xl sm:text-3xl text-white mb-2 leading-tight drop-shadow-md">
                      {category.categoryName}
                    </h3>
                    <div className="overflow-hidden h-0 group-hover:h-auto group-hover:mt-3 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                      <p className="text-sm sm:text-base text-white/90 line-clamp-2 md:line-clamp-3 mb-5 font-medium">
                        {category.description || `Experience the wonders and breathtaking sights of ${category.categoryName}.`}
                      </p>
                      <Link href={`/placesTogo/${category.categoryName}`}>
                        <Button
                          variant="default"
                          className="bg-white text-black hover:bg-white/90 rounded-full font-semibold px-6 shadow-xl gap-2 group/btn"
                        >
                          Explore Now
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 border border-dashed rounded-3xl">
            <p className="text-muted-foreground text-lg">No destinations available at the moment.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-12 sm:mt-16 relative z-10">
        <Link href="/placesTogo">
          <Button
            variant="outline"
            size="lg"
            className="gap-3 text-base font-semibold px-8 py-6 rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl"
          >
            <Compass className="h-5 w-5" aria-hidden="true" />
            View All Destinations
          </Button>
        </Link>
      </div>
    </section>
  );
}
