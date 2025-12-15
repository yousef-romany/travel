"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Map, Sparkles, Users, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PlanTripHero() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-amber-950/20 dark:via-background dark:to-amber-950/20 py-10 sm:py-14 md:py-16 lg:py-24">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-5 sm:bottom-10 left-5 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-amber-300/20 dark:bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-radial from-amber-100/30 to-transparent dark:from-amber-900/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full border border-amber-200 dark:border-amber-800">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-100 whitespace-nowrap">
                Your Journey, Your Way
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
                Create Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-400 dark:to-amber-600">
                  Dream Itinerary
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Design a personalized Egyptian adventure with our interactive trip planner.
                Drag, drop, and discover your perfect journey through ancient wonders.
              </p>
            </div>

            {/* Feature Points */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 py-3 sm:py-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                  <Map className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm leading-tight">Interactive Planning</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">Drag & drop destinations</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm leading-tight">Expert Guidance</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">Local insights included</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm leading-tight">Instant Pricing</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">Real-time cost calculation</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm leading-tight">Flexible Booking</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">Book or save for later</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transition-all group text-sm sm:text-base px-4 sm:px-6 py-5 sm:py-6 w-full sm:w-auto"
                onClick={() => router.push("/plan-your-trip/create")}
              >
                Start Planning Now
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-sm sm:text-base px-4 sm:px-6 py-5 sm:py-6 w-full sm:w-auto"
              >
                Browse Inspiration
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6 border-t border-border overflow-x-auto">
              <div className="flex-shrink-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground">500+</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">Custom Trips Created</p>
              </div>
              <div className="w-px h-10 sm:h-12 bg-border flex-shrink-0"></div>
              <div className="flex-shrink-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground">4.9★</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">Average Rating</p>
              </div>
              <div className="w-px h-10 sm:h-12 bg-border flex-shrink-0"></div>
              <div className="flex-shrink-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground">50+</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">Destinations Available</p>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative animate-slide-up animate-delay-200">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] md:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1764631854/__1_l2obyo.jpg"
                alt="Plan your custom Egypt trip"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 50vw"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

              {/* Floating Card */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl">
                <p className="text-xs sm:text-sm font-semibold text-foreground mb-0.5 sm:mb-1">🌟 Most Popular</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">
                  "Pyramids + Nile Cruise + Red Sea" • 12 Days • $2,500
                </p>
              </div>
            </div>

            {/* Decorative Dots */}
            <div className="hidden sm:block absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 grid grid-cols-6 gap-2 opacity-30">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-amber-500"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
