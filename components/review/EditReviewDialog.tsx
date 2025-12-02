"use client";

import { useState } from "react";
import { Pencil, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateTestimonial } from "@/fetch/testimonials";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EditReviewDialogProps {
  testimonialId: string;
  currentRating: number;
  currentComment: string;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export default function EditReviewDialog({
  testimonialId,
  currentRating,
  currentComment,
  onSuccess,
  triggerButton,
}: EditReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(currentRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(currentComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim() || comment.trim().length < 10) {
      toast.error("Please provide a review with at least 10 characters");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateTestimonial(testimonialId, {
        rating,
        comment: comment.trim(),
      });

      toast.success("Your review has been updated successfully!");
      setOpen(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Pencil className="w-4 h-4" />
            Edit Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            Edit Your Review
          </DialogTitle>
          <DialogDescription>
            Update your rating and comments about your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Your Rating</Label>
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
                    className="transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    <Star
                      className={cn(
                        "w-8 h-8 transition-colors",
                        isFilled
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      )}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ml-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {rating} {rating === 1 ? "star" : "stars"}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-semibold">
              Your Review <span className="text-muted-foreground">(minimum 10 characters)</span>
            </Label>
            <Textarea
              id="comment"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[150px] resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{comment.length} / 1000 characters</span>
              <span>{comment.length >= 10 ? "✓" : "✗"} Minimum 10 characters</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !comment.trim() || comment.trim().length < 10 || rating === 0}
            className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90"
          >
            {isSubmitting ? "Updating..." : "Update Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
