"use client";
import { useState, useEffect } from "react";
import { Star, Clock, MapPin, Check, X, Info } from "lucide-react";
import { fetchProgramOne } from "@/fetch/programs";
import { dataTypeCardTravel, ContentStep, Media } from "@/type/programs";
import { useQuery } from "@tanstack/react-query";
import { meta } from "@/type/placesToGo";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import TourPackageSchema from "@/components/seo/TourPackageSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { trackProgramView, trackBookingClick } from "@/lib/analytics";
import { getImageUrl } from "@/lib/utils";
import BookingDialog from "@/components/booking-dialog";

export default function ProgramContent({ title }: { title: string }) {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const { data, error, isLoading } = useQuery<
    { data: dataTypeCardTravel[]; meta: meta },
    Error
  >({
    queryKey: ["fetchProgramOne", title],
    queryFn: async () => await fetchProgramOne(decodeURIComponent(title)),
  });

  const [activeImage, setActiveImage] = useState(0);

  // Track program view when data loads
  useEffect(() => {
    if (data?.data?.at(0)) {
      const program = data.data.at(0);
      if (program?.title && program?.documentId) {
        trackProgramView(program.title, program.documentId);
      }
    }
  }, [data]);

  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const program = data?.data?.at(0);

  console.log("data : ", data);

  if (!program) return <p>Program not found</p>;

  const imageUrl = program.images?.[0]?.imageUrl || "/placeholder.svg";

  // Handle booking click
  const handleBookingClick = () => {
    if (program?.title && program?.documentId && program?.price) {
      trackBookingClick(
        program.title,
        program.documentId,
        Number(program.price)
      );
    }
    // Open booking dialog
    setIsBookingDialogOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
        </div>
      <TourPackageSchema
        name={program.title || "Egypt Tour"}
        description={
          program.descraption || program.overView || "Discover Egypt"
        }
        image={imageUrl}
        price={Number(program.price) || 0}
        duration={Number(program.duration) || 1}
        location={program.Location || "Egypt"}
        rating={Number(program.rating) || 5}
        url={`/programs/${encodeURIComponent(title)}`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Programs", url: "/programs" },
          {
            name: program.title || "Egypt Tour",
            url: `/programs/${encodeURIComponent(title)}`,
          },
        ]}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl mb-[60px] relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full border border-primary/20">
              ✨ Curated Travel Experience
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            {program.title}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12 animate-slide-up animate-delay-200">
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl border border-primary/20">
              {program.images && program.images.length > 0 ? (
                <Image
                  src={
                    getImageUrl(program.images?.at(activeImage)?.imageUrl) ||
                    "/placeholder.svg"
                  }
                  alt={`${program.title} - Image ${activeImage + 1}`}
                  fill
                  className="object-cover transition-opacity duration-500"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {program.images?.map((img, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer transition-all ${
                    index === activeImage
                      ? "ring-2 ring-primary scale-105"
                      : "ring-1 ring-border hover:ring-primary/50"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={getImageUrl(img.imageUrl) || "/placeholder.svg"}
                    alt={`${program.title} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-6 shadow-xl">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">{program.descraption}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <MapPin className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Location</p>
                    <span className="text-lg font-bold text-foreground">{program.Location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl">
                    <Clock className="w-6 h-6 text-amber-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Duration</p>
                    <span className="text-lg font-bold text-foreground">{program.duration} {Number(program.duration) === 1 ? 'Day' : 'Days'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-yellow-400/10 rounded-xl">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Rating</p>
                    <span className="text-lg font-bold text-foreground">{program.rating} / 5</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary/10">
                  <p className="text-xs text-muted-foreground font-semibold mb-2">Total Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                      ${Number(program.price).toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">per person</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-2xl text-lg py-6 hover:scale-105 transition-transform font-semibold"
              onClick={handleBookingClick}
            >
              Book This Experience
            </Button>
          </div>
        </div>

        <div className="mb-12 animate-slide-up animate-delay-300">
          <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
              Travel Itinerary
            </h2>
            <ol className="space-y-4">
              {program.content_steps &&
                program.content_steps.map((step: ContentStep, index: number) => (
                  <li key={index} className="flex items-center justify-start gap-4 p-4 bg-background/50 rounded-xl border border-primary/10 hover:border-primary/30 transition-all">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary to-amber-600 text-white font-bold text-lg flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-foreground font-semibold text-lg flex-1">{step.title}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="hover:bg-primary/10 hover:border-primary/50 transition-all">
                            <Info className="h-5 w-5 text-primary" />
                            <span className="sr-only">More info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="!text-secondary">{step.title}</p>
                          {step.imageUrl && (
                            <div className="relative w-[150px] h-[100px]">
                              <Image
                                src={step.imageUrl}
                                alt={step.title}
                                fill
                                className="object-cover rounded-xl"
                              />
                            </div>
                          )}
                          {step.place_to_go_subcategories &&
                            step.place_to_go_subcategories.length > 0 && (
                              <a
                                href={`/placesTogo/${
                                  step.place_to_go_subcategories
                                    .at(-1)
                                    ?.place_to_go_categories?.at(-1)
                                    ?.categoryName || ""
                                }/${
                                  step.place_to_go_subcategories.at(-1)
                                    ?.categoryName || ""
                                }/${step.title}`}
                                className="text-blue-500 hover:underline"
                              >
                                More Info
                              </a>
                            )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                ))}
            </ol>
          </div>
        </div>

        <div className="mb-12 animate-slide-up animate-delay-400">
          <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
              Overview
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{program.overView}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 animate-slide-up animate-delay-500">
          <div className="bg-gradient-to-br from-green-500/5 to-card border border-green-500/20 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Check className="w-6 h-6 text-green-600" aria-hidden="true" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                What&apos;s Included
              </span>
            </h2>
            <ul className="space-y-3">
              {program.includes?.map((item: { id: number; title: string }) => (
                <li key={item.id} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-green-500/10">
                  <Check
                    className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-foreground font-medium">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-red-500/5 to-card border border-red-500/20 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <X className="w-6 h-6 text-red-600" aria-hidden="true" />
              </div>
              <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                What&apos;s Excluded
              </span>
            </h2>
            <ul className="space-y-3">
              {program.excludes?.map((item: { id: number; title: string }) => (
                <li key={item.id} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-red-500/10">
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-foreground font-medium">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </div>

      {/* Booking Dialog */}
      {program && program.documentId && program.title && (
        <BookingDialog
          isOpen={isBookingDialogOpen}
          onClose={() => setIsBookingDialogOpen(false)}
          program={{
            documentId: program.documentId,
            title: program.title,
            price: Number(program.price) || 0,
            duration: Number(program.duration) || 0,
          }}
        />
      )}
    </>
  );
}
