import Link from "next/link";
import { Ticket, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgramCarousel } from "../../../programs/components/ProgramCarousel";
import { CompareButton } from "@/components/programs/CompareButton";
import { getImageUrl } from "@/lib/utils";

interface Program {
  id: number;
  documentId: string;
  title: string;
  descraption?: string;
  overView?: string;
  price: number;
  duration?: number;
  rating?: number;
  Location?: string;
  images?: any[];
}

interface ProgramsSectionProps {
  programs: Program[];
}

/**
 * Programs Section - Server Component
 * Renders tour program cards with SEO-friendly content
 */
export default function ProgramsSection({ programs }: ProgramsSectionProps) {
  return (
    <section id="programs" className="py-12 sm:py-16 lg:py-20 bg-secondary/50 !w-full px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
        <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-3 sm:mb-4">
          <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Programs</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
          Curated experiences to make your Egyptian journey unforgettable
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {programs && programs.length > 0 ? (
          programs.map((program, index) => (
            <article key={program.id} className="overflow-hidden group hover-lift animate-on-scroll border-primary/10 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <Card className="h-full flex flex-col">
                <div className="relative">
                  <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                    {program.images && program.images.length > 0 && (
                      <ProgramCarousel images={program.images as []} />
                    )}
                  </div>
                  {index === 0 && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-primary to-amber-500 text-primary-foreground px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-pulse">
                      Best Seller
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-pulse">
                      New
                    </div>
                  )}
                </div>
                <CardContent className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <h3 className="font-bold text-lg sm:text-xl line-clamp-1 group-hover:text-primary transition-colors">
                      {program.title}
                    </h3>
                    {program.rating && (
                      <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md">
                        <Star
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                        <span className="font-bold text-sm sm:text-base">{program.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-2">
                    {program.descraption || program.overView || "Explore Egypt with this amazing tour"}
                  </p>
                  {program.duration && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 bg-muted/30 p-2 rounded-lg w-fit">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{program.duration} days adventure</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-4 mt-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-t border-border/50 pt-4">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-0.5">Starting from</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-bold text-primary">
                            ${program.price}
                          </span>
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            / person
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/programs/${program.documentId}`}
                        className="w-full sm:w-auto"
                      >
                        <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 transition-all duration-300">
                          View Details
                        </Button>
                      </Link>
                    </div>
                    <CompareButton
                      program={{
                        id: program.id,
                        documentId: program.documentId,
                        title: program.title,
                        price: program.price,
                        duration: program.duration || 1,
                        Location: program.Location || "Egypt",
                        rating: program.rating || 0,
                        descraption: program.descraption || program.overView || "",
                        imageUrl: program.images?.[0] ? getImageUrl(program.images[0] as any) : undefined
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-full border border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                    />
                  </div>
                </CardContent>
              </Card>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No programs available</p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8 sm:mt-10">
        <Link href="/programs">
          <Button variant="outline" size="lg" className="gap-2 text-sm sm:text-base">
            View All Programs
            <Ticket className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
