import Link from "next/link";
import Image from "next/image";
import { MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
 * Renders place category cards with SEO-friendly links
 */
export default function PlacesSection({ categories }: PlacesSectionProps) {
  return (
    <section
      id="places-to-go"
      className="py-12 sm:py-16 lg:py-20 bg-secondary/50 !w-full px-4 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
        <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-3 sm:mb-4">
          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
          Places to Go
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
          Explore the most iconic destinations across Egypt
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <article key={category.id} className="overflow-hidden group hover-lift animate-on-scroll">
              <Card className="h-full">
                <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                  <Image
                    src={getImageUrl(category.image)}
                    alt={`${category.categoryName} - Egypt destination`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 25vw"
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>
                <CardContent className="p-4 sm:p-5 text-center">
                  <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">
                    {category.categoryName}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                    {category.description || "Discover amazing places"}
                  </p>
                  <Link href={`/placesTogo/${category.categoryName}`}>
                    <Button variant="outline" size="sm" className="!w-full transition-smooth hover-glow text-xs sm:text-sm">
                      Explore
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No destinations available</p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8 sm:mt-10">
        <Link href="/placesTogo">
          <Button variant="outline" size="lg" className="gap-2 text-sm sm:text-base">
            View All Destinations
            <Compass className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
