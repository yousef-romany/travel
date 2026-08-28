import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroClient from "../client/HeroClient";
import { Ticket, MapPin, Calendar, GitCompare } from "lucide-react";

/**
 * Hero Section - Server Component
 * Renders SEO-friendly h1 and description, wraps client video component
 */
export default function HeroSection() {
  return (
    <section className="relative h-[95.5vh] sm:h-[95.5vh] overflow-hidden !w-full">
      <HeroClient>
        <div className="flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 md:px-8 h-full">
          {/* Trustpilot Badge */}
          <Link 
            href="https://www.trustpilot.com/review/zoeholidays.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mb-6 animate-slide-up flex items-center gap-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 transition-all shadow-xl group"
          >
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-5 h-5 bg-[#00B67A] flex items-center justify-center rounded-[2px]">
                  <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5">
                    <path d="M17.227 16.67l2.19 6.742-7.413-5.388 5.223-1.354zM24 9.31h-9.165L12.005.589l-2.84 8.723L0 9.3l7.422 5.397-2.84 8.714 7.422-5.388 4.583-3.326L24 9.311z"/>
                  </svg>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
              <span className="font-bold">4.8/5</span> 
              <span className="text-white/60">|</span> 
              <span>Trustpilot</span>
            </div>
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 drop-shadow-lg animate-slide-up max-w-4xl">
            Discover the Magic of Egypt
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mb-6 sm:mb-8 drop-shadow-md animate-slide-up animate-delay-200 px-2">
            Experience 7,000 years of history, culture, and adventure
          </p>

          <Link
            href="/programs"
            className="animate-slide-up animate-delay-400"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6"
            >
              Start Your Journey
            </Button>
          </Link>

          {/* Quick Access Buttons */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 animate-slide-up animate-delay-600">
            <Link href="/programs" className="group">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/30 text-white hover:text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 gap-2"
              >
                <Ticket className="h-4 w-4" />
                <span className="text-xs sm:text-sm">All Programs</span>
              </Button>
            </Link>
            <Link href="/plan-your-trip" className="group">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/30 text-white hover:text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 gap-2"
              >
                <Calendar className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Plan Trip</span>
              </Button>
            </Link>
            <Link href="/placesTogo" className="group">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/30 text-white hover:text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 gap-2"
              >
                <MapPin className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Places</span>
              </Button>
            </Link>
            <Link href="/compare" className="group">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/30 text-white hover:text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 gap-2"
              >
                <GitCompare className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Compare</span>
              </Button>
            </Link>
          </div>
        </div>
      </HeroClient>
    </section>
  );
}
