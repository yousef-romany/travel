"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Map, Sparkles, Users, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PlanTripHero() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-amber-950/20 dark:via-background dark:to-amber-950/20 py-16 md:py-24">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-300/20 dark:bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-amber-100/30 to-transparent dark:from-amber-900/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full border border-amber-200 dark:border-amber-800">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Your Journey, Your Way
              </span>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
                Create Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-400 dark:to-amber-600">
                  Dream Itinerary
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Design a personalized Egyptian adventure with our interactive trip planner. 
                Drag, drop, and discover your perfect journey through ancient wonders.
              </p>
            </div>

            {/* Feature Points */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Map className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Interactive Planning</h3>
                  <p className="text-xs text-muted-foreground">Drag & drop destinations</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Expert Guidance</h3>
                  <p className="text-xs text-muted-foreground">Local insights included</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Instant Pricing</h3>
                  <p className="text-xs text-muted-foreground">Real-time cost calculation</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Flexible Booking</h3>
                  <p className="text-xs text-muted-foreground">Book or save for later</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transition-all group"
                onClick={() => router.push("/plan-your-trip/create")}
              >
                Start Planning Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
              >
                Browse Inspiration
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-6 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-xs text-muted-foreground">Custom Trips Created</p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <p className="text-2xl font-bold text-foreground">4.9★</p>
                <p className="text-xs text-muted-foreground">Average Rating</p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <p className="text-2xl font-bold text-foreground">50+</p>
                <p className="text-xs text-muted-foreground">Destinations Available</p>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative animate-slide-up animate-delay-200">
            <div className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://res.cloudinary.com/dir8ao2mt/image/upload/v1734534726/Egypt_2_p6dnhq.jpg"
                alt="Plan your custom Egypt trip"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                <p className="text-sm font-semibold text-foreground mb-1">🌟 Most Popular</p>
                <p className="text-xs text-muted-foreground">
                  "Pyramids + Nile Cruise + Red Sea" • 12 Days • $2,500
                </p>
              </div>
            </div>

            {/* Decorative Dots */}
            <div className="absolute -top-4 -right-4 w-24 h-24 grid grid-cols-6 gap-2 opacity-30">
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
