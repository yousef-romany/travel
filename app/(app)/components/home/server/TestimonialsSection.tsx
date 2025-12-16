import Link from "next/link";
import dynamic from "next/dynamic";
import { MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/fetch/testimonials";

// Dynamically import Testimonials component but WITH SSR (remove ssr: false)
const Testimonials = dynamic(() => import("@/components/testimonials"), {
  loading: () => <div className="h-96 animate-pulse bg-muted rounded-lg" />,
});

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

/**
 * Testimonials Section - Server Component
 * Renders testimonials with server-side content, client carousel for interactivity
 */
export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
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
        {testimonials && testimonials.length > 0 ? (
          <>
            <Testimonials
              testimonials={testimonials}
              showRelatedContent={true}
              className="animate-on-scroll"
            />
            <div className="flex flex-col items-center gap-4 mt-10 sm:mt-12 animate-on-scroll">
              <div className="text-center max-w-2xl">
                <p className="text-base sm:text-lg text-muted-foreground mb-6">
                  Have you experienced one of our programs? Share your story and help others discover the magic of Egypt!
                </p>
              </div>
              <Link href="/programs">
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
            <Link href="/programs">
              <Button size="lg" className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-xl text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6">
                Explore Our Programs
                <Star className="ml-2 h-4 w-4 sm:h-5 sm:w-5 fill-white" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
