"use client";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";
import { useEffect, useCallback } from "react";
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

// Egypt travel videos from Cloudinary
const HERO_VIDEOS = [
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922614/Egypt_Unmatched_Diversity_fbtjmf.mp4",
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922583/Let_s_Go_-_Egypt_A_Beautiful_Destinations_Original_1_ayt7re.mp4",
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922572/This_is_Egypt_x6b0oo.mp4",
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922524/Escape_to_Egypt_Cinematic_Film_lfq32y.mp4",
];

export default function HomeContent() {
  useEffect(() => {
    applyHieroglyphEffect();
  }, []);

  // Fetch homepage data with React Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["homepageData"],
    queryFn: fetchHomePageData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

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
      <section className="relative h-[70vh] overflow-hidden !w-full">
        <BackgroundVideo
          videos={HERO_VIDEOS}
          priority
          autoRotate
          rotationInterval={30000}
        >
          <div className="flex flex-col items-center justify-center text-white text-center p-4 h-full">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Discover the Magic of Egypt
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mb-8 drop-shadow-md">
              Experience 7,000 years of history, culture, and adventure
            </p>
            <Link href="/programs">
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
        <div className="flex flex-col items-center mb-12 text-center">
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
            {data?.inspireBlogs.map((blog) => {
              const image = blog.image;

              return (
                <Card key={blog.id} className="overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={getImageUrl(image)}
                      alt={`${blog.title} - Egypt travel inspiration`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
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
                      className="text-primary font-medium hover:underline inline-flex items-center"
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
          <div className="flex flex-col items-center mb-12 text-center">
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
              {data?.placeCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getImageUrl(category.image)}
                      alt={`${category.categoryName} - Egypt destination`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
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
                      <Button variant="outline" size="sm" className="!w-full">
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
        <div className="flex flex-col items-center mb-12 text-center">
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
          <div className="flex flex-col items-center mb-12 text-center">
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
                <Card key={program.id} className="overflow-hidden">
                  <div className="relative">
                    <div className="relative h-56 overflow-hidden">
                      {program.images && (
                        <ProgramCarousel images={program.images as []} />
                      )}
                    </div>
                    {index === 0 && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        Best Seller
                      </div>
                    )}
                    {index === 2 && (
                      <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
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
                        <Button>View Details</Button>
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

      {/* Instagram Videos Section */}
      <section id="instagram" className="py-16 !w-full px-[2em]">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-4">
            <Instagram className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Instagram</h2>
          <p className="text-muted-foreground max-w-3xl">
            Follow our adventures and get inspired by our latest Instagram
            videos
          </p>
        </div>

        {isLoading ? (
          <InstagramSectionSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-muted-foreground">
              Failed to load Instagram posts
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.instagramPosts.map((post) => {
              const blog = post.place_to_go_blogs?.[0];
              return (
                <div
                  key={post.id}
                  className="relative group rounded-lg overflow-hidden"
                >
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={getImageUrl(blog?.imageUrl, "/placeholder.svg?height=600&width=800")}
                      alt={
                        blog?.title ||
                        `Instagram post from ZoeHoliday Egypt travel`
                      }
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={`https://www.instagram.com/p/${post.idPost}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleInstagramClick(post.idPost)}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 hover:text-white"
                        >
                          <Play className="h-6 w-6 fill-white" />
                          <span className="sr-only">Play Instagram video</span>
                        </Button>
                      </a>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <p className="font-medium text-sm line-clamp-1">
                      {blog?.title || "Exploring Egypt #EgyptTravel"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <a
            href="https://www.instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size={"lg"} className="gap-2 text-primary">
              <Instagram className="h-4 w-4" aria-hidden="true" />
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
