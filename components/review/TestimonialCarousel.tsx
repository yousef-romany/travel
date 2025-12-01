"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Testimonial } from "@/fetch/testimonials";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
}

export default function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  interval = 5000,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  const getFullName = (testimonial: Testimonial) => {
    if (testimonial.user?.profile?.firstName && testimonial.user?.profile?.lastName) {
      return `${testimonial.user.profile.firstName} ${testimonial.user.profile.lastName}`;
    }
    return testimonial.user?.username || "Anonymous";
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-2xl overflow-hidden">
        <CardContent className="p-8 md:p-12 relative">
          {/* Quote Icon */}
          <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />

          {/* Testimonial Content */}
          <div className="relative z-10">
            {/* Stars */}
            <div className="flex items-center justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-6 h-6 ${
                    index < currentTestimonial.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-300 text-gray-300 dark:fill-gray-700 dark:text-gray-700"
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-lg md:text-xl text-center text-foreground leading-relaxed mb-8 min-h-[100px] flex items-center justify-center">
              "{currentTestimonial.comment}"
            </p>

            {/* User Info */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-16 h-16 border-2 border-primary/30">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentTestimonial.user?.username}`}
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-amber-500/10 text-primary font-semibold text-lg">
                  {getFullName(currentTestimonial)[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-semibold text-lg">{getFullName(currentTestimonial)}</p>
                {currentTestimonial.user?.profile?.country && (
                  <p className="text-sm text-muted-foreground">
                    {currentTestimonial.user.profile.country}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dots Indicator */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
