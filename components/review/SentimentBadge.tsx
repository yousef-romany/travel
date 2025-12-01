"use client";

import { Smile, Meh, Frown, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Sentiment = "positive" | "neutral" | "negative";

interface SentimentBadgeProps {
  comment: string;
  rating: number;
  className?: string;
}

export default function SentimentBadge({
  comment,
  rating,
  className = "",
}: SentimentBadgeProps) {
  const analyzeSentiment = (): Sentiment => {
    // Simple sentiment analysis based on rating and keywords
    const positiveWords = [
      "amazing",
      "excellent",
      "wonderful",
      "fantastic",
      "beautiful",
      "love",
      "great",
      "best",
      "perfect",
      "awesome",
      "incredible",
      "outstanding",
      "brilliant",
      "superb",
      "highly recommend",
    ];

    const negativeWords = [
      "bad",
      "terrible",
      "worst",
      "awful",
      "horrible",
      "disappointing",
      "poor",
      "waste",
      "never",
      "not recommend",
      "avoid",
      "regret",
    ];

    const lowerComment = comment.toLowerCase();
    const positiveCount = positiveWords.filter((word) =>
      lowerComment.includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowerComment.includes(word)
    ).length;

    // Combine rating and keyword analysis
    if (rating >= 4 && positiveCount > negativeCount) return "positive";
    if (rating <= 2 || negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  const sentiment = analyzeSentiment();

  const getSentimentConfig = () => {
    switch (sentiment) {
      case "positive":
        return {
          icon: Smile,
          label: "Positive",
          className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
          trend: TrendingUp,
        };
      case "negative":
        return {
          icon: Frown,
          label: "Negative",
          className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
          trend: TrendingDown,
        };
      default:
        return {
          icon: Meh,
          label: "Neutral",
          className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
          trend: null,
        };
    }
  };

  const config = getSentimentConfig();
  const Icon = config.icon;

  return (
    <Badge className={cn("gap-1", config.className, className)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

// Aggregate sentiment component for statistics
export function SentimentOverview({
  testimonials,
}: {
  testimonials: Array<{ comment: string; rating: number }>;
}) {
  const sentiments = testimonials.map((t) => {
    const positiveWords = ["amazing", "excellent", "wonderful", "fantastic", "beautiful", "love", "great", "best"];
    const negativeWords = ["bad", "terrible", "worst", "awful", "horrible", "disappointing"];

    const lowerComment = t.comment.toLowerCase();
    const positiveCount = positiveWords.filter((w) => lowerComment.includes(w)).length;
    const negativeCount = negativeWords.filter((w) => lowerComment.includes(w)).length;

    if (t.rating >= 4 && positiveCount > negativeCount) return "positive";
    if (t.rating <= 2 || negativeCount > positiveCount) return "negative";
    return "neutral";
  });

  const positive = sentiments.filter((s) => s === "positive").length;
  const negative = sentiments.filter((s) => s === "negative").length;
  const neutral = sentiments.filter((s) => s === "neutral").length;
  const total = testimonials.length;

  const positivePercent = Math.round((positive / total) * 100);
  const negativePercent = Math.round((negative / total) * 100);
  const neutralPercent = Math.round((neutral / total) * 100);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium mb-3">Sentiment Analysis</p>

      {/* Positive */}
      <div className="flex items-center gap-2">
        <Smile className="w-4 h-4 text-green-600" />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-green-700 dark:text-green-400 font-medium">Positive</span>
            <span className="text-muted-foreground">{positivePercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${positivePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Neutral */}
      <div className="flex items-center gap-2">
        <Meh className="w-4 h-4 text-gray-600" />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-700 dark:text-gray-400 font-medium">Neutral</span>
            <span className="text-muted-foreground">{neutralPercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-400"
              style={{ width: `${neutralPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Negative */}
      <div className="flex items-center gap-2">
        <Frown className="w-4 h-4 text-red-600" />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-700 dark:text-red-400 font-medium">Negative</span>
            <span className="text-muted-foreground">{negativePercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500"
              style={{ width: `${negativePercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
