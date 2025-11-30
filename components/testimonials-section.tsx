"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { fetchUserTestimonials, deleteTestimonial, Testimonial } from "@/fetch/testimonials";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddTestimonialForm from "@/components/add-testimonial-form";

export default function TestimonialsSection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);

  const { data: testimonialsData, isLoading, isError, error } = useQuery({
    queryKey: ["userTestimonials", user?.documentId],
    queryFn: () => fetchUserTestimonials(user?.documentId),
    enabled: !!user?.documentId,
    retry: 2,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTestimonials", user?.documentId] });
      toast.success("Testimonial deleted successfully");
      setDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    },
    onError: (error: any) => {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial. Please try again.");
    },
  });

  const handleDelete = (testimonialId: string) => {
    setTestimonialToDelete(testimonialId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (testimonialToDelete) {
      deleteMutation.mutate(testimonialToDelete);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingTestimonial(null);
  };

  const getStatusBadge = (testimonial: Testimonial) => {
    if (testimonial.isApproved) {
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
        <Clock className="w-3 h-3 mr-1" />
        Pending Review
      </Badge>
    );
  };

  const getRelatedContentName = (testimonial: Testimonial) => {
    switch (testimonial.testimonialType) {
      case "program":
        return testimonial.program?.title;
      case "event":
        return testimonial.event?.title;
      case "custom-trip":
        return testimonial.plan_trip?.tripName;
      case "place":
        return testimonial.place?.title;
      default:
        return "General Review";
    }
  };

  const testimonials = testimonialsData?.data || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="border rounded-lg p-4 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-6 bg-muted rounded w-20" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground mb-2">Failed to Load Reviews</p>
            <p className="text-sm text-muted-foreground mb-6">
              We couldn't fetch your reviews. Please check your connection and try again.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Reviews</CardTitle>
            <Button
              onClick={() => setShowAddForm(true)}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Review
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6">
              <AddTestimonialForm
                testimonialType="general"
                existingTestimonial={editingTestimonial || undefined}
                queryKey={["userTestimonials", user?.documentId || ""]}
                onSuccess={handleFormClose}
                className="mb-6"
              />
              <Button variant="outline" onClick={handleFormClose} className="w-full">
                Cancel
              </Button>
            </div>
          )}

          {testimonials.length === 0 && !showAddForm && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold text-foreground mb-2">No Reviews Yet</p>
              <p className="text-sm text-muted-foreground mb-2">
                You haven't written any reviews or testimonials.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Share your travel experiences to help other travelers plan their trips!
              </p>
              <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Write Your First Review
              </Button>
            </div>
          )}

          {testimonials.length > 0 && (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
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
                          <span className="text-sm font-semibold ml-1">{testimonial.rating}.0</span>
                        </div>
                        {getStatusBadge(testimonial)}
                        {testimonial.isVerified && (
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {getRelatedContentName(testimonial)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(testimonial.createdAt), "MMMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(testimonial)}
                        disabled={testimonial.isApproved}
                        title={testimonial.isApproved ? "Cannot edit approved testimonials" : "Edit"}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(testimonial.documentId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{testimonial.comment}</p>
                  {!testimonial.isApproved && (
                    <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-md">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Your review is pending approval. It will be visible to others once our team verifies it.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
