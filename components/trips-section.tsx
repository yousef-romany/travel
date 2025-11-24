"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchUserBookings, updateBookingStatus } from "@/fetch/bookings"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function TripsSection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userBookings", user?.documentId],
    queryFn: () => fetchUserBookings(user?.documentId),
    enabled: !!user?.documentId,
    staleTime: 2 * 60 * 1000,
  });

  const trips = data?.data || [];

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => updateBookingStatus(bookingId, "cancelled"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      toast.success("Booking cancelled successfully");
      setBookingToCancel(null);
    },
    onError: (error) => {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    },
  });

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
  };

  const confirmCancelBooking = () => {
    if (bookingToCancel) {
      cancelBookingMutation.mutate(bookingToCancel);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "confirmed":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const calculateEndDate = (startDate: string, duration: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + (duration - 1));
    return end.toISOString();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">Failed to load trips</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">No trips yet</p>
          <p className="text-sm text-muted-foreground mb-4">Start planning your Egyptian adventure!</p>
          <Button asChild>
            <Link href="/programs">Browse Programs</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => {
        const imageUrl = getImageUrl(trip.program?.images?.[0]?.url);
        const endDate = trip.program?.duration
          ? calculateEndDate(trip.travelDate, trip.program.duration)
          : trip.travelDate;
        const dateRange = `${formatDate(trip.travelDate)} - ${formatDate(endDate)}`;

        return (
          <Card
            key={trip.id}
            className="border border-border bg-card overflow-hidden hover:border-amber-500/30 transition-all shadow-sm hover:shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
              <div className="md:col-span-1 h-48 md:h-auto relative bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={trip.program?.title || "Trip image"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-3">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{trip.program?.title || "Egypt Tour"}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4" />
                        {trip.program?.Location || "Egypt"}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Date</p>
                      <p className="text-foreground font-semibold flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        {dateRange}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Duration</p>
                      <p className="text-foreground font-semibold mt-1">
                        {trip.program?.duration || 1} Days
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Travelers</p>
                      <p className="text-foreground font-semibold flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4 text-amber-500" />
                        {trip.numberOfTravelers}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Total</p>
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-500 mt-1">
                        ${trip.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-amber-600 hover:bg-amber-700 gap-2" size="sm" asChild>
                      <a href={`/programs/${encodeURIComponent(trip.program?.title || "")}`}>
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </Button>
                    {trip.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(trip.documentId)}
                        disabled={cancelBookingMutation.isPending}
                      >
                        {cancelBookingMutation.isPending && bookingToCancel === trip.documentId
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingToCancel(null)}>
              No, Keep Booking
            </Button>
            <Button
              onClick={confirmCancelBooking}
              variant="destructive"
              disabled={cancelBookingMutation.isPending}
            >
              {cancelBookingMutation.isPending ? "Cancelling..." : "Yes, Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
