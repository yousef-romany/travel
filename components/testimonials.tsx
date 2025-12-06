"use client";

import { Star, CheckCircle, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Testimonial } from "@/fetch/testimonials";
import { format } from "date-fns";
import ShareTestimonial from "@/components/review/ShareTestimonial";
import HelpfulVotes from "@/components/review/HelpfulVotes";
import EditReviewDialog from "@/components/review/EditReviewDialog";
import { useAuth } from "@/context/AuthContext";

interface TestimonialsProps {
  testimonials: Testimonial[];
  showRelatedContent?: boolean;
  className?: string;
  onReviewUpdate?: () => void;
}

export default function Testimonials({
  testimonials,
  showRelatedContent = true,
  className = "",
  onReviewUpdate,
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
          onReviewUpdate={onReviewUpdate}
        />
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  showRelatedContent?: boolean;
  onReviewUpdate?: () => void;
}

function TestimonialCard({ testimonial, showRelatedContent = true, onReviewUpdate }: TestimonialCardProps) {
  const { user } = useAuth();
  const isExternalReview = testimonial.externalReviewUrl && testimonial.reviewSource !== "user";

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
    // For external reviews, use reviewerName if available
    if (isExternalReview && testimonial.reviewerName) {
      return testimonial.reviewerName;
    }
    if (testimonial.user?.profile?.firstName && testimonial.user?.profile?.lastName) {
      return `${testimonial.user.profile.firstName} ${testimonial.user.profile.lastName}`;
    }
    return testimonial.user?.username || "Anonymous";
  };

  const getBackgroundImage = () => {
    if (!isExternalReview) return null;

    switch (testimonial.reviewSource) {
      case "viator":
        return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop";
      case "tripadvisor":
        return "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=300&fit=crop";
      case "getyourguide":
        return "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400&h=300&fit=crop";
      case "tourhq":
        return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop";
      default:
        return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop";
    }
  };

  const getReviewSourceBadge = () => {
    if (!isExternalReview) return null;

    const sourceColors = {
      viator: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
      tripadvisor: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      getyourguide: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      tourhq: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    };

    const sourceNames = {
      viator: "Viator",
      tripadvisor: "TripAdvisor",
      getyourguide: "GetYourGuide",
      tourhq: "TourHQ",
    };

    const source = testimonial.reviewSource as keyof typeof sourceColors;
    return (
      <Badge className={sourceColors[source] || "bg-gray-100 text-gray-700"}>
        <ExternalLink className="w-3 h-3 mr-1" />
        {sourceNames[source] || testimonial.reviewSource}
      </Badge>
    );
  };

  const handleCardClick = () => {
    if (isExternalReview && testimonial.externalReviewUrl) {
      window.open(testimonial.externalReviewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5: return "Excellent";
      case 4: return "Very Good";
      case 3: return "Good";
      case 2: return "Fair";
      case 1: return "Poor";
      default: return "Not Rated";
    }
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
  const backgroundImage = getBackgroundImage();

  return (
    <Card
      className={`border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl group overflow-hidden ${isExternalReview ? 'cursor-pointer' : ''}`}
    >
      {/* Background Image for External Reviews */}
      {backgroundImage && (
        <div className="relative w-full h-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          {/* Source Badge on Image */}
          <div className="absolute top-3 right-3">
            {getReviewSourceBadge()}
          </div>
        </div>
      )}

      <CardContent className="p-6 space-y-4">
        {/* Source Badge for cards without background image */}
        {!backgroundImage && isExternalReview && (
          <div className="flex justify-end -mt-2 -mr-2">
            {getReviewSourceBadge()}
          </div>
        )}

        {/* Header: User Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.reviewerName || testimonial.user?.username}`} />
              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-amber-500/10 text-primary font-semibold">
                {getInitials(
                  testimonial.user?.profile?.firstName,
                  testimonial.user?.profile?.lastName,
                  testimonial.reviewerName || testimonial.user?.username
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{getFullName()}</p>
                {testimonial.isVerified && (
                  <CheckCircle className="w-4 h-4 text-green-500" aria-label="Verified Customer" />
                )}
                {isExternalReview && (
                  <ExternalLink className="w-3 h-3 text-muted-foreground" aria-label="External Review" onClick={handleCardClick} />
                )}
              </div>
              {testimonial.user?.profile?.country && (
                <p className="text-xs text-muted-foreground">{testimonial.user.profile.country}</p>
              )}
              {isExternalReview && testimonial.reviewDate && (
                <p className="text-xs text-muted-foreground">
                  Reviewed on {format(new Date(testimonial.reviewDate), "MMM dd, yyyy")}
                </p>
              )}
            </div>
          </div>
          {/* Edit button for own reviews (only for non-external reviews) */}
          {!isExternalReview && user && testimonial.user && user.documentId === testimonial.user.documentId && (
            <EditReviewDialog
              testimonialId={testimonial.documentId}
              currentRating={testimonial.rating}
              currentComment={testimonial.comment}
              onSuccess={onReviewUpdate}
            />
          )}
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  index < testimonial.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
            {getRatingText(testimonial.rating)}
          </span>
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

        {/* Helpful Votes */}
        <div className="pt-3 border-t border-border/50">
          <HelpfulVotes
            testimonialId={testimonial.documentId}
            initialHelpful={testimonial.helpfulVotes || 0}
            initialUnhelpful={testimonial.unhelpfulVotes || 0}
          />
        </div>

        {/* Footer: Date and Share */}
        <div className="flex items-center justify-between pt-3">
          <p className="text-xs text-muted-foreground">
            {format(new Date(testimonial.createdAt), "MMM dd, yyyy")}
          </p>
          {relatedContent && relatedContent.name && (
            <ShareTestimonial
              testimonial={testimonial}
              contentType={testimonial.testimonialType as "program" | "event" | "custom-trip"}
              contentTitle={relatedContent.name}
            />
          )}
        </div>
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
