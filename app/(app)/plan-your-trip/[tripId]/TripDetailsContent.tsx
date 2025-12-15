/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlanTripById } from "@/fetch/plan-trip";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Calendar as CalendarIcon,
  DollarSign,
  Users,
  Clock,
  User,
  Mail,
  Share2,
  Send,
  CheckCircle,
  MessageSquare,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import OptimizedImage from "@/components/OptimizedImage";
import Testimonials from "@/components/testimonials";
import AddTestimonialDialog from "@/components/add-testimonial-dialog";
import { fetchCustomTripTestimonials, getUserTestimonial } from "@/fetch/testimonials";
import AverageRating from "@/components/review/AverageRating";
import ExportReviews from "@/components/review/ExportReviews";

interface TripDetailsContentProps {
  tripId: string;
}

export default function TripDetailsContent({ tripId }: TripDetailsContentProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["planTrip", tripId],
    queryFn: () => fetchPlanTripById(tripId),
    staleTime: 5 * 60 * 1000,
  });

  const trip = data?.data;

  // Fetch testimonials for this custom trip
  const { data: testimonialsData, refetch: refetchTestimonials } = useQuery({
    queryKey: ["customTripTestimonials", tripId],
    queryFn: () => fetchCustomTripTestimonials(tripId),
    enabled: !!tripId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user's existing review
  const { data: userReview } = useQuery({
    queryKey: ["userReview", tripId, user?.documentId],
    queryFn: () => getUserTestimonial(user!.documentId || "", "custom-trip", tripId),
    enabled: !!user && !!tripId,
  });

  console.log("Testimonials Data:", testimonialsData);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "quoted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "booked":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: trip?.tripName || "Custom Egypt Trip",
          text: `Check out this custom Egypt itinerary: ${trip?.tripName}`,
          url: url,
        })
        .catch(() => {
          // Fallback to clipboard
          navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
        });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleRequestQuote = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201555100961";

    const placesList = trip?.destinations
      ?.map((dest: any, idx: number) => `Day ${idx + 1}: ${dest.title} - $${dest.price}`)
      .join("\n");

    const message = `🌍 *Custom Trip Quote Request*

📝 *Trip:* ${trip?.tripName}

📍 *Itinerary:*
${placesList}

📊 *Trip Summary:*
⏱️ Duration: ${trip?.estimatedDuration} ${trip?.estimatedDuration === 1 ? "Day" : "Days"}
💰 Total Cost: $${trip?.totalPrice}
📈 Price/Day: $${trip?.pricePerDay?.toFixed(2)}
🧳 Destinations: ${trip?.destinations?.length}

${user ? `👤 *Contact Info:*\n📛 Name: ${user.profile?.firstName} ${user.profile?.lastName}\n📧 Email: ${user.email}\n` : ""}
I would like to get a personalized quote for this custom itinerary. Please contact me with more details.

Thank you! 🙏`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast.success("Opening WhatsApp to request quote!");
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please login to book this trip");
      router.push("/login");
      return;
    }

    // Navigate to booking page with trip details
    router.push(`/book-custom-trip/${tripId}`);
  };

  if (isLoading) return <Loading />;

  if (error || !trip) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <h1 className="text-2xl font-bold">Trip Not Found</h1>
          <p className="text-muted-foreground">
            This trip doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/plan-your-trip")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plan Your Trip
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/plan-your-trip")}
        className="mb-4 sm:mb-6 text-xs sm:text-sm"
      >
        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        Back to All Trips
      </Button>

      {/* Hero Section */}
      <div className="mb-6 sm:mb-8 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="inline-block mb-3 sm:mb-4">
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 text-primary text-xs sm:text-sm font-semibold rounded-full border border-primary/20">
                  ✨ Custom Travel Plan
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent leading-tight break-words">
                {trip.tripName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge className={getStatusColor(trip.tripStatus)}>
                  {trip.tripStatus.charAt(0).toUpperCase() + trip.tripStatus.slice(1)}
                </Badge>
                {trip.user && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="break-words">
                      Created by{" "}
                      <span className="font-semibold text-foreground">
                        {trip.user.username || trip.user.email?.split("@")[0] || "Anonymous"}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={handleShare} className="hover-lift text-xs sm:text-sm w-full sm:w-auto">
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Share
              </Button>
              <Button onClick={handleBookNow} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover-lift text-xs sm:text-sm w-full sm:w-auto">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Book This Trip
              </Button>
              <Button onClick={handleRequestQuote} className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 shadow-lg hover-lift text-xs sm:text-sm w-full sm:w-auto">
                <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Request Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardDescription className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              Destinations
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl md:text-2xl">{trip.destinations?.length || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardDescription className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              Duration
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl md:text-2xl">
              {trip.estimatedDuration} {trip.estimatedDuration === 1 ? "Day" : "Days"}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardDescription className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              Total Cost
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl md:text-2xl text-primary">
              ${trip.totalPrice?.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardDescription className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              Created By
            </CardDescription>
            <CardTitle className="text-sm sm:text-base md:text-lg truncate">{trip.user?.username || trip.user?.email?.split("@")[0] || "User"}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Trip Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Created On</p>
                  <p className="font-semibold flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    {formatDate(trip.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Last Updated</p>
                  <p className="font-semibold flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    {formatDate(trip.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Price per Day</p>
                  <p className="font-semibold text-primary">
                    ${trip.pricePerDay?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Trip Status</p>
                  <Badge className={getStatusColor(trip.tripStatus)}>
                    {trip.tripStatus.charAt(0).toUpperCase() + trip.tripStatus.slice(1)}
                  </Badge>
                </div>
              </div>

              {trip.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">Notes</p>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {trip.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card className="border-primary/20 shadow-xl">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2">
                <div className="p-1.5 sm:p-2.5 bg-gradient-to-r from-primary to-amber-600 rounded-xl flex-shrink-0">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    Complete Itinerary
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                    Day-by-day breakdown of your Egyptian adventure
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[15px] sm:left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-amber-500 to-primary/20" />

                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  {trip.destinations?.map((dest: any, index: number) => (
                    <div
                      key={index}
                      className="relative pl-10 sm:pl-12 md:pl-16 group animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-primary to-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg shadow-lg z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        {index + 1}
                      </div>

                      <div className="bg-gradient-to-br from-background via-background/90 to-primary/5 border border-primary/10 rounded-lg sm:rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group-hover:translate-x-2">
                        {/* Image header if image exists */}
                        {dest.image && (
                          <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-primary/5 to-amber-500/5">
                            <OptimizedImage
                              src={dest.image}
                              alt={dest.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />

                            {/* Day badge on image */}
                            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gradient-to-r from-primary to-amber-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                              Day {index + 1}
                            </div>

                            {/* Price badge */}
                            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-background/90 backdrop-blur-sm text-primary px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg border border-primary/20">
                              ${dest.price}
                            </div>
                          </div>
                        )}

                        <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                          <div className="flex items-start justify-between gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              {/* Day badge if no image */}
                              {!dest.image && (
                                <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-primary/10 to-amber-600/10 text-primary text-[10px] sm:text-xs font-semibold rounded-full border border-primary/20 mb-1.5 sm:mb-2">
                                  Day {index + 1}
                                </span>
                              )}

                              <h4 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3 group-hover:text-primary transition-colors leading-tight break-words">
                                {dest.title}
                              </h4>
                              {dest.location && (
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 bg-muted/30 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg w-fit">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                                  <span className="font-medium break-words">{dest.location}</span>
                                </div>
                              )}
                              {dest.description && (
                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed break-words">
                                  {dest.description}
                                </p>
                              )}
                            </div>
                            {!dest.image && (
                              <div className="text-right flex-shrink-0">
                                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 font-medium">Day Cost</p>
                                <div className="px-2 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-br from-primary/10 to-amber-600/10 rounded-lg border border-primary/20 shadow-sm">
                                  <p className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">${dest.price}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary footer */}
              <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">
                    Total duration: <span className="font-bold text-foreground">{trip.estimatedDuration} {trip.estimatedDuration === 1 ? 'Day' : 'Days'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm">
                    <span className="font-bold text-foreground">{trip.destinations?.length}</span> destinations
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card className="border-primary/20 shadow-xl bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Price Breakdown
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trip.destinations?.map((dest: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors">
                    <span className="text-sm font-medium text-muted-foreground">
                      <span className="font-bold text-foreground">Day {index + 1}:</span> {dest.title}
                    </span>
                    <span className="font-bold text-lg text-primary">${dest.price}</span>
                  </div>
                ))}
                <div className="border-t border-primary/20 pt-4 mt-4">
                  <div className="bg-gradient-to-r from-primary/5 to-amber-500/5 rounded-xl p-5 border border-primary/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">Total Estimated Cost</span>
                      <span className="font-bold text-3xl bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                        ${trip.totalPrice?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Average per day</span>
                      <span className="font-semibold text-foreground">${trip.pricePerDay?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Creator Info */}
          {trip.user && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trip Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {trip.user.username || trip.user.email?.split("@")[0] || "Anonymous"}
                    </p>
                    {trip.user.email && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {trip.user.email}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trip Stats */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Trip Statistics</CardTitle>
              <CardDescription>Overview of your custom trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Days</span>
                  <span className="font-bold text-primary">{trip.estimatedDuration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Destinations</span>
                  <span className="font-bold text-primary">{trip.destinations?.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Cost/Day</span>
                  <span className="font-bold text-primary">${trip.pricePerDay?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(trip.tripStatus)}>
                    {trip.tripStatus.charAt(0).toUpperCase() + trip.tripStatus.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 sm:px-6 pb-4 sm:pb-6">
              <Button onClick={handleBookNow} className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-2 sm:py-2.5">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Book This Trip
              </Button>
              <Button onClick={handleRequestQuote} className="w-full text-xs sm:text-sm py-2 sm:py-2.5">
                <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Request Quote
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full text-xs sm:text-sm py-2 sm:py-2.5">
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Share This Trip
              </Button>
              <Button
                onClick={() => router.push("/plan-your-trip/create")}
                variant="outline"
                className="w-full text-xs sm:text-sm py-2 sm:py-2.5"
              >
                Create Your Own
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials & Reviews Section */}
      <div className="mt-12">
        <Card className="border-primary/20 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-primary to-amber-600 rounded-xl">
                  <MessageSquare className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    Trip Reviews
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {testimonialsData?.data && testimonialsData.data.length > 0
                      ? `${testimonialsData.data.length} ${testimonialsData.data.length === 1 ? 'review' : 'reviews'} from travelers`
                      : "Be the first to review this custom trip"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {testimonialsData?.data && testimonialsData.data.length > 0 && (
                  <ExportReviews
                    testimonials={testimonialsData.data}
                    programTitle={trip?.tripName || "Custom Trip"}
                  />
                )}
                <AddTestimonialDialog
                  isOpen={isReviewDialogOpen}
                  onClose={() => setIsReviewDialogOpen(false)}
                  testimonialType="custom-trip"
                  relatedId={tripId}
                  relatedName={trip?.tripName || "Custom Trip"}
                  existingTestimonial={userReview || undefined}
                  queryKey={["customTripTestimonials", tripId]}
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
                <AverageRating testimonials={testimonialsData.data} className="mb-8" />
                <Testimonials
                  testimonials={testimonialsData.data}
                  showRelatedContent={false}
                />
              </>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-xl bg-muted/20">
                <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to share your experience with this custom trip!
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
