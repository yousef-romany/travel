"use client";

import { Star, Award, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Testimonial } from "@/fetch/testimonials";

interface FeaturedReviewsProps {
  testimonials: Testimonial[];
  maxReviews?: number;
  className?: string;
}

export default function FeaturedReviews({
  testimonials,
  maxReviews = 3,
  className = "",
}: FeaturedReviewsProps) {
  // Filter for high-rated, verified reviews with longer comments
  const featuredReviews = testimonials
    .filter((t) => t.rating >= 4 && t.comment.length > 50)
    .sort((a, b) => {
      // Prioritize: verified > high rating > comment length
      if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
      if (a.rating !== b.rating) return b.rating - a.rating;
      return b.comment.length - a.comment.length;
    })
    .slice(0, maxReviews);

  if (featuredReviews.length === 0) return null;

  const getFullName = (testimonial: Testimonial) => {
    if (testimonial.user?.profile?.firstName && testimonial.user?.profile?.lastName) {
      return `${testimonial.user.profile.firstName} ${testimonial.user.profile.lastName}`;
    }
    return testimonial.user?.username || "Anonymous";
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-amber-500 fill-amber-500" />
        <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
          Featured Reviews
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredReviews.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-amber-100/20 dark:from-amber-900/10 dark:to-amber-800/10 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden"
          >
            {/* Featured Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-bl-lg text-xs font-semibold flex items-center gap-1">
              <Award className="w-3 h-3 fill-white" />
              Featured
            </div>

            {/* Quote Icon */}
            <Quote className="absolute top-3 left-3 w-10 h-10 text-amber-500/10" />

            <CardContent className="p-6 pt-8 relative z-10">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < testimonial.rating
                        ? "fill-amber-500 text-amber-500"
                        : "fill-gray-300 text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-foreground leading-relaxed mb-4 line-clamp-6">
                "{testimonial.comment}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-amber-500/20">
                <Avatar className="w-10 h-10 border-2 border-amber-500/30">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.user?.username}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 text-amber-700 font-semibold">
                    {getFullName(testimonial)[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {getFullName(testimonial)}
                  </p>
                  {testimonial.user?.profile?.country && (
                    <p className="text-xs text-muted-foreground truncate">
                      {testimonial.user.profile.country}
                    </p>
                  )}
                </div>
                {testimonial.isVerified && (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">
                    Verified
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
