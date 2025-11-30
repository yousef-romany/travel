"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star, Loader2, CheckCircle } from "lucide-react";
import { createTestimonial, updateTestimonial, Testimonial } from "@/fetch/testimonials";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddTestimonialFormProps {
  testimonialType: "program" | "event" | "custom-trip" | "place" | "general";
  relatedId?: string;
  relatedName?: string;
  existingTestimonial?: Testimonial;
  queryKey?: string[];
  onSuccess?: () => void;
  className?: string;
}

export default function AddTestimonialForm({
  testimonialType,
  relatedId,
  relatedName,
  existingTestimonial,
  queryKey = ["testimonials"],
  onSuccess,
  className = "",
}: AddTestimonialFormProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(existingTestimonial?.rating || 5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingTestimonial?.comment || "");

  const createMutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success(
        "Thank you for your feedback! Your testimonial will be reviewed and published soon.",
        { duration: 5000 }
      );
      resetForm();
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Error creating testimonial:", error);
      const errorMessage =
        error.response?.data?.error?.message || "Failed to submit testimonial. Please try again.";
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ testimonialId, data }: { testimonialId: string; data: any }) =>
      updateTestimonial(testimonialId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Your testimonial has been updated successfully!");
      resetForm();
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Error updating testimonial:", error);
      const errorMessage =
        error.response?.data?.error?.message || "Failed to update testimonial. Please try again.";
      toast.error(errorMessage);
    },
  });

  const resetForm = () => {
    setRating(5);
    setHoveredRating(0);
    setComment("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to submit a testimonial");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters");
      return;
    }

    if (existingTestimonial) {
      // Update existing testimonial
      updateMutation.mutate({
        testimonialId: existingTestimonial.documentId,
        data: {
          rating,
          comment: comment.trim(),
        },
      });
    } else {
      // Create new testimonial
      const testimonialData: any = {
        rating,
        comment: comment.trim(),
        testimonialType,
        userId: user.documentId,
      };

      // Add relation based on type
      if (testimonialType === "program" && relatedId) {
        testimonialData.programId = relatedId;
      } else if (testimonialType === "event" && relatedId) {
        testimonialData.eventId = relatedId;
      } else if (testimonialType === "custom-trip" && relatedId) {
        testimonialData.planTripId = relatedId;
      } else if (testimonialType === "place" && relatedId) {
        testimonialData.placeId = relatedId;
      }

      createMutation.mutate(testimonialData);
    }
  };

  const getFormTitle = () => {
    if (existingTestimonial) {
      return "Edit Your Review";
    }
    if (relatedName) {
      return `Review ${relatedName}`;
    }
    return "Share Your Experience";
  };

  const getFormDescription = () => {
    if (existingTestimonial) {
      return "Update your review and rating.";
    }
    return "Your feedback helps other travelers make informed decisions. All reviews are verified before publishing.";
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to leave a review</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{getFormTitle()}</CardTitle>
        <CardDescription>{getFormDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= (hoveredRating || rating);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-sm font-semibold text-muted-foreground">
                {rating} {rating === 1 ? "star" : "stars"}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience... What did you enjoy most? What could be improved?"
              rows={6}
              className="resize-none"
              required
              minLength={10}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/1000 characters (minimum 10)
            </p>
          </div>

          {/* Info Banner */}
          {!existingTestimonial && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    Review Verification Process
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Your testimonial will be reviewed by our team to ensure authenticity. Verified
                    reviews are typically published within 24-48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {existingTestimonial && (
              <Button type="button" variant="outline" onClick={resetForm} disabled={isPending}>
                Reset
              </Button>
            )}
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {existingTestimonial ? "Updating..." : "Submitting..."}
                </>
              ) : (
                <>{existingTestimonial ? "Update Review" : "Submit Review"}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
