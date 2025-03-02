"use client";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";
import { useEffect } from "react";
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
} from "lucide-react";

export default function Home() {
  useEffect(() => {
    applyHieroglyphEffect();
  }, []);
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
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Be Inspired Section */}
      <section id="be-inspired" className="py-16  !w-full px-[2em]">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-4">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Be Inspired</h2>
          <p className="text-muted-foreground max-w-3xl">
            Discover the wonders that await you in the land of the pharaohs
          </p>
        </div>

        <div className="!w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Ancient Temples"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-xl font-bold text-white">
                  Ancient Temples
                </h3>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Explore the magnificent temples of Luxor, Karnak, and Abu Simbel
              </p>
              <Link
                href="#"
                className="text-primary font-medium hover:underline inline-flex items-center"
              >
                Learn more <Compass className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Red Sea"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-xl font-bold text-white">
                  Red Sea Wonders
                </h3>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Dive into crystal clear waters and discover vibrant coral reefs
              </p>
              <Link
                href="#"
                className="text-primary font-medium hover:underline inline-flex items-center"
              >
                Learn more <Compass className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Desert Safari"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-xl font-bold text-white">
                  Desert Adventures
                </h3>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Experience the magic of the Sahara with camel rides and
                stargazing
              </p>
              <Link
                href="#"
                className="text-primary font-medium hover:underline inline-flex items-center"
              >
                Learn more <Compass className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  alt="Cairo"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold text-lg mb-1">Cairo</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The vibrant capital
                </p>
                <Button variant="outline" size="sm" className="!w-full">
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  alt="Luxor"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold text-lg mb-1">Luxor</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The world{"'"}s greatest open-air museum
                </p>
                <Button variant="outline" size="sm" className="!w-full">
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  alt="Aswan"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold text-lg mb-1">Aswan</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Gateway to Nubian culture
                </p>
                <Button variant="outline" size="sm" className="!w-full">
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  alt="Sharm El Sheikh"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold text-lg mb-1">Sharm El Sheikh</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Red Sea paradise
                </p>
                <Button variant="outline" size="sm" className="!w-full">
                  Explore
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-10">
            <Button variant="outline" className="gap-2">
              View All Destinations
              <Compass className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Plan Your Trip Section */}
      <section id="plan-your-trip" className="py-16  !w-full px-[2em]">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Classic Egypt Tour"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Best Seller
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Classic Egypt Tour</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">4.9</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  8 days exploring Cairo, Luxor, and Aswan with a Nile cruise
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">$1,299</span>
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      / person
                    </span>
                  </div>
                  <Button>View Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Red Sea Diving Adventure"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">
                    Red Sea Diving Adventure
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  5 days of diving and relaxation in Sharm El Sheikh
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">$899</span>
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      / person
                    </span>
                  </div>
                  <Button>View Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Desert Safari"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                  New
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">White Desert Expedition</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">4.7</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  3-day adventure in the surreal landscapes of the White Desert
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">$649</span>
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      / person
                    </span>
                  </div>
                  <Button>View Details</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-10">
            <Button className="gap-2">
              View All Programs
              <Ticket className="h-4 w-4" />
            </Button>
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
            Follow our adventures and get inspired by our latest Instagram
            videos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="relative group rounded-lg overflow-hidden"
            >
              <div className="relative aspect-square bg-muted">
                <Image
                  src={`/placeholder.svg?height=600&width=600&text=Instagram+Video+${item}`}
                  alt={`Instagram Video ${item}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 hover:text-white"
                  >
                    <Play className="h-6 w-6 fill-white" />
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                <p className="font-medium text-sm">
                  Exploring the wonders of Egypt #EgyptTravel
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button variant="outline" className="gap-2">
            <Instagram className="h-4 w-4" />
            Follow Us on Instagram
          </Button>
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
