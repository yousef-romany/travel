"use client";

import { Star, TrendingUp, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Testimonial } from "@/fetch/testimonials";

interface ReviewStatisticsProps {
  testimonials: Testimonial[];
  className?: string;
}

export default function ReviewStatistics({
  testimonials,
  className = "",
}: ReviewStatisticsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  // Calculate statistics
  const totalReviews = testimonials.length;
  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
  const averageRating = totalRating / totalReviews;
  const roundedAverage = Math.round(averageRating * 10) / 10;

  // Rating breakdown
  const ratingCounts = [0, 0, 0, 0, 0];
  testimonials.forEach((t) => {
    if (t.rating >= 1 && t.rating <= 5) {
      ratingCounts[t.rating - 1]++;
    }
  });

  // Most common rating
  const maxCount = Math.max(...ratingCounts);
  const mostCommonRating = ratingCounts.findIndex((count) => count === maxCount) + 1;

  // Verified reviews count
  const verifiedCount = testimonials.filter((t) => t.isVerified).length;
  const verifiedPercentage = Math.round((verifiedCount / totalReviews) * 100);

  // Get unique countries
  const countries = new Set(
    testimonials
      .map((t) => t.user?.profile?.country)
      .filter((c) => c)
  );
  const uniqueCountries = countries.size;

  // Recommendation rate (4-5 stars)
  const recommendCount = testimonials.filter((t) => t.rating >= 4).length;
  const recommendPercentage = Math.round((recommendCount / totalReviews) * 100);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {/* Average Rating */}
      <Card className="border-primary/20 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-900/10 dark:to-amber-800/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-medium text-muted-foreground">
              Average Rating
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {roundedAverage}
            </span>
            <span className="text-sm text-muted-foreground">/ 5</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            From {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </CardContent>
      </Card>

      {/* Recommendation Rate */}
      <Card className="border-primary/20 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-900/10 dark:to-green-800/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-muted-foreground">
              Would Recommend
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {recommendPercentage}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {recommendCount} of {totalReviews} reviewers
          </p>
        </CardContent>
      </Card>

      {/* Verified Reviews */}
      <Card className="border-primary/20 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-900/10 dark:to-blue-800/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-muted-foreground">
              Verified Reviews
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {verifiedPercentage}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {verifiedCount} verified purchases
          </p>
        </CardContent>
      </Card>

      {/* Global Reach */}
      <Card className="border-primary/20 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-900/10 dark:to-purple-800/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-muted-foreground">
              Global Reach
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {uniqueCountries}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {uniqueCountries === 1 ? "country" : "countries"} represented
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
