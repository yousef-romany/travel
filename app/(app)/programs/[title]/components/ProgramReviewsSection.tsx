"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddTestimonialDialog from "@/components/add-testimonial-dialog";
import { fetchProgramTestimonials, getUserTestimonial } from "@/fetch/testimonials";
import AverageRating from "@/components/review/AverageRating";
import TestimonialsWithFilters from "@/components/review/TestimonialsWithFilters";
import ReviewStatistics from "@/components/review/ReviewStatistics";
import FeaturedReviews from "@/components/review/FeaturedReviews";
import ExportReviews from "@/components/review/ExportReviews";
import { useAuth } from "@/context/AuthContext";
import { dataTypeCardTravel } from "@/type/programs";

interface ProgramReviewsSectionProps {
  program: dataTypeCardTravel;
  initialTestimonials: any[];
}

export function ProgramReviewsSection({ program, initialTestimonials }: ProgramReviewsSectionProps) {
  const { user } = useAuth();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Fetch testimonials with real-time updates
  const { data: testimonialsData } = useQuery({
    queryKey: ["programTestimonials", program?.documentId],
    queryFn: () => fetchProgramTestimonials(program?.documentId || ""),
    enabled: !!program?.documentId,
    staleTime: 5 * 60 * 1000,
    initialData: {
      data: initialTestimonials,
      meta: {
        pagination: {
          page: 1,
          pageSize: initialTestimonials.length,
          pageCount: 1,
          total: initialTestimonials.length
        }
      }
    },
  });

  // Fetch user's existing review
  const { data: userReview } = useQuery({
    queryKey: ["userReview", program?.documentId, user?.documentId],
    queryFn: () => getUserTestimonial(user!.documentId || "", "program", program?.documentId || ""),
    enabled: !!user && !!program?.documentId,
  });

  return (
    <section className="mt-12 animate-slide-up animate-delay-600">
      <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-primary to-amber-600 rounded-xl">
              <MessageSquare className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Reviews & Testimonials
              </h2>
              <p className="text-muted-foreground text-sm">
                {testimonialsData?.data && testimonialsData.data.length > 0
                  ? `${testimonialsData.data.length} ${testimonialsData.data.length === 1 ? 'review' : 'reviews'} from our travelers`
                  : "Be the first to share your experience"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {testimonialsData?.data && testimonialsData.data.length > 0 && (
              <ExportReviews
                testimonials={testimonialsData.data}
                programTitle={program?.title}
              />
            )}
            <AddTestimonialDialog
              isOpen={isReviewDialogOpen}
              onClose={() => setIsReviewDialogOpen(false)}
              testimonialType="program"
              relatedId={program?.documentId}
              relatedName={program?.title}
              existingTestimonial={userReview || undefined}
              queryKey={["programTestimonials", program?.documentId || ""]}
            />
            <Button
              onClick={() => setIsReviewDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              {userReview ? "Edit Review" : "Write a Review"}
            </Button>
          </div>
        </div>

        {testimonialsData?.data && testimonialsData.data.length > 0 ? (
          <>
            <ReviewStatistics testimonials={testimonialsData.data} className="mb-8" />
            <AverageRating testimonials={testimonialsData.data} className="mb-8" />
            {testimonialsData.data.length >= 3 && (
              <FeaturedReviews testimonials={testimonialsData.data} className="mb-8" />
            )}
            <div className="pt-6 border-t border-primary/10">
              <h3 className="text-xl font-bold mb-6">All Reviews</h3>
              <TestimonialsWithFilters
                testimonials={testimonialsData.data}
                showRelatedContent={false}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-xl bg-muted/20">
            <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share your experience with this amazing program!
            </p>
            <Button
              size="lg"
              onClick={() => setIsReviewDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 gap-2"
            >
              <Star className="w-5 h-5" />
              Write the First Review
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
