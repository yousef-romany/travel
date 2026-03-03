import Link from "next/link";
import { Ticket, Star, Clock, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function ProgramsSection({ programs }: ProgramsSectionProps) {
  return (
    <section id="programs" className="py-16 sm:py-24 bg-gradient-to-b from-background to-secondary/20 !w-full px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12 sm:mb-16 text-center animate-on-scroll">
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-primary/10 text-primary rounded-full mb-6 font-semibold text-sm tracking-wide uppercase shadow-sm gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Curated Experiences
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Featured Programs
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl font-medium px-4">
            Immerse yourself in authentic Egyptian journeys, meticulously crafted for the modern traveler seeking luxury and adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {programs && programs.length > 0 ? (
            programs.map((program, index) => (
              <article
                key={program.id}
                className="group relative flex flex-col bg-card/60 backdrop-blur-xl border border-border/40 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 ease-out hover:-translate-y-2 animate-on-scroll"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative p-3">
                  <div className="relative h-56 sm:h-64 rounded-3xl overflow-hidden shadow-inner isolate z-10">
                    {program.images && program.images.length > 0 ? (
                      <ProgramCarousel images={program.images as []} />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <MapPin className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    )}

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                      {index === 0 && (
                        <div className="bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 select-none">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                          Best Seller
                        </div>
                      )}
                      {index === 2 && (
                        <div className="bg-rose-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg select-none">
                          New Arrival
                        </div>
                      )}
                    </div>

                    {/* Rating Badge */}
                    {program.rating && (
                      <div className="absolute bottom-4 right-4 z-20 bg-black/50 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg select-none transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-sm leading-none pt-0.5">{program.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-6 pt-4 relative z-20">
                  {program.Location && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                      <MapPin className="h-3.5 w-3.5" />
                      {program.Location}
                    </div>
                  )}

                  <h3 className="font-bold text-xl sm:text-2xl text-foreground mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
                    {program.title}
                  </h3>

                  <p className="text-sm text-muted-foreground/80 mb-6 line-clamp-2 leading-relaxed">
                    {program.descraption || program.overView || "Experience the timeless wonders of Egypt with this meticulously planned itinerary."}
                  </p>

                  <div className="flex items-center gap-4 text-sm font-medium text-foreground/80 mb-8 p-3 bg-secondary/50 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{program.duration ? `${program.duration} Days` : 'Flexible'}</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 pt-4 border-t border-border/50">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold block mb-1">PRICE STARTING FROM</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-foreground">
                            ${program.price}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/programs/${program.documentId}`}
                        className="w-full sm:w-auto"
                      >
                        <Button className="w-full sm:w-auto bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-full px-6 py-5 shadow-xl transition-all duration-300 group/btn font-semibold">
                          Explore
                          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>

                    <div className="mt-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
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
                        className="w-full rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary"
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-muted/20 border border-dashed rounded-[3rem]">
              <Ticket className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg font-medium">We're updating our beautiful programs for you.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-16 sm:mt-20">
          <Link href="/programs">
            <Button
              variant="outline"
              size="lg"
              className="gap-3 text-base font-semibold px-8 py-6 rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl group"
            >
              Discover All Programs
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
