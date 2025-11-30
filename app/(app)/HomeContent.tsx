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
      <section className="relative h-[90vh] overflow-hidden !w-full">
        <BackgroundVideo
          videos={HERO_VIDEOS}
          priority
          autoRotate
          rotationInterval={30000}
        >
          <div className="flex flex-col items-center justify-center text-white text-center p-4 h-full">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-slide-up">
              Discover the Magic of Egypt
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mb-8 drop-shadow-md animate-slide-up animate-delay-200">
              Experience 7,000 years of history, culture, and adventure
            </p>
            <Link href="/programs" className="animate-slide-up animate-delay-400">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
              >
                Start Your Journey
              </Button>
            </Link>
          </div>
        </BackgroundVideo>
      </section>

      {/* Be Inspired Section */}
      <section id="be-inspired" className="py-16 !w-full px-[2em]">
        <div className="flex flex-col items-center mb-12 text-center animate-on-scroll">
          <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-4">
            <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Be Inspired</h2>
          <p className="text-muted-foreground max-w-3xl">
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
          <div className="!w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {data?.inspireBlogs.map((blog, index) => {
              const image = blog.image;

              return (
                <Card key={blog.id} className={`overflow-hidden group hover-lift animate-on-scroll ${getStaggerDelay(index)}`}>
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={getImageUrl(image)}
                      alt={`${blog.title} - Egypt travel inspiration`}
                      fill
                      className="object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    {image?.formats?.large?.url}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                      <h3 className="text-xl font-bold text-white">
                        {blog.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {blog.details?.replace(/<[^>]*>/g, "") ||
                        "Explore amazing destinations"}
                    </p>
                    <Link
                      href={`/inspiration/${blog.documentId}`}
                      className="text-primary font-medium hover:underline inline-flex items-center transition-smooth"
                    >
                      Learn more{" "}
                      <Compass className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Link href="/inspiration">
            <Button variant="outline" size={"lg"} className="gap-2 text-primary">
              View All Stories
              <Heart className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Places to Go Section */}
      <section
        id="places-to-go"
        className="py-16 bg-secondary/50 !w-full px-[2em]"
      >
        <div className="">
          <div className="flex flex-col items-center mb-12 text-center animate-on-scroll">
            <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-4">
              <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Places to Go
            </h2>
            <p className="text-muted-foreground max-w-3xl">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data?.placeCategories.map((category, index) => (
                <Card key={category.id} className={`overflow-hidden group hover-lift animate-on-scroll ${getStaggerDelay(index)}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getImageUrl(category.image)}
                      alt={`${category.categoryName} - Egypt destination`}
                      fill
                      className="object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-bold text-lg mb-1">
                      {category.categoryName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {category.description || "Discover amazing places"}
                    </p>
                    <Link href={`/placesTogo/${category.categoryName}`}>
                      <Button variant="outline" size="sm" className="!w-full transition-smooth hover-glow">
                        Explore
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <Link href="/placesTogo">
              <Button variant="outline" size={"lg"} className="gap-2 text-primary">
                View All Destinations
                <Compass className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Plan Your Trip Section */}
      <section id="plan-your-trip" className="py-16 !w-full px-[2em]">
        <div className="flex flex-col items-center mb-12 text-center animate-on-scroll">
          <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-4">
            <Calendar className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Plan Your Trip
          </h2>
          <p className="text-muted-foreground max-w-3xl">
            Everything you need to create your perfect Egyptian adventure
          </p>
        </div>

        <Tabs defaultValue="when-to-go" className="!w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-1 sm:grid-cols-4 h-auto">
            <TabsTrigger value="when-to-go" className="py-3 text-primary">
              When to Go
            </TabsTrigger>
            <TabsTrigger value="getting-around" className="py-3">
              Getting Around
            </TabsTrigger>
            <TabsTrigger value="accommodation" className="py-3">
              Accommodation
            </TabsTrigger>
            <TabsTrigger value="travel-tips" className="py-3">
              Travel Tips
            </TabsTrigger>
          </TabsList>
          <TabsContent value="when-to-go" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Best Time to Visit Egypt
                </h3>
                <p className="text-muted-foreground mb-4">
                  The best time to visit Egypt is from October to April, when
                  temperatures are cooler. December and January are peak tourist
                  months.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-accent p-1.5 rounded-full text-primary mt-0.5">
                      <Star className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium">October to April</h4>
                      <p className="text-sm text-muted-foreground">
                        Ideal weather for sightseeing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-accent p-1.5 rounded-full text-primary mt-0.5">
                      <Star className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium">May to September</h4>
                      <p className="text-sm text-muted-foreground">
                        Hot weather, good for beach destinations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=800"
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
                  src="/placeholder.svg?height=600&width=800"
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
                  src="/placeholder.svg?height=600&width=800"
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
                  src="/placeholder.svg?height=600&width=800"
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
      <section id="programs" className="py-16 bg-secondary/50 !w-full px-[2em]">
        <div className="">
          <div className="flex flex-col items-center mb-12 text-center animate-on-scroll">
            <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-4">
              <Ticket className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Programs</h2>
            <p className="text-muted-foreground max-w-3xl">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.programs.map((program, index) => (
                <Card key={program.id} className={`overflow-hidden group hover-lift animate-on-scroll ${getStaggerDelay(index)}`}>
                  <div className="relative">
                    <div className="relative h-56 overflow-hidden">
                      {program.images && (
                        <ProgramCarousel images={program.images as []} />
                      )}
                    </div>
                    {index === 0 && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                        Best Seller
                      </div>
                    )}
                    {index === 2 && (
                      <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                        New
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg line-clamp-1">
                        {program.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star
                          className="h-4 w-4 fill-primary text-primary"
                          aria-hidden="true"
                        />
                        <span className="font-medium">{program.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {program.descraption || program.overView}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold">
                          ${program.price}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {" "}
                          / person
                        </span>
                      </div>
                      <Link
                        href={`/programs/${encodeURIComponent(program.title)}`}
                        onClick={() => handleProgramClick(program)}
                      >
                        <Button className="transition-smooth hover-glow">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <Link href="/programs">
              <Button variant="outline" size={"lg"} className="gap-2 text-primary">
                View All Programs
                <Ticket className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 !w-full px-[2em] bg-secondary/20">
        <div className="flex flex-col items-center mb-12 text-center animate-on-scroll">
          <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-4">
            <MessageSquare className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Travelers Say</h2>
          <p className="text-muted-foreground max-w-3xl">
            Discover the experiences of our happy travelers who explored Egypt with us
          </p>
        </div>

        {testimonialsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
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
            <div className="flex justify-center mt-10">
              <Link href="/programs">
                <Button size="lg" variant="outline" className="hover-scale">
                  Book Your Journey & Share Your Experience
                  <Star className="ml-2 h-5 w-5 fill-amber-400 text-amber-400" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Be the first to share your experience!
            </p>
            <Link href="/programs">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Our Programs
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Instagram Section - Redesigned */}
      <section id="instagram" className="py-16 !w-full px-[2em] bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-orange-50/50 dark:from-purple-950/10 dark:via-pink-950/10 dark:to-orange-950/10">
        <div className="flex flex-col items-center mb-12 text-center animate-on-scroll">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-orange-900/30 rounded-full mb-4 shadow-lg">
            <Instagram className="h-7 w-7 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Follow Our Journey
          </h2>
          <p className="text-muted-foreground max-w-3xl text-lg">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {data?.instagramPosts.map((item: any, index: number) => (
              <div key={item.id} className={`animate-on-scroll ${getStaggerDelay(index)}`}>
                <InstagramModal idPost={item.idPost} />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <a
            href="https://www.instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-6 text-lg"
            >
              <Instagram className="h-5 w-5" aria-hidden="true" />
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
