"use client";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";
import { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Compass,
  Heart,
  Instagram,
  MapPin,
  Palmtree,
  Play,
  Plane,
  Star,
  Ticket,
  AlertCircle,
} from "lucide-react";
import { ProgramCarousel } from "./programs/components/ProgramCarousel";
import { useQuery } from "@tanstack/react-query";
import { fetchHomePageData, type Program } from "@/fetch/homepage";
import {
  InspireSectionSkeleton,
  PlacesSectionSkeleton,
  ProgramsSectionSkeleton,
  InstagramSectionSkeleton,
} from "@/components/skeletons/HomeSkeletons";
import {
  trackProgramView,
  trackSocialShare,
  trackHeroCTA,
  trackButtonClick,
  trackCardClick,
} from "@/lib/analytics";
import { getImageUrl } from "@/lib/utils";
import { BackgroundVideo } from "@/components/ui/background-video";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Testimonials from "@/components/testimonials";
import { fetchApprovedTestimonials } from "@/fetch/testimonials";
import { MessageSquare } from "lucide-react";
import { InstagramPostItem } from "@/components/instagram-post-item";
import InstagramModal from "@/components/InstagramModal";

// Helper function to get stagger delay class
const getStaggerDelay = (index: number): string => {
  const delay = Math.min(index * 100, 800);
  const delayClasses = {
    0: "animate-delay-0",
    100: "animate-delay-100",
    200: "animate-delay-200",
    300: "animate-delay-300",
    400: "animate-delay-400",
    500: "animate-delay-500",
    600: "animate-delay-600",
    700: "animate-delay-700",
    800: "animate-delay-800",
  } as const;
  return delayClasses[delay as keyof typeof delayClasses] || "animate-delay-0";
};

// Egypt travel videos from Cloudinary
const HERO_VIDEOS = [
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922614/Egypt_Unmatched_Diversity_fbtjmf.mp4",
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922583/Let_s_Go_-_Egypt_A_Beautiful_Destinations_Original_1_ayt7re.mp4",
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922572/This_is_Egypt_x6b0oo.mp4",
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922524/Escape_to_Egypt_Cinematic_Film_lfq32y.mp4",
];

