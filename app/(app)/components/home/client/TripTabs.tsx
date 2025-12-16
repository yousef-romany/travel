"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Plane, Palmtree } from "lucide-react";

/**
 * TripTabs - Client Component
 * Interactive tabs for Plan Your Trip section
 */
export default function TripTabs() {
  return (
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
              sizes="(max-width: 768px) 100vw, 50vw"
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
              sizes="(max-width: 768px) 100vw, 50vw"
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
              sizes="(max-width: 768px) 100vw, 50vw"
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
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
