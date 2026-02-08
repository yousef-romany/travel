"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, ArrowRight, Loader2, AlertCircle, Tag, Percent } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchUserBookings, type BookingType } from "@/fetch/bookings"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import BookingCancelDialog from "@/components/booking-cancel-dialog"
import { BookingListSkeleton } from "@/components/loading/ProfileSkeletons"
import { NoBookingsEmpty } from "@/components/ui/EmptyState"
import { useRouter } from "next/navigation"

export default function TripsSection() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cancelDialogData, setCancelDialogData] = useState<{
    bookingId: string;
    bookingCreatedAt: string;
    tripName: string;
  } | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
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
    return <BookingListSkeleton />;
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : "Failed to load bookings. Please try again.";
    const isConnectionError = errorMessage.includes("connect") || errorMessage.includes("backend");

    return (
      <Card className="border border-destructive/20 bg-destructive/5">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold mb-2">Unable to Load Bookings</h3>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            {isConnectionError && (
              <p className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg mb-4">
                💡 Make sure Strapi backend is running on port 1337
              </p>
            )}
          </div>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <NoBookingsEmpty
        onExplore={() => router.push("/programs")}
      />
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
        // Calculate event duration from startDate and endDate
        const eventDuration = trip.event?.startDate && trip.event?.endDate
          ? Math.ceil((new Date(trip.event.endDate).getTime() - new Date(trip.event.startDate).getTime()) / (1000 * 60 * 60 * 24))
          : 1;
        return {
          title: trip.event?.title || "Event",
          location: trip.event?.location || "Egypt",
          duration: eventDuration,
          imageUrl: getImageUrl(trip.event?.featuredImage || trip.event?.gallery?.[0]),
          detailsLink: trip.event?.documentId ? `/events/${trip.event.documentId}` : "#",
        };
      default: // program
        return {
          title: trip.program?.title || "Egypt Tour",
          location: trip.program?.Location || "Egypt",
          duration: trip.program?.duration || 1,
          imageUrl: getImageUrl(trip.program?.images?.[0]),
          detailsLink: trip.program?.documentId ? `/programs/${trip.program.documentId}` : "#",
        };
    }
  };

  return (
    <div className="space-y-4">
      {trips.map((trip, index) => {
        const details = getTripDetails(trip);
        const endDate = calculateEndDate(trip.travelDate, details.duration);
        const dateRange = `${formatDate(trip.travelDate)} - ${formatDate(endDate)}`;
        const bookingTypeBadge = trip.bookingType || "program";

        // Calculate pricing details
        const hasDiscount = trip.discountAmount && trip.discountAmount > 0;
        const originalPrice = hasDiscount ? (trip.totalAmount || 0) + (trip.discountAmount || 0) : trip.totalAmount;
        const finalPrice = trip.totalAmount || 0;
        const discountPercentage = hasDiscount && originalPrice ? Math.round(((trip.discountAmount || 0) / originalPrice) * 100) : 0;

        // Stagger animation delay (max 800ms)
        const delayClass = `animate-delay-${Math.min(index * 100, 800)}` as const;

        return (
          <Card
            key={trip.id}
            className={`group border border-primary/20 bg-gradient-to-br from-card to-card/50 overflow-hidden hover:border-primary/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-card-enter ${delayClass}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
              <div className="md:col-span-1 h-48 md:h-auto relative bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <Image
                  src={details.imageUrl}
                  alt={details.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Booking Type Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-black/60 backdrop-blur-sm text-white border-none shadow-lg">
                    {bookingTypeBadge === "custom-trip" ? "Custom Trip" : bookingTypeBadge === "event" ? "Event" : "Program"}
                  </Badge>
                </div>

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none shadow-lg animate-badge-pulse">
                      <Percent className="w-3 h-3 mr-1" />
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                )}
              </div>
              <div className="md:col-span-3">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl leading-tight">{details.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4" />
                        {details.location}
                      </CardDescription>

                      {/* Promo Code Badge */}
                      {trip.promoCodeId && (
                        <div className="flex items-center gap-2 mt-2">
                          <Tag className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-mono font-semibold text-green-600 dark:text-green-400">
                            Promo code applied
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge className={getStatusColor(trip.bookingStatus)}>
                      {trip.bookingStatus.charAt(0).toUpperCase() + trip.bookingStatus.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Date</p>
                      <p className="text-foreground font-semibold flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-primary" />
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
                        <Users className="w-4 h-4 text-primary" />
                        {trip.numberOfTravelers}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Total</p>
                      {hasDiscount ? (
                        <div className="mt-1">
                          <p className="text-sm text-muted-foreground line-through">
                            ${originalPrice?.toLocaleString()}
                          </p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            ${finalPrice?.toLocaleString()}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Saved ${trip.discountAmount?.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-primary mt-1">
                          ${finalPrice?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 gap-2" size="sm" asChild>
                      <Link href={details.detailsLink}>
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    {trip.bookingStatus === "pending" && (
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
