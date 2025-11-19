"use client";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";
import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { ProgramCarousel } from "./programs/components/ProgramCarousel";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface InspireBlog {
  id: number;
  documentId: string;
  title: string;
  imageUrl: string;
  details: string;
  inspire_category?: {
    categoryName: string;
  };
}

interface PlaceToGoCategory {
  id: number;
  documentId: string;
  categoryName: string;
  imageUrl: string;
  description: string;
}

interface Program {
  id: number;
  documentId: string;
  title: string;
  descraption: string;
  Location: string;
  price: number;
  duration: number;
  rating: number;
  overView: string;
  images?: Array<{
    id: number;
    imageUrl: string;
  }>;
}

interface InstagramPost {
  id: number;
  documentId: string;
  idPost: string;
  place_to_go_blogs?: Array<{
    title: string;
    imageUrl: string;
  }>;
}

export default function Home() {
  const [inspireBlogs, setInspireBlogs] = useState<InspireBlog[]>([]);
  const [placeCategories, setPlaceCategories] = useState<PlaceToGoCategory[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applyHieroglyphEffect();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch Inspire Blogs (Be Inspired Section)
      const inspireRes = await fetch(
        `${API_URL}/api/inspire-blogs?populate=inspire_category&pagination[limit]=3`
      );
      const inspireData = await inspireRes.json();
      setInspireBlogs(inspireData.data || []);

      // Fetch Place To Go Categories
      const placesRes = await fetch(
        `${API_URL}/api/place-to-go-categories?pagination[limit]=4`
      );
      const placesData = await placesRes.json();
      setPlaceCategories(placesData.data || []);

      // Fetch Programs
      const programsRes = await fetch(
        `${API_URL}/api/programs?populate=images&pagination[limit]=3&sort=rating:desc`
      );
      const programsData = await programsRes.json();
      setPrograms(programsData.data || []);

      // Fetch Instagram Posts
      const instaRes = await fetch(
        `${API_URL}/api/instagram-posts?populate=place_to_go_blogs&pagination[limit]=6`
      );
      const instaData = await instaRes.json();
      setInstagramPosts(instaData.data || []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg?height=600&width=800";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  return (
    <div className="!w-full flex-1">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden !w-full">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Egypt Pyramids"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover the Magic of Egypt
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-8">
            Experience 7,000 years of history, culture, and adventure
          </p>
          <Link href="/programs">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Be Inspired Section */}
      <section id="be-inspired" className="py-16 !w-full px-[2em]">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-4">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Be Inspired</h2>
          <p className="text-muted-foreground max-w-3xl">
            Discover the wonders that await you in the land of the pharaohs
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="!w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {inspireBlogs.slice(0, 3).map((blog) => (
              <Card key={blog.id} className="overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={getImageUrl(blog.imageUrl)}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <h3 className="text-xl font-bold text-white">{blog.title}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {blog.details?.replace(/<[^>]*>/g, '') || "Explore amazing destinations"}
                  </p>
                  <Link
                    href={`/inspire/${blog.documentId}`}
                    className="text-primary font-medium hover:underline inline-flex items-center"
                  >
                    Learn more <Compass className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Link href="/inspire">
            <Button variant="outline" className="gap-2">
              View All Stories
              <Heart className="h-4 w-4" />
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
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Places to Go
            </h2>
            <p className="text-muted-foreground max-w-3xl">
              Explore the most iconic destinations across Egypt
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {placeCategories.slice(0, 4).map((category) => (
                <Card key={category.id} className="overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getImageUrl(category.imageUrl)}
                      alt={category.categoryName}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-bold text-lg mb-1">{category.categoryName}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {category.description || "Discover amazing places"}
                    </p>
                    <Link href={`/places/${category.documentId}`}>
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
            <Link href="/places">
              <Button variant="outline" className="gap-2">
                View All Destinations
                <Compass className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Plan Your Trip Section */}
      <section id="plan-your-trip" className="py-16 !w-full px-[2em]">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-4">
            <Calendar className="h-6 w-6 text-primary" />
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
            <TabsTrigger value="when-to-go" className="py-3">
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
                      <Star className="h-4 w-4" />
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
                      <Star className="h-4 w-4" />
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
                  alt="Egypt Seasons"
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
                      <Plane className="h-4 w-4" />
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
                      <Palmtree className="h-4 w-4" />
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
                  alt="Egypt Transportation"
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
                      <Star className="h-4 w-4" />
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
                      <Star className="h-4 w-4" />
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
                  alt="Egypt Accommodation"
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
                      <Star className="h-4 w-4" />
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
                      <Star className="h-4 w-4" />
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
                  alt="Egypt Travel Tips"
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
              <Ticket className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Programs</h2>
            <p className="text-muted-foreground max-w-3xl">
              Curated experiences to make your Egyptian journey unforgettable
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <Card key={program.id} className="overflow-hidden">
                  <div className="relative">
                    <div className="relative h-56 overflow-hidden">
                      
                      {program.images && <ProgramCarousel images={program.images as []} />}
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
                      <h3 className="font-bold text-lg line-clamp-1">{program.title}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">{program.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {program.descraption || program.overView}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold">${program.price}</span>
                        <span className="text-muted-foreground text-sm"> / person</span>
                      </div>
                      <Link href={`/programs/${program.documentId}`}>
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
              <Button className="gap-2">
                View All Programs
                <Ticket className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram Videos Section */}
      <section id="instagram" className="py-16 !w-full px-[2em]">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-4">
            <Instagram className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Instagram</h2>
          <p className="text-muted-foreground max-w-3xl">
            Follow our adventures and get inspired by our latest Instagram videos
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instagramPosts.map((post) => {
              const blog = post.place_to_go_blogs?.[0];
              return (
                <div
                  key={post.id}
                  className="relative group rounded-lg overflow-hidden"
                >
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={getImageUrl(blog?.imageUrl || "")}
                      alt={blog?.title || `Instagram Post ${post.idPost}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={`https://www.instagram.com/p/${post.idPost}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 hover:text-white"
                        >
                          <Play className="h-6 w-6 fill-white" />
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
            <Button variant="outline" className="gap-2">
              <Instagram className="h-4 w-4" />
              Follow Us on Instagram
            </Button>
          </a>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-muted !w-full">
        <div className="">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="mb-8">
              Subscribe to our newsletter for travel tips, exclusive offers, and
              inspiration for your next Egyptian adventure
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md text-foreground bg-background flex-1 min-w-0"
              />
              <Button className="bg-background text-primary hover:bg-background/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}