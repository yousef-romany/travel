"use client";

import { MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Testimonials from "@/components/testimonials";
import ReviewDialog from "@/components/review/ReviewDialog";
import { Testimonial } from "@/fetch/testimonials";

interface CommentSectionProps {
  type: "place" | "general";
  relatedId?: string;
  relatedTitle?: string;
  testimonials?: Testimonial[];
  isLoading?: boolean;
  onRefetch?: () => void;
}

export default function CommentSection({
  type,
  relatedId,
  relatedTitle,
  testimonials = [],
  isLoading = false,
  onRefetch,
}: CommentSectionProps) {
  return (
    <div className="mt-12 animate-slide-up">
      <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-primary to-amber-600 rounded-xl">
              <MessageSquare className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Comments & Reviews
              </h2>
              <p className="text-muted-foreground text-sm">
                {testimonials.length > 0
                  ? `${testimonials.length} ${testimonials.length === 1 ? 'comment' : 'comments'} from our community`
                  : "Be the first to share your thoughts"}
              </p>
            </div>
          </div>
          <ReviewDialog
            type={type}
            relatedId={relatedId}
            relatedTitle={relatedTitle}
            onSuccess={onRefetch}
            triggerButton={
              <Button className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 gap-2 text-sm sm:text-base">
                <MessageSquare className="w-4 h-4" />
                Add Comment
              </Button>
            }
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="bg-muted rounded-lg p-4 sm:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted-foreground/20 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 sm:h-4 bg-muted-foreground/20 rounded w-3/4" />
                      <div className="h-2 sm:h-3 bg-muted-foreground/20 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 sm:h-3 bg-muted-foreground/20 rounded" />
                    <div className="h-2 sm:h-3 bg-muted-foreground/20 rounded" />
                    <div className="h-2 sm:h-3 bg-muted-foreground/20 rounded w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <Testimonials
            testimonials={testimonials}
            showRelatedContent={false}
          />
        ) : (
          <div className="text-center py-8 sm:py-12 border-2 border-dashed border-primary/20 rounded-xl bg-muted/20">
            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No comments yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 px-4">
              Be the first to share your thoughts and experience!
            </p>
            <ReviewDialog
              type={type}
              relatedId={relatedId}
              relatedTitle={relatedTitle}
              onSuccess={onRefetch}
              triggerButton={
                <Button size="lg" className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 gap-2 text-sm sm:text-base">
                  <Star className="w-4 h-4 sm:w-5 sm:w-5" />
                  Write the First Comment
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