export default function HomeContent() {
  const sectionsRef = useRef<HTMLElement[]>([]);

  // Fetch homepage data with React Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["homepageData"],
    queryFn: fetchHomePageData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Fetch testimonials
  const { data: testimonialsData, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["approvedTestimonials"],
    queryFn: () => fetchApprovedTestimonials(6), // Get 6 latest testimonials
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  useEffect(() => {
    applyHieroglyphEffect();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Trigger scroll animations when data loads
  useScrollAnimation([data]);

  // Program view tracking
  const handleProgramClick = useCallback((program: Program) => {
    trackProgramView(program.title, program.documentId);
  }, []);

  // Instagram click tracking
  const handleInstagramClick = useCallback((postId: string) => {
    trackSocialShare("Instagram", "video", postId);
  }, []);

  return (
    <div className="!w-full flex-1">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
      </div>
      {/* Hero Section with Background Video */}
      <section className="relative h-[95.5vh] sm:h-[95.5vh] overflow-hidden !w-full">
        <BackgroundVideo
          videos={HERO_VIDEOS}
          priority
          autoRotate
          rotationInterval={30000}
        >
          <div className="flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 md:px-8 h-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 drop-shadow-lg animate-slide-up max-w-4xl">
              Discover the Magic of Egypt
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mb-6 sm:mb-8 drop-shadow-md animate-slide-up animate-delay-200 px-2">
              Experience 7,000 years of history, culture, and adventure
            </p>
            <Link
              href="/programs"
              className="animate-slide-up animate-delay-400"
              onClick={() => trackHeroCTA("Start Your Journey", "/programs")}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6"
              >
                Start Your Journey
              </Button>
            </Link>
          </div>
        </BackgroundVideo>
      </section>

      {/* Be Inspired Section */}
      <section id="be-inspired" className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
          <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-3 sm:mb-4">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Be Inspired</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
            Discover the wonders that await you in the land of the pharaohs
          </p>
        </div>

        {isLoading ? (
          <InspireSectionSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-muted-foreground">
              Failed to load inspiration stories
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="!w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {data?.inspireBlogs.map((blog, index) => {
              const image = blog.image;

              return (
                <Card key={blog.id} className={`overflow-hidden group hover-lift animate-on-scroll ${getStaggerDelay(index)}`}>
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <Image
                      src={getImageUrl(image)}
                      alt={`${blog.title} - Egypt travel inspiration`}
                      fill
                      className="object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    {image?.formats?.large?.url}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white line-clamp-2">
                        {blog.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-6">
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                      {blog.details?.replace(/<[^>]*>/g, "") ||
                        "Explore amazing destinations"}
                    </p>
                    <Link
                      href={`/inspiration/${blog.documentId}`}
                      className="text-primary font-medium hover:underline inline-flex items-center transition-smooth text-sm sm:text-base"
                      onClick={() => trackCardClick("Inspiration Blog", blog.title, blog.documentId, index)}
                    >
                      Learn more{" "}
                      <Compass className="ml-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-8 sm:mt-10">
          <Link href="/inspiration" onClick={() => trackButtonClick("View All Stories", "Home Page - Be Inspired", "/inspiration")}>
            <Button variant="outline" size={"lg"} className="gap-2 text-sm sm:text-base">
              View All Stories
              <Heart className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Places to Go Section */}
      <section
        id="places-to-go"
        className="py-12 sm:py-16 lg:py-20 bg-secondary/50 !w-full px-4 sm:px-6 md:px-8 lg:px-12"
      >
        <div className="">
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

          {isLoading ? (
            <PlacesSectionSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-muted-foreground">
                Failed to load destinations
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {data?.placeCategories.map((category, index) => (
                <Card key={category.id} className={`overflow-hidden group hover-lift animate-on-scroll ${getStaggerDelay(index)}`}>
                  <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                    <Image
                      src={getImageUrl(category.image)}
                      alt={`${category.categoryName} - Egypt destination`}
                      fill
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
                    <Link
                      href={`/placesTogo/${category.categoryName}`}
                      onClick={() => trackCardClick("Place Category", category.categoryName, category.documentId || category.id.toString(), index)}
                    >
                      <Button variant="outline" size="sm" className="!w-full transition-smooth hover-glow text-xs sm:text-sm">
                        Explore
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8 sm:mt-10">
            <Link href="/placesTogo" onClick={() => trackButtonClick("View All Destinations", "Home Page - Places to Go", "/placesTogo")}>
              <Button variant="outline" size={"lg"} className="gap-2 text-sm sm:text-base">
                View All Destinations
                <Compass className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Plan Your Trip Section */}
      <section id="plan-your-trip" className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
          <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-3 sm:mb-4">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            Plan Your Trip
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
            Everything you need to create your perfect Egyptian adventure
          </p>
        </div>

        <Tabs defaultValue="when-to-go" className="!w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 h-auto gap-1 sm:gap-0">
            <TabsTrigger value="when-to-go" className="py-2 sm:py-3 text-xs sm:text-sm">
              When to Go
            </TabsTrigger>
            <TabsTrigger value="getting-around" className="py-2 sm:py-3 text-xs sm:text-sm">
              Getting Around
            </TabsTrigger>
            <TabsTrigger value="accommodation" className="py-2 sm:py-3 text-xs sm:text-sm">
              Accommodation
            </TabsTrigger>
            <TabsTrigger value="travel-tips" className="py-2 sm:py-3 text-xs sm:text-sm">
              Travel Tips
            </TabsTrigger>
          </TabsList>
          <TabsContent value="when-to-go" className="mt-4 sm:mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                  Best Time to Visit Egypt
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  The best time to visit Egypt is from October to April, when
                  temperatures are cooler. December and January are peak tourist
                  months.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-accent p-1.5 rounded-full text-primary mt-0.5">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">October to April</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Ideal weather for sightseeing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-accent p-1.5 rounded-full text-primary mt-0.5">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">May to September</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Hot weather, good for beach destinations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1764619947/Pyramids_Egypt_wobalm.jpg"
                  alt="Best seasons to visit Egypt"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="getting-around" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Transportation in Egypt
                </h3>
                <p className="text-muted-foreground mb-4">
                  Egypt offers various transportation options from domestic
                  flights to trains and Nile cruises.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-accent p-1.5 rounded-full text-primary mt-0.5">
                      <Plane className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium">Domestic Flights</h4>
                      <p className="text-sm text-muted-foreground">
                        Quick connections between major cities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-accent p-1.5 rounded-full text-primary mt-0.5">
                      <Palmtree className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium">Nile Cruises</h4>
                      <p className="text-sm text-muted-foreground">
                        Scenic travel between Luxor and Aswan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1738112213/young-tourist-wearing-blue-turban-standing-near-great-sphinx-giza-cairo-egypt_1_sjvfoh.jpg"
                  alt="Transportation options in Egypt"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="accommodation" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Where to Stay</h3>
                <p className="text-muted-foreground mb-4">
                  From luxury resorts to boutique hotels and budget-friendly
                  options.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-accent p-1.5 rounded-full text-primary mt-0.5">
                      <Star className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium">Luxury Nile View Hotels</h4>
                      <p className="text-sm text-muted-foreground">
                        Experience the Nile from your balcony
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-accent p-1.5 rounded-full text-primary mt-0.5">
                      <Star className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium">Desert Resorts</h4>
                      <p className="text-sm text-muted-foreground">
                        Unique stays in the Egyptian desert
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1764620275/dsasad_cujjah.jpg"
                  alt="Egypt accommodation options"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="travel-tips" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Essential Travel Tips
                </h3>
                <p className="text-muted-foreground mb-4">
                  Make the most of your Egyptian adventure with these helpful
                  tips.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-accent p-1.5 rounded-full text-primary mt-0.5">
                      <Star className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium">Visa Information</h4>
                      <p className="text-sm text-muted-foreground">
                        Most visitors need a visa to enter Egypt
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-accent p-1.5 rounded-full text-primary mt-0.5">
                      <Star className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium">Cultural Etiquette</h4>
                      <p className="text-sm text-muted-foreground">
                        Respect local customs and dress modestly
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1764620401/__jduupn.jpg"
                  alt="Egypt travel tips and advice"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-12 sm:py-16 lg:py-20 bg-secondary/50 !w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="">
          <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
            <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-3 sm:mb-4">
              <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Programs</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
              Curated experiences to make your Egyptian journey unforgettable
            </p>
          </div>

          {isLoading ? (
            <ProgramsSectionSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-muted-foreground">Failed to load programs</p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {data?.programs.map((program, index) => (
                <Card key={program.id} className={`overflow-hidden group hover-lift animate-on-scroll ${getStaggerDelay(index)}`}>
                  <div className="relative">
                    <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                      {program.images && (
                        <ProgramCarousel images={program.images as []} />
                      )}
                    </div>
                    {index === 0 && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-primary text-primary-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium animate-pulse">
                        Best Seller
                      </div>
                    )}
                    {index === 2 && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-destructive text-destructive-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium animate-pulse">
                        New
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <h3 className="font-bold text-base sm:text-lg line-clamp-1">
                        {program.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star
                          className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary"
                          aria-hidden="true"
                        />
                        <span className="font-medium text-sm sm:text-base">{program.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                      {program.descraption || program.overView}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                      <div>
                        <span className="text-base sm:text-lg font-bold">
                          ${program.price}
                        </span>
                        <span className="text-muted-foreground text-xs sm:text-sm">
                          {" "}
                          / person
                        </span>
                      </div>
                      <Link
                        href={`/programs/${encodeURIComponent(program.title)}`}
                        onClick={() => handleProgramClick(program)}
                      >
                        <Button className="transition-smooth hover-glow text-sm sm:text-base w-full sm:w-auto">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8 sm:mt-10">
            <Link href="/programs" onClick={() => trackButtonClick("View All Programs", "Home Page - Programs", "/programs")}>
              <Button variant="outline" size={"lg"} className="gap-2 text-sm sm:text-base">
                View All Programs
                <Ticket className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-amber-400 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-primary rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-amber-100 via-primary/10 to-amber-100 dark:from-amber-900/30 dark:via-primary/20 dark:to-amber-900/30 rounded-full mb-4 shadow-lg border border-primary/20">
              <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-4 bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent">
              What Our Travelers Say
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4 leading-relaxed">
              Real stories from real travelers who experienced the magic of Egypt with us.
              Your journey could be next!
            </p>
          </div>
        </div>

        <div className="relative z-10">
          {testimonialsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="animate-pulse border-primary/20">
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 sm:h-4 bg-muted rounded w-3/4" />
                        <div className="h-2 sm:h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 sm:h-3 bg-muted rounded" />
                      <div className="h-2 sm:h-3 bg-muted rounded" />
                      <div className="h-2 sm:h-3 bg-muted rounded w-5/6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : testimonialsData?.data && testimonialsData.data.length > 0 ? (
            <>
              <Testimonials
                testimonials={testimonialsData.data}
                showRelatedContent={true}
                className="animate-on-scroll"
              />
              <div className="flex flex-col items-center gap-4 mt-10 sm:mt-12 animate-on-scroll">
                <div className="text-center max-w-2xl">
                  <p className="text-base sm:text-lg text-muted-foreground mb-6">
                    Have you experienced one of our programs? Share your story and help others discover the magic of Egypt!
                  </p>
                </div>
                <Link href="/programs" onClick={() => trackButtonClick("Book Your Journey", "Home Page - Testimonials", "/programs")}>
                  <Button size="lg" className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 gap-2 text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6">
                    Book Your Journey & Share Your Experience
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-white" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 sm:py-16 border-2 border-dashed border-primary/20 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10">
              <MessageSquare className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground/30 mx-auto mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3">No reviews yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto px-4">
                Be the first to share your experience! Book one of our amazing programs and tell the world about your Egyptian adventure.
              </p>
              <Link href="/programs" onClick={() => trackButtonClick("Explore Our Programs", "Home Page - Testimonials Empty", "/programs")}>
                <Button size="lg" className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-xl text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6">
                  Explore Our Programs
                  <Star className="ml-2 h-4 w-4 sm:h-5 sm:w-5 fill-white" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Instagram Section - Redesigned */}
      <section id="instagram" className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-orange-50/50 dark:from-purple-950/10 dark:via-pink-950/10 dark:to-orange-950/10">
        <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-orange-900/30 rounded-full mb-3 sm:mb-4 shadow-lg">
            <Instagram className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600" aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent px-4">
            Follow Our Journey
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
            Get inspired by our latest Instagram content and join our community of Egypt explorers
          </p>
        </div>

        {isLoading ? (
          <InstagramSectionSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl" />
              <AlertCircle className="relative h-16 w-16 text-destructive" />
            </div>
            <p className="text-muted-foreground text-lg">
              Failed to load Instagram posts
            </p>
            <Button onClick={() => refetch()} variant="outline" size="lg" className="hover-scale">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
            {data?.instagramPosts.map((item: any, index: number) => (
              <div key={item.id} className={`animate-on-scroll ${getStaggerDelay(index)}`}>
                <InstagramModal idPost={item.idPost} />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
          <a
            href="https://www.instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackSocialShare("instagram", "instagram_follow", "home_page")}
          >
            <Button
              size="lg"
              className="gap-2 sm:gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg"
            >
              <Instagram className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              Follow Us on Instagram
            </Button>
          </a>
        </div>
      </section>

      {/* Newsletter Section
      <section className="py-16 bg-muted !w-full">
        <div className="max-w-3xl mx-auto text-center px-[2em]">
          <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-4">
            <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8 text-muted-foreground">
            Subscribe to our newsletter for travel tips, exclusive offers, and
            inspiration for your next Egyptian adventure
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email address for newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubscribing}
              className="px-4 py-2 rounded-md text-foreground bg-background flex-1 min-w-0 border border-input focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={isSubscribing}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </section> */}
    </div>
  );
}
