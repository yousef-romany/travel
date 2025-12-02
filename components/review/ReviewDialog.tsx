"use client";

import { useState } from "react";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { createTestimonial } from "@/fetch/testimonials";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReviewDialogProps {
  type: "program" | "event" | "custom-trip" | "place" | "general";
  relatedId?: string;
  relatedTitle?: string;
  triggerButton?: React.ReactNode;
  onSuccess?: () => void;
}

export default function ReviewDialog({
  type,
  relatedId,
  relatedTitle,
  triggerButton,
  onSuccess,
}: ReviewDialogProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to submit a review");
      router.push("/login");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const testimonialData: any = {
        rating,
        comment: comment.trim(),
        testimonialType: type,
        userId: user.documentId,
      };

      // Add the appropriate relation based on type
      switch (type) {
        case "program":
          if (relatedId) testimonialData.programId = relatedId;
          break;
        case "event":
          if (relatedId) testimonialData.eventId = relatedId;
          break;
        case "place":
          if (relatedId) testimonialData.placeId = relatedId;
          break;
        case "custom-trip":
          if (relatedId)
            testimonialData.plan_trip = {
              connect: [relatedId],
            };
          break;
      }

      await createTestimonial(testimonialData);

      toast.success(
        "Thank you for your review! It will be published after admin approval.",
        { duration: 5000 }
      );

      // Reset form
      setRating(0);
      setComment("");
      setOpen(false);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(
        error.response?.data?.error?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "program":
        return "Program";
      case "event":
        return "Event";
      case "custom-trip":
        return "Custom Trip";
      case "place":
        return "Place";
      default:
        return "Experience";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Write a Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Share Your Experience
          </DialogTitle>
          <DialogDescription>
            {relatedTitle
              ? `Tell us about your experience with ${relatedTitle}`
              : `Tell us about your ${getTypeLabel().toLowerCase()} experience`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <Label htmlFor="rating" className="text-base font-semibold">
              Rating
            </Label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    aria-label={`Rate ${starValue} stars`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        starValue <= (hoveredRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      }`}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                  {rating} {rating === 1 ? "star" : "stars"}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-base font-semibold">
              Your Review
            </Label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts, experiences, and recommendations..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters ({comment.length}/10)
            </p>
          </div>

          {/* Notice */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Your review
              will be visible after admin approval. We review all submissions to
              ensure quality and authenticity.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || comment.length < 10}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
