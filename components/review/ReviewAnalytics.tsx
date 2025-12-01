"use client";

import { BarChart3, TrendingUp, Clock, Calendar as CalendarIcon, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Testimonial } from "@/fetch/testimonials";
import { SentimentOverview } from "./SentimentBadge";
import { format, subMonths, isAfter } from "date-fns";

interface ReviewAnalyticsProps {
  testimonials: Testimonial[];
}

export default function ReviewAnalytics({ testimonials }: ReviewAnalyticsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  // Recent reviews (last 30 days)
  const thirtyDaysAgo = subMonths(new Date(), 1);
  const recentReviews = testimonials.filter((t) =>
    isAfter(new Date(t.createdAt), thirtyDaysAgo)
  );

  // Average response time (mock - would come from backend)
  const avgResponseTime = "2.5 hours";

  // Review velocity (reviews per month)
  const reviewsByMonth = testimonials.reduce((acc: Record<string, number>, t) => {
    const month = format(new Date(t.createdAt), "MMM yyyy");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const lastSixMonths = Object.entries(reviewsByMonth)
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  // Top rated aspects (mock - would analyze comments)
  const topAspects = [
    { aspect: "Tour Guide", score: 4.8, count: 18 },
    { aspect: "Value", score: 4.6, count: 15 },
    { aspect: "Experience", score: 4.9, count: 22 },
    { aspect: "Organization", score: 4.5, count: 12 },
  ].sort((a, b) => b.score - a.score);

  // Review completion rate
  const totalBookings = testimonials.length * 2; // Mock: assume 50% leave reviews
  const completionRate = Math.round((testimonials.length / totalBookings) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Review Analytics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recent Reviews */}
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Last 30 Days</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">{recentReviews.length}</span>
              <span className="text-sm text-muted-foreground">reviews</span>
            </div>
          </CardContent>
        </Card>

        {/* Avg Response Time */}
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-muted-foreground">Avg Response</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-600">{avgResponseTime}</span>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-muted-foreground">Completion Rate</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-purple-600">{completionRate}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Reviews */}
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-medium text-muted-foreground">All Time</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-amber-600">{testimonials.length}</span>
              <span className="text-sm text-muted-foreground">total</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Trend */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Review Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lastSixMonths.map(({ month, count }) => {
                const maxCount = Math.max(...lastSixMonths.map((m) => m.count));
                const percentage = (count / maxCount) * 100;

                return (
                  <div key={month} className="flex items-center gap-2">
                    <span className="text-xs font-medium w-20 text-muted-foreground">
                      {month}
                    </span>
                    <div className="flex-1 h-8 bg-muted rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-amber-500 flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs font-bold text-white">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Customer Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <SentimentOverview testimonials={testimonials} />
          </CardContent>
        </Card>
      </div>

      {/* Top Rated Aspects */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-4 h-4" />
            Top Rated Aspects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topAspects.map((aspect, index) => (
              <div
                key={aspect.aspect}
                className="p-4 rounded-lg border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{aspect.aspect}</span>
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-primary">{aspect.score}</span>
                  <span className="text-sm text-muted-foreground">/5</span>
                </div>
                <p className="text-xs text-muted-foreground">{aspect.count} mentions</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
