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
  Clock,
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
import { RecentlyViewed } from "@/components/programs/RecentlyViewed";
import { LoyaltyWidget } from "@/components/loyalty/LoyaltyDashboard";
import { ReferralWidget } from "@/components/social/ReferralProgram";
import { ComparisonDemo } from "@/components/programs/ComparisonDemo";
import { CompareButton } from "@/components/programs/CompareButton";
import { calculateDynamicPrice } from "@/lib/dynamic-pricing";
import { Gift, TrendingUp, Users, Bell, Zap, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { subscribeToPushNotifications } from "@/lib/push-notifications";
import { useState } from "react";

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
  const { user } = useAuth();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

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
          <div className="!w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
                      Read more about {blog.title}{" "}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
          <TabsList className="flex w-full overflow-x-auto no-scrollbar pb-2 justify-start sm:justify-center md:grid md:grid-cols-4 h-auto gap-2 sm:gap-0 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="when-to-go" className="whitespace-nowrap min-w-fit px-4 py-2.5 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              When to Go
            </TabsTrigger>
            <TabsTrigger value="getting-around" className="whitespace-nowrap min-w-fit px-4 py-2.5 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              Getting Around
            </TabsTrigger>
            <TabsTrigger value="accommodation" className="whitespace-nowrap min-w-fit px-4 py-2.5 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              Accommodation
            </TabsTrigger>
            <TabsTrigger value="travel-tips" className="whitespace-nowrap min-w-fit px-4 py-2.5 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {data?.programs.map((program, index) => (
                <Card key={program.id} className={`overflow-hidden group hover-lift animate-on-scroll ${getStaggerDelay(index)} border-primary/10 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                  <div className="relative">
                    <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                      {program.images && (
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
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <h3 className="font-bold text-lg sm:text-xl line-clamp-1 group-hover:text-primary transition-colors">
                        {program.title}
                      </h3>
                      <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md">
                        <Star
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                        <span className="font-bold text-sm sm:text-base">{program.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-2">
                      {program.descraption || program.overView}
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
                          onClick={() => handleProgramClick(program)}
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

      {/* Loyalty Program Section */}
      {user && (
        <section className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-orange-50/50 dark:from-amber-950/10 dark:via-yellow-950/10 dark:to-orange-950/10">
          <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
            <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 rounded-full mb-3 sm:mb-4 shadow-lg">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent px-4">
              Your Loyalty Rewards
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
              Earn points with every booking and unlock exclusive benefits
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <LoyaltyWidget />
            <div className="flex justify-center mt-8">
              <Link href="/me">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg">
                  View Full Profile
                  <Award className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Referral Program Section */}
      {user && (
        <section className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/10 dark:to-emerald-950/10">
          <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
            <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mb-3 sm:mb-4 shadow-lg">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent px-4">
              Refer Friends, Earn Rewards
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
              Get $50 credit for every friend who books their first trip
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <ReferralWidget />
            <div className="flex justify-center mt-8">
              <Link href="/me">
                <Button size="lg" variant="outline" className="gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20">
                  Manage Referrals
                  <Users className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gift Cards Promotion Section */}
      <section className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-br from-pink-50/50 via-rose-50/30 to-red-50/50 dark:from-pink-950/10 dark:via-rose-950/10 dark:to-red-950/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center animate-on-scroll">
            <div>
              <div className="inline-flex items-center justify-center p-2 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-full mb-4 shadow-lg">
                <Gift className="h-6 w-6 text-pink-600" aria-hidden="true" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Give the Gift of Travel
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6">
                Share the magic of Egypt with your loved ones. Our gift cards are perfect for any occasion and never expire.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full">
                    <Zap className="h-5 w-5 text-pink-600" />
                  </div>
                  <span className="text-sm sm:text-base">Instant digital delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full">
                    <Gift className="h-5 w-5 text-pink-600" />
                  </div>
                  <span className="text-sm sm:text-base">Valid on all programs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full">
                    <Heart className="h-5 w-5 text-pink-600" />
                  </div>
                  <span className="text-sm sm:text-base">Personalized message included</span>
                </div>
              </div>
              <Link href="/gift-cards">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-xl">
                  Purchase Gift Card
                  <Gift className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800"
                alt="Gift card promotion"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Push Notification Prompt */}
      {user && !showNotificationPrompt && (
        <section className="py-8 sm:py-12 !w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <Card className="max-w-4xl mx-auto border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background shadow-xl animate-on-scroll overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
            <CardContent className="p-6 sm:p-8 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg shadow-primary/25 ring-4 ring-primary/10">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Stay Updated on Your Adventures</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Get instant notifications about booking confirmations, trip reminders, and exclusive deals directly to your device.
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={async () => {
                    const result = await subscribeToPushNotifications();
                    if (result) {
                      setShowNotificationPrompt(true);
                    }
                  }}
                  className="gap-2 whitespace-nowrap bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all hover:scale-105"
                >
                  Enable Notifications
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Interactive Comparison Demo */}
      <section className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12 bg-secondary/50">
        <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-3 sm:mb-4 shadow-lg">
            <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent px-4">
            Try Our Program Comparison Tool
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
            Compare up to 3 programs side-by-side to make the best decision for your trip
          </p>
        </div>

        <ComparisonDemo />
      </section>

      {/* Features Showcase Section */}
      <section className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
            <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-primary/10 to-accent rounded-full mb-3 sm:mb-4 shadow-lg">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
              Why Choose ZoeHoliday?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
              We offer the most comprehensive travel experience with exclusive features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll">
            {/* Dynamic Pricing */}
            <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mb-4 shadow-sm">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Smart Pricing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the best deals with our dynamic pricing engine. Early bird discounts up to 30% off.
                </p>
                <div className="text-xs text-primary font-bold uppercase tracking-wide">Save up to $500 per trip</div>
              </CardContent>
            </Card>

            {/* Group Discounts */}
            <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-4 shadow-sm">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Group Discounts</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Travel with friends and family! Get up to 20% off for groups of 16 or more.
                </p>
                <div className="text-xs text-primary font-bold uppercase tracking-wide">Bigger groups = Bigger savings</div>
              </CardContent>
            </Card>

            {/* Loyalty Program */}
            <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-full mb-4 shadow-sm">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Loyalty Rewards</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Earn points on every booking. Redeem for discounts and exclusive perks.
                </p>
                <div className="text-xs text-primary font-bold uppercase tracking-wide">100 points = $1 USD</div>
              </CardContent>
            </Card>

            {/* Travel Insurance */}
            <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4 shadow-sm">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Travel Protection</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Travel worry-free with our comprehensive insurance options starting at $49.
                </p>
                <div className="text-xs text-primary font-bold uppercase tracking-wide">Up to $250K coverage</div>
              </CardContent>
            </Card>

            {/* Voice Search */}
            <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full mb-4 shadow-sm">
                  <Play className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Voice Search</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Find your perfect trip hands-free with our AI-powered voice search.
                </p>
                <div className="text-xs text-primary font-bold uppercase tracking-wide">Search in any language</div>
              </CardContent>
            </Card>

            {/* 24/7 Support */}
            <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-full mb-4 shadow-sm">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our expert travel guides are always here to help you plan your perfect trip.
                </p>
                <div className="text-xs text-primary font-bold uppercase tracking-wide">WhatsApp & Live Chat</div>
              </CardContent>
            </Card>
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
                  <Button size="default" className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 gap-2 text-sm px-6 py-2 h-auto">
                    Book Your Journey & Share Your Experience
                    <Star className="h-4 w-4 fill-white" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
            {data?.instagramPosts.map((item: any, index: number) => (
              <div key={item.id} className={`animate-on-scroll ${getStaggerDelay(index)}`}>
                <InstagramModal idPost={item.idPost} />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
          <a
            href="https://www.instagram.com/zoeholidayss1"
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

      {/* Recently Viewed Section - Moved to Bottom */}
      {user && (
        <section className="py-12 sm:py-16 !w-full px-4 sm:px-6 md:px-8 lg:px-12 bg-muted/30">
          <div className="flex flex-col items-center mb-8 text-center animate-on-scroll">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Continue Exploring</h2>
            <p className="text-muted-foreground">Pick up where you left off with your recently viewed programs</p>
          </div>
          <RecentlyViewed />
        </section>
      )}
    </div>
  );
}
