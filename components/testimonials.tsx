"use client";

import { Star, CheckCircle, MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Testimonial } from "@/fetch/testimonials";
import { format } from "date-fns";

interface TestimonialsProps {
  testimonials: Testimonial[];
  showRelatedContent?: boolean;
  className?: string;
}

export default function Testimonials({
  testimonials,
  showRelatedContent = true,
  className = "",
}: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No testimonials yet. Be the first to share your experience!
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          showRelatedContent={showRelatedContent}
        />
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  showRelatedContent?: boolean;
}

function TestimonialCard({ testimonial, showRelatedContent = true }: TestimonialCardProps) {
  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getFullName = () => {
    if (testimonial.user?.profile?.firstName && testimonial.user?.profile?.lastName) {
      return `${testimonial.user.profile.firstName} ${testimonial.user.profile.lastName}`;
    }
    return testimonial.user?.username || "Anonymous";
  };

  const getRelatedContent = () => {
    switch (testimonial.testimonialType) {
      case "program":
        return {
          type: "Program",
          name: testimonial.program?.title,
          icon: <MapPin className="w-3 h-3" />,
          color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
        };
      case "event":
        return {
          type: "Event",
          name: testimonial.event?.title,
          icon: <Calendar className="w-3 h-3" />,
          color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
        };
      case "custom-trip":
        return {
          type: "Custom Trip",
          name: testimonial.plan_trip?.tripName,
          icon: <MapPin className="w-3 h-3" />,
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        };
      case "place":
        return {
          type: "Place",
          name: testimonial.place?.title,
          icon: <MapPin className="w-3 h-3" />,
          color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
        };
      default:
        return null;
    }
  };

  const relatedContent = getRelatedContent();

  return (
    <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6 space-y-4">
        {/* Header: User Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.user?.username}`} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(
                  testimonial.user?.profile?.firstName,
                  testimonial.user?.profile?.lastName,
                  testimonial.user?.username
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{getFullName()}</p>
                {testimonial.isVerified && (
                  <CheckCircle className="w-4 h-4 text-green-500" aria-label="Verified Customer" />
                )}
              </div>
              {testimonial.user?.profile?.country && (
                <p className="text-xs text-muted-foreground">{testimonial.user.profile.country}</p>
              )}
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < testimonial.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
              }`}
            />
          ))}
          <span className="text-sm font-semibold ml-2">{testimonial.rating}.0</span>
        </div>

        {/* Comment */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          "{testimonial.comment}"
        </p>

        {/* Related Content Badge */}
        {showRelatedContent && relatedContent && relatedContent.name && (
          <div className="flex items-center gap-2 pt-2">
            <Badge className={`text-xs ${relatedContent.color}`}>
              <span className="flex items-center gap-1">
                {relatedContent.icon}
                {relatedContent.type}
              </span>
            </Badge>
            <p className="text-xs text-muted-foreground truncate">{relatedContent.name}</p>
          </div>
        )}

        {/* Date */}
        <p className="text-xs text-muted-foreground">
          {format(new Date(testimonial.createdAt), "MMM dd, yyyy")}
        </p>
      </CardContent>
    </Card>
  );
}

// Compact version for homepage/sidebars
export function CompactTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const getFullName = () => {
    if (testimonial.user?.profile?.firstName && testimonial.user?.profile?.lastName) {
      return `${testimonial.user.profile.firstName} ${testimonial.user.profile.lastName}`;
    }
    return testimonial.user?.username || "Anonymous";
  };

  return (
    <Card className="border-primary/20">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.user?.username}`} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getFullName()[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-xs truncate">{getFullName()}</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-3 h-3 ${
                    index < testimonial.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-3">"{testimonial.comment}"</p>
      </CardContent>
    </Card>
  );
}
