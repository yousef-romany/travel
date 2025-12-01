"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Testimonial } from "@/fetch/testimonials";

interface AverageRatingProps {
  testimonials: Testimonial[];
  className?: string;
}

export default function AverageRating({ testimonials, className = "" }: AverageRatingProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
  const averageRating = totalRating / testimonials.length;
  const roundedAverage = Math.round(averageRating * 10) / 10; // Round to 1 decimal

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // For 1-5 stars
  testimonials.forEach((t) => {
    if (t.rating >= 1 && t.rating <= 5) {
      ratingCounts[t.rating - 1]++;
    }
  });

  const getRatingPercentage = (count: number) => {
    return testimonials.length > 0 ? (count / testimonials.length) * 100 : 0;
  };

  return (
    <Card className={`border-primary/20 bg-gradient-to-br from-amber-50/50 to-primary/5 dark:from-amber-900/10 dark:to-primary/10 ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Average Rating Display */}
          <div className="text-center md:text-left">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                {roundedAverage}
              </span>
              <span className="text-2xl text-muted-foreground">/ 5</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-300 text-gray-300 dark:fill-gray-700 dark:text-gray-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on <span className="font-semibold text-foreground">{testimonials.length}</span>{" "}
              {testimonials.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating - 1];
              const percentage = getRatingPercentage(count);

              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground w-8">
                    {rating} <Star className="w-3 h-3 inline fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {count} {count === 1 ? "review" : "reviews"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
