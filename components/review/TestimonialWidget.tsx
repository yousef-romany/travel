"use client";

import { Star, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TestimonialWidgetProps {
  averageRating?: number;
  reviewCount?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function TestimonialWidget({
  averageRating = 0,
  reviewCount = 0,
  className = "",
  size = "md",
}: TestimonialWidgetProps) {
  if (reviewCount === 0) {
    return (
      <div className={`flex items-center gap-1.5 text-muted-foreground ${className}`}>
        <MessageSquare className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
        <span className={`${size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"}`}>
          No reviews yet
        </span>
      </div>
    );
  }

  const roundedRating = Math.round(averageRating * 10) / 10;
  const filledStars = Math.round(averageRating);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`${
              size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
            } ${
              index < filledStars
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-300 text-gray-300 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
      <span
        className={`font-semibold ${
          size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
        }`}
      >
        {roundedRating}
      </span>
      <span
        className={`text-muted-foreground ${
          size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-xs"
        }`}
      >
        ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}

// Compact badge version for cards
export function TestimonialBadge({
  averageRating = 0,
  reviewCount = 0,
}: {
  averageRating?: number;
  reviewCount?: number;
}) {
  if (reviewCount === 0) return null;

  const roundedRating = Math.round(averageRating * 10) / 10;

  return (
    <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white gap-1">
      <Star className="w-3 h-3 fill-white" />
      {roundedRating} ({reviewCount})
    </Badge>
  );
}
