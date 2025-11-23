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
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
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

      <div className="container mx-auto px-4 py-8 max-w-6xl mb-[60px]">
        <h1 className="text-4xl font-bold mb-6 text-primary">
          {program.title}
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              {program.images && (
                <Image
                  src={
                    getImageUrl(program.images?.at(activeImage)?.imageUrl) ||
                    "/placeholder.svg"
                  }
                  alt={`${program.title} - Image ${activeImage + 1}`}
                  fill
                  className="object-cover transition-opacity duration-500"
                />
              )}
            </div>
            <div className="flex space-x-2">
              {program.images?.map((img, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer ${
                    index === activeImage ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={getImageUrl(img.imageUrl) || "/placeholder.svg"}
                    alt={`${program.title} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-primary">{program.descraption}</p>
            <div className="flex items-center space-x-4 text-primary text-[1.4rem] font-bold">
              <MapPin className="w-[1.4rem] h-[1.4rem]" aria-hidden="true" />
              <span>{program.Location}</span>
            </div>
            <div className="flex items-center space-x-4 text-primary text-[1.4rem] font-bold">
              <Clock className="w-[1.4rem] h-[1.4rem]" aria-hidden="true" />
              <span className="">{program.duration} days</span>
            </div>
            <div className="text-[1.4rem] font-bold text-primary">
              $ {Number(program.price).toFixed(2)}
            </div>
            <div className="flex items-center space-x-2 text-[1.4rem]">
              <Star
                className="w-[1.4rem] h-[1.4rem] text-yellow-400 fill-current"
                aria-hidden="true"
              />
              <span className="text-primary">{program.rating} / 5</span>
            </div>
            <Button size="lg" className="w-full" onClick={handleBookingClick}>
              Book Now
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Travel Itinerary
          </h2>
          <ol className="space-y-4">
            {program.content_steps &&
              program.content_steps.map((step: ContentStep, index: number) => (
                <li key={index} className="flex items-center justify-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold mr-4">
                    {index + 1}
                  </span>
                  <span className="text-primary font-bold">{step.title}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="ml-2">
                          <Info className="h-[1.4rem] w-[1.4rem] text-primary" />
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

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Overview</h2>
          <p className="text-primary">{program.overView}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              What&apos;s Included
            </h2>
            <ul className="space-y-2">
              {program.includes?.map((item: { id: number; title: string }) => (
                <li key={item.id} className="flex items-center text-primary">
                  <Check
                    className="w-5 h-5 text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              What&apos;s Excluded
            </h2>
            <ul className="space-y-2">
              {program.excludes?.map((item: { id: number; title: string }) => (
                <li key={item.id} className="flex items-center text-primary">
                  <X className="w-5 h-5 text-red-500 mr-2" aria-hidden="true" />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
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
