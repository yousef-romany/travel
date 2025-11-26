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
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 text-primary">{trip.tripName}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={getStatusColor(trip.status)}>
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </Badge>
              {trip.user && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>
                    Created by{" "}
                    <span className="font-semibold">
                      {trip.user.username || trip.user.email?.split("@")[0] || "Anonymous"}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleBookNow} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Book This Trip
            </Button>
            <Button onClick={handleRequestQuote} className="bg-primary">
              <Send className="w-4 h-4 mr-2" />
              Request Quote
            </Button>
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
          <Card>
            <CardHeader>
              <CardTitle>Complete Itinerary</CardTitle>
              <CardDescription>
                Day-by-day breakdown of your Egyptian adventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trip.destinations?.map((dest: any, index: number) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{dest.title}</h4>
                      {dest.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {dest.location}
                        </p>
                      )}
                      {dest.description && (
                        <p className="text-sm text-muted-foreground">{dest.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Cost</p>
                      <p className="font-bold text-lg text-primary">${dest.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trip.destinations?.map((dest: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Day {index + 1}: {dest.title}
                    </span>
                    <span className="font-medium">${dest.price}</span>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total Estimated Cost</span>
                    <span className="font-bold text-2xl text-primary">
                      ${trip.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average: ${trip.pricePerDay?.toFixed(2)} per day
                  </p>
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
