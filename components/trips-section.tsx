"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchUserBookings, type BookingType } from "@/fetch/bookings"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import BookingCancelDialog from "@/components/booking-cancel-dialog"

export default function TripsSection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancelDialogData, setCancelDialogData] = useState<{
    bookingId: string;
    bookingCreatedAt: string;
    tripName: string;
  } | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userBookings", user?.documentId],
    queryFn: () => fetchUserBookings(user?.documentId),
    enabled: !!user?.documentId,
    staleTime: 2 * 60 * 1000,
  });

  const trips = data?.data || [];

  const handleCancelBooking = (bookingId: string, createdAt: string, tripName: string) => {
    setCancelDialogData({
      bookingId,
      bookingCreatedAt: createdAt,
      tripName,
    });
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

  // Helper to get trip details based on booking type
  const getTripDetails = (trip: BookingType) => {
    const bookingType = trip.bookingType || "program";

    switch (bookingType) {
      case "custom-trip":
        return {
          title: trip.customTripName || trip.plan_trip?.tripName || "Custom Trip",
          location: `${trip.plan_trip?.destinations?.length || 0} destinations`,
          duration: trip.plan_trip?.estimatedDuration || 1,
          imageUrl: "/placeholder.jpg", // Default image for custom trips
          detailsLink: trip.plan_trip?.documentId ? `/plan-your-trip/${trip.plan_trip.documentId}` : "#",
        };
      case "event":
        return {
          title: trip.event?.title || "Event",
          location: trip.event?.location || "Egypt",
          duration: trip.event?.duration || 1,
          imageUrl: getImageUrl(trip.event?.images?.[0]?.url),
          detailsLink: trip.event?.documentId ? `/business-events/${trip.event.documentId}` : "#",
        };
      default: // program
        return {
          title: trip.program?.title || "Egypt Tour",
          location: trip.program?.Location || "Egypt",
          duration: trip.program?.duration || 1,
          imageUrl: getImageUrl(trip.program?.images?.[0]?.url),
          detailsLink: trip.program?.title ? `/programs/${encodeURIComponent(trip.program.title)}` : "#",
        };
    }
  };

  return (
    <div className="space-y-4">
      {trips.map((trip) => {
        const details = getTripDetails(trip);
        const endDate = calculateEndDate(trip.travelDate, details.duration);
        const dateRange = `${formatDate(trip.travelDate)} - ${formatDate(endDate)}`;
        const bookingTypeBadge = trip.bookingType || "program";

        return (
          <Card
            key={trip.id}
            className="border border-border bg-card overflow-hidden hover:border-amber-500/30 transition-all shadow-sm hover:shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
              <div className="md:col-span-1 h-48 md:h-auto relative bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <Image
                  src={details.imageUrl}
                  alt={details.title}
                  fill
                  className="object-cover"
                />
                {/* Booking Type Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-black/60 text-white border-none">
                    {bookingTypeBadge === "custom-trip" ? "Custom Trip" : bookingTypeBadge === "event" ? "Event" : "Program"}
                  </Badge>
                </div>
              </div>
              <div className="md:col-span-3">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{details.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4" />
                        {details.location}
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
                        {details.duration} Days
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
                      <Link href={details.detailsLink}>
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    {trip.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(trip.documentId, trip.createdAt, details.title)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Cancel Booking Dialog with 24-hour policy */}
      {cancelDialogData && (
        <BookingCancelDialog
          isOpen={!!cancelDialogData}
          onClose={() => setCancelDialogData(null)}
          bookingId={cancelDialogData.bookingId}
          bookingCreatedAt={cancelDialogData.bookingCreatedAt}
          tripName={cancelDialogData.tripName}
        />
      )}
    </div>
  )
}
