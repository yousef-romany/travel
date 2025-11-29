/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import OptimizedImage from "@/components/OptimizedImage";

interface TripDetailsContentProps {
  tripId: string;
}

export default function TripDetailsContent({ tripId }: TripDetailsContentProps) {
  const router = useRouter();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["planTrip", tripId],
    queryFn: () => fetchPlanTripById(tripId),
    staleTime: 5 * 60 * 1000,
  });

  const trip = data?.data;

  // Mock booking count - In production, you would fetch this from the backend
  // You would need to create an endpoint that counts bookings for this trip
  const bookingCount = Math.floor(Math.random() * 50) + 5; // Placeholder

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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/plan-your-trip")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to All Trips
      </Button>

      {/* Hero Section */}
      <div className="mb-8 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full border border-primary/20">
                  ✨ Custom Travel Plan
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                {trip.tripName}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={getStatusColor(trip.status)}>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </Badge>
                {trip.user && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>
                      Created by{" "}
                      <span className="font-semibold text-foreground">
                        {trip.user.username || trip.user.email?.split("@")[0] || "Anonymous"}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleShare} className="hover-lift">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleBookNow} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover-lift">
                <CheckCircle className="w-4 h-4 mr-2" />
                Book This Trip
              </Button>
              <Button onClick={handleRequestQuote} className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 shadow-lg hover-lift">
                <Send className="w-4 h-4 mr-2" />
                Request Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4" />
              Destinations
            </CardDescription>
            <CardTitle className="text-2xl">{trip.destinations?.length || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4" />
              Duration
            </CardDescription>
            <CardTitle className="text-2xl">
              {trip.estimatedDuration} {trip.estimatedDuration === 1 ? "Day" : "Days"}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs">
              <DollarSign className="w-4 h-4" />
              Total Cost
            </CardDescription>
            <CardTitle className="text-2xl text-primary">
              ${trip.totalPrice?.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs">
              <Users className="w-4 h-4" />
              Interested Users
            </CardDescription>
            <CardTitle className="text-2xl">{bookingCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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
                  <Badge className={getStatusColor(trip.status)}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
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
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-gradient-to-r from-primary to-amber-600 rounded-xl">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    Complete Itinerary
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Day-by-day breakdown of your Egyptian adventure
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-amber-500 to-primary/20" />

                <div className="space-y-6 md:space-y-8">
                  {trip.destinations?.map((dest: any, index: number) => (
                    <div
                      key={index}
                      className="relative pl-12 md:pl-16 group animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-primary to-amber-600 text-white rounded-full flex items-center justify-center font-bold text-base md:text-lg shadow-lg z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        {index + 1}
                      </div>

                      <div className="bg-gradient-to-br from-background via-background/90 to-primary/5 border border-primary/10 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group-hover:translate-x-2">
                        {/* Image header if image exists */}
                        {dest.image && (
                          <div className="relative w-full h-48 md:h-64 overflow-hidden bg-gradient-to-br from-primary/5 to-amber-500/5">
                            <OptimizedImage
                              src={dest.image}
                              alt={dest.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />

                            {/* Day badge on image */}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                              Day {index + 1}
                            </div>

                            {/* Price badge */}
                            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-primary/20">
                              ${dest.price}
                            </div>
                          </div>
                        )}

                        <div className="p-5 md:p-6">
                          <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Day badge if no image */}
                            {!dest.image && (
                              <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary/10 to-amber-600/10 text-primary text-xs font-semibold rounded-full border border-primary/20 mb-2">
                                Day {index + 1}
                              </span>
                            )}

                            <h4 className="font-bold text-xl md:text-2xl mb-3 group-hover:text-primary transition-colors leading-tight">
                              {dest.title}
                            </h4>
                            {dest.location && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 bg-muted/30 px-3 py-2 rounded-lg w-fit">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="font-medium">{dest.location}</span>
                              </div>
                            )}
                            {dest.description && (
                              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                {dest.description}
                              </p>
                            )}
                          </div>
                          {!dest.image && (
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs text-muted-foreground mb-1 font-medium">Day Cost</p>
                              <div className="px-3 py-2 bg-gradient-to-br from-primary/10 to-amber-600/10 rounded-lg border border-primary/20 shadow-sm">
                                <p className="font-bold text-xl md:text-2xl bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">${dest.price}</p>
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
        <div className="space-y-6">
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

          {/* Booking Stats */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Popularity</CardTitle>
              <CardDescription>See how many users are interested</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {bookingCount}
                </div>
                <p className="text-sm text-muted-foreground">
                  users have shown interest in this trip
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleBookNow} className="w-full bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Book This Trip
              </Button>
              <Button onClick={handleRequestQuote} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Request Quote
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share This Trip
              </Button>
              <Button
                onClick={() => router.push("/plan-your-trip/create")}
                variant="outline"
                className="w-full"
              >
                Create Your Own
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
