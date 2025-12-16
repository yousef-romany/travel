import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroClient from "../client/HeroClient";

/**
 * Hero Section - Server Component
 * Renders SEO-friendly h1 and description, wraps client video component
 */
export default function HeroSection() {
  return (
    <section className="relative h-[95.5vh] sm:h-[95.5vh] overflow-hidden !w-full">
      <HeroClient>
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
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6"
            >
              Start Your Journey
            </Button>
          </Link>
        </div>
      </HeroClient>
    </section>
  );
}
