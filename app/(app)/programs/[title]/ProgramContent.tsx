"use client";
import { useState, useEffect } from "react";
import { Star, Clock, MapPin, Check, X, Info, MessageSquare } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import TourPackageSchema from "@/components/seo/TourPackageSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { trackProgramView, trackBookingClick } from "@/lib/analytics";
import { getImageUrl } from "@/lib/utils";
import AddTestimonialDialog from "@/components/add-testimonial-dialog";
import { fetchProgramTestimonials, getUserTestimonial } from "@/fetch/testimonials";
import AverageRating from "@/components/review/AverageRating";
import TestimonialsWithFilters from "@/components/review/TestimonialsWithFilters";
import ReviewStatistics from "@/components/review/ReviewStatistics";
import FeaturedReviews from "@/components/review/FeaturedReviews";
import ReviewAnalytics from "@/components/review/ReviewAnalytics";
import ExportReviews from "@/components/review/ExportReviews";
import { ShareButtonCompact } from "@/components/social/ShareButtons";
import { generateProgramShareText, generateTravelHashtags } from "@/lib/social-sharing";
import { addToRecentlyViewed } from "@/lib/recently-viewed";

export default function ProgramContent({ title }: { title: string }) {
  const { data, error, isLoading } = useQuery<
    { data: dataTypeCardTravel[]; meta: meta },
    Error
  >({
    queryKey: ["fetchProgramOne", title],
    queryFn: async () => await fetchProgramOne(decodeURIComponent(title)),
  });

  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Fetch testimonials for this program
  const { data: testimonialsData, refetch: refetchTestimonials } = useQuery({
    queryKey: ["programTestimonials", data?.data?.at(0)?.documentId],
    queryFn: () => fetchProgramTestimonials(data?.data?.at(0)?.documentId || ""),
    enabled: !!data?.data?.at(0)?.documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user's existing review
  const { data: userReview } = useQuery({
    queryKey: ["userReview", data?.data?.at(0)?.documentId, user?.documentId],
    queryFn: () => getUserTestimonial(user!.documentId || "", "program", data?.data?.at(0)?.documentId || ""),
    enabled: !!user && !!data?.data?.at(0)?.documentId,
  });

  // Track program view and add to recently viewed when data loads
  useEffect(() => {
    if (data?.data?.at(0)) {
      const program = data.data.at(0);
      if (program?.title && program?.documentId) {
        trackProgramView(program.title, program.documentId);

        // Add to recently viewed with proper data structure
        const firstImage = program.images?.[0];
        const imageUrl = firstImage?.imageUrl
          ? getImageUrl(firstImage.imageUrl)
          : (firstImage ? getImageUrl(firstImage as any) : undefined);

        addToRecentlyViewed({
          id: program.id || 0,
          documentId: program.documentId,
          title: program.title,
          price: Number(program.price) || 0,
          duration: Number(program.duration) || 1,
          Location: program.Location || "Egypt",
          rating: Number(program.rating) || 5,
          imageUrl: imageUrl,
        });
      }
    }
  }, [data]);

  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const program = data?.data?.at(0);

  console.log("data : ", data);

  if (!program) return <p>Program not found</p>;

  // Handle both old format (images[].imageUrl) and new format (images[] as Media objects)
  const firstImageObj = program.images?.[0];
  const imageUrl = firstImageObj?.imageUrl
    ? getImageUrl(firstImageObj.imageUrl)
    : (firstImageObj ? getImageUrl(firstImageObj as any) : "/placeholder.svg");

  // Handle booking click - navigate to booking page
  const handleBookingClick = () => {
    if (program?.title && program?.documentId && program?.price) {
      trackBookingClick(
        program.title,
        program.documentId,
        Number(program.price)
      );
    }
    // Navigate to booking page using documentId
    window.location.href = `/programs/${program.documentId}/book`;
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
          url={`/programs/${program.documentId}`}
        />
        <BreadcrumbSchema
          items={[
            { name: "Home", url: "/" },
            { name: "Programs", url: "/programs" },
            {
              name: program.title || "Egypt Tour",
              url: `/programs/${program.documentId}`,
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
            {/* Total Duration Badge */}
            <div className="inline-block">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-amber-600/10 border border-primary/20 rounded-full">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold text-foreground">
                  Total Duration: {program.tripType === "single-day" || Number(program.duration) === 1
                    ? "1 Day"
                    : `${program.duration} Days`}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 animate-slide-up animate-delay-200">
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl border border-primary/20">
                {program.images && program.images.length > 0 ? (
                  <Image
                    src={
                      program.images?.at(activeImage)?.imageUrl
                        ? getImageUrl(program.images?.at(activeImage)?.imageUrl as string)
                        : (program.images?.at(activeImage) ? getImageUrl(program.images?.at(activeImage) as any) : "/placeholder.svg")
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
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer transition-all ${index === activeImage
                        ? "ring-2 ring-primary scale-105"
                        : "ring-1 ring-border hover:ring-primary/50"
                      }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <Image
                      src={img.imageUrl ? getImageUrl(img.imageUrl as string) : getImageUrl(img as any) || "/placeholder.svg"}
                      alt={`${program.title} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      loading="lazy"
                      quality={70}
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
                      <span className="text-lg font-bold text-foreground">
                        {program.tripType === "single-day" || Number(program.duration) === 1
                          ? "Single Day Trip"
                          : `${program.duration} Days`}
                      </span>
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

                  {/* Time Information */}
                  {program.startTime && program.endTime && (
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-500/10 rounded-xl">
                        <Clock className="w-6 h-6 text-blue-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Time</p>
                        <span className="text-lg font-bold text-foreground">
                          {program.startTime} - {program.endTime}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Meeting Point */}
                  {program.meetingPoint && (
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-green-500/10 rounded-xl">
                        <MapPin className="w-6 h-6 text-green-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Meeting Point</p>
                        <span className="text-sm font-medium text-foreground">{program.meetingPoint}</span>
                      </div>
                    </div>
                  )}

                  {/* Departure Location */}
                  {program.departureLocation && (
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                        <MapPin className="w-6 h-6 text-indigo-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Departure Location</p>
                        <span className="text-sm font-medium text-foreground">{program.departureLocation}</span>
                      </div>
                    </div>
                  )}

                  {/* Return Location */}
                  {program.returnLocation && (
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-purple-500/10 rounded-xl">
                        <MapPin className="w-6 h-6 text-purple-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Return Location</p>
                        <span className="text-sm font-medium text-foreground">{program.returnLocation}</span>
                      </div>
                    </div>
                  )}

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

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-2xl text-lg py-6 hover:scale-105 transition-transform font-semibold"
                  onClick={handleBookingClick}
                >
                  Book This Experience
                </Button>

                {/* Share Button */}
                <div className="flex justify-center">
                  <ShareButtonCompact
                    shareOptions={{
                      title: program.title || "Amazing Travel Experience",
                      text: generateProgramShareText(
                        program.title || "Travel Program",
                        Number(program.price),
                        Number(program.rating)
                      ),
                      url: typeof window !== "undefined" ? window.location.href : "",
                      hashtags: generateTravelHashtags(program.Location),
                      via: "ZoeHolidays",
                    }}
                    shareConfig={{
                      contentType: "program",
                      contentId: program.documentId || "",
                      contentTitle: program.title || "Travel Program",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12 animate-slide-up animate-delay-300">
            <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-primary to-amber-600 rounded-xl">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    Travel Itinerary
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {program.content_steps?.length} amazing destinations to explore
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-primary/20 border border-primary/30 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-base font-bold text-foreground">
                    Total: {program.tripType === "single-day" || Number(program.duration) === 1 ? "1 Day" : `${program.duration} Days`}
                  </span>
                </div>
              </div>

              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[19px] md:left-[23px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-amber-500 to-primary/20" />

                <ol className="space-y-6 md:space-y-8">
                  {program.content_steps &&
                    program.content_steps.map((step: ContentStep, index: number) => {
                      // Try to get image from step - check both image object and imageUrl
                      const stepImage = step.image || step.imageUrl || null;
                      const imageUrl = stepImage ? getImageUrl(stepImage) : null;

                      return (
                        <li
                          key={index}
                          className="relative pl-12 md:pl-16 group animate-slide-up"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {/* Timeline dot */}
                          <div className="absolute left-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-primary to-amber-600 text-white font-bold text-base md:text-lg shadow-lg z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            {index + 1}
                          </div>

                          <div className="bg-gradient-to-br from-background via-background/90 to-primary/5 rounded-xl border border-primary/10 overflow-hidden hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group-hover:translate-x-2">
                            {/* Image header if available */}
                            {imageUrl && (
                              <div className="relative w-full h-48 md:h-64 overflow-hidden bg-gradient-to-br from-primary/5 to-amber-500/5">
                                <Image
                                  src={imageUrl}
                                  alt={step.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                  loading="lazy"
                                  quality={80}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />

                                {/* Day badge on image */}
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                  Day {index + 1}
                                </div>

                                {/* Price badge if available */}
                                {step.price && (
                                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-primary/20">
                                    ${step.price}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="p-5 md:p-6">
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {!imageUrl && (
                                      <span className="px-3 py-1 bg-gradient-to-r from-primary/10 to-amber-600/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                                        Day {index + 1}
                                      </span>
                                    )}
                                  </div>

                                  <h3 className="text-foreground font-bold text-xl md:text-2xl mb-3 group-hover:text-primary transition-colors leading-tight">
                                    {step.title}
                                  </h3>

                                  {/* Show subcategory info if available */}
                                  {step.place_to_go_subcategories && step.place_to_go_subcategories.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 bg-muted/30 px-3 py-2 rounded-lg w-fit">
                                      <MapPin className="h-4 w-4 text-primary" />
                                      <span className="font-medium">
                                        {step.place_to_go_subcategories.at(-1)?.categoryName || "Egypt"}
                                      </span>
                                      {step.place_to_go_subcategories.at(-1)?.place_to_go_categories?.at(-1)?.categoryName && (
                                        <>
                                          <span className="text-muted-foreground/50">•</span>
                                          <span>
                                            {step.place_to_go_subcategories.at(-1)?.place_to_go_categories?.at(-1)?.categoryName}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="hover:bg-primary/10 hover:border-primary/50 transition-all flex-shrink-0 h-9 w-9 md:h-10 md:w-10"
                                      >
                                        <Info className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                        <span className="sr-only text-muted">More info</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs p-4 text-muted">
                                      <p className="font-semibold mb-2 text-base !text-muted">{step.title}</p>
                                      {imageUrl && (
                                        <div className="relative w-[200px] h-[130px] mb-2 rounded-md overflow-hidden">
                                          <Image
                                            src={getImageUrl(imageUrl)}
                                            alt={step.title}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                      )}
                                      {step.place_to_go_subcategories &&
                                        step.place_to_go_subcategories.length > 0 && (
                                          <a
                                            href={`/placesTogo/${step.place_to_go_subcategories
                                                .at(-1)
                                                ?.place_to_go_categories?.at(-1)
                                                ?.categoryName || ""
                                              }/${step.place_to_go_subcategories.at(-1)
                                                ?.categoryName || ""
                                              }/${step.title}`}
                                            className="inline-flex items-center gap-1 text-muted hover:underline text-sm mt-2 font-medium"
                                          >
                                            Explore this destination
                                            <MapPin className="h-3 w-3" />
                                          </a>
                                        )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ol>
              </div>

              {/* Summary footer */}
              <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">
                    Total duration: <span className="font-bold text-foreground">{program.duration} {Number(program.duration) === 1 ? 'Day' : 'Days'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm">
                    <span className="font-bold text-foreground">{program.content_steps?.length}</span> destinations
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12 animate-slide-up animate-delay-400">
            <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Overview
              </h2>
              <div
                className="text-muted-foreground text-lg leading-relaxed prose prose-slate dark:prose-invert max-w-none [&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4 [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg [&>strong]:font-bold [&>em]:italic"
                dangerouslySetInnerHTML={{ __html: program.overView || program.descraption || 'No overview available' }}
              />
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

          {/* Testimonials & Reviews Section */}
          <div className="mt-12 animate-slide-up animate-delay-600">
            <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-primary to-amber-600 rounded-xl">
                    <MessageSquare className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                      Reviews & Testimonials
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {testimonialsData?.data && testimonialsData.data.length > 0
                        ? `${testimonialsData.data.length} ${testimonialsData.data.length === 1 ? 'review' : 'reviews'} from our travelers`
                        : "Be the first to share your experience"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {testimonialsData?.data && testimonialsData.data.length > 0 && (
                    <ExportReviews
                      testimonials={testimonialsData.data}
                      programTitle={program?.title}
                    />
                  )}
                  <AddTestimonialDialog
                    isOpen={isReviewDialogOpen}
                    onClose={() => setIsReviewDialogOpen(false)}
                    testimonialType="program"
                    relatedId={program?.documentId}
                    relatedName={program?.title}
                    existingTestimonial={userReview || undefined}
                    queryKey={["programTestimonials", program?.documentId || ""]}
                  />
                  <Button
                    onClick={() => setIsReviewDialogOpen(true)}
                    className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {userReview ? "Edit Review" : "Write a Review"}
                  </Button>
                </div>
              </div>

              {testimonialsData?.data && testimonialsData.data.length > 0 ? (
                <>
                  {/* Statistics */}
                  <ReviewStatistics testimonials={testimonialsData.data} className="mb-8" />

                  {/* Average Rating & Distribution */}
                  <AverageRating testimonials={testimonialsData.data} className="mb-8" />

                  {/* Featured Reviews */}
                  {testimonialsData.data.length >= 3 && (
                    <FeaturedReviews testimonials={testimonialsData.data} className="mb-8" />
                  )}

                  {/* All Reviews with Filters */}
                  <div className="pt-6 border-t border-primary/10">
                    <h3 className="text-xl font-bold mb-6">All Reviews</h3>
                    <TestimonialsWithFilters
                      testimonials={testimonialsData.data}
                      showRelatedContent={false}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-xl bg-muted/20">
                  <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to share your experience with this amazing program!
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setIsReviewDialogOpen(true)}
                    className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 gap-2"
                  >
                    <Star className="w-5 h-5" />
                    Write the First Review
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
