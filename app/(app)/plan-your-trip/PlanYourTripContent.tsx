/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBestCustomTrips } from "@/fetch/plan-trip";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  Plus,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PlanYourTripContent() {
  const router = useRouter();

  // Fetch all user-created custom trips (not just 6)
  const { data: allTrips, isLoading, error, refetch } = useQuery({
    queryKey: ["bestCustomTrips"],
    queryFn: () => fetchBestCustomTrips(50), // Fetch more trips
    retry: 2,
    refetchOnMount: true,
  });

  // Handle both response formats: { data: [...] } or directly [...]
  const trips = Array.isArray(allTrips) ? allTrips : (allTrips?.data || []);

  // Debug logging
  console.log("Plan Your Trip - Loading:", isLoading);
  console.log("Plan Your Trip - Error:", error);
  console.log("Plan Your Trip - Raw Data:", allTrips);
  console.log("Plan Your Trip - Is Array:", Array.isArray(allTrips));
  console.log("Plan Your Trip - Has data property:", allTrips?.data);
  console.log("Plan Your Trip - Trips array:", trips);
  console.log("Plan Your Trip - Trips count:", trips.length);

  if (error) {
    console.error("Error fetching trips:", error);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "quoted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "booked":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4 text-destructive">Error Loading Trips</h2>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "Failed to load custom trips"}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full border border-primary/20">
              ✨ Custom Trip Planner
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            Plan Your Egypt Adventure
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Browse custom itineraries created by fellow travelers or design your own unique journey through the land of pharaohs
          </p>

          <Alert className="max-w-3xl mx-auto bg-gradient-to-r from-primary/5 to-amber-500/5 border-primary/30 shadow-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            <AlertDescription className="text-base">
              Choose from ready-made itineraries below or create your own custom trip tailored to your preferences
            </AlertDescription>
          </Alert>
        </div>

        {/* Stats Bar */}
        {trips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-slide-up animate-delay-200">
            <Card className="text-center border-primary/20 bg-gradient-to-br from-card to-primary/5 hover:shadow-xl transition-all">
              <CardContent className="pt-8 pb-6">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent mb-3">
                  {trips.length}
                </div>
                <p className="text-sm font-medium text-muted-foreground">Custom Itineraries Available</p>
              </CardContent>
            </Card>
            <Card className="text-center border-amber-500/20 bg-gradient-to-br from-card to-amber-500/5 hover:shadow-xl transition-all">
              <CardContent className="pt-8 pb-6">
                <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-primary bg-clip-text text-transparent mb-3">
                  {trips.reduce((acc, trip) => acc + (trip.destinations?.length || 0), 0)}
                </div>
                <p className="text-sm font-medium text-muted-foreground">Total Destinations</p>
              </CardContent>
            </Card>
            <Card className="text-center border-green-500/20 bg-gradient-to-br from-card to-green-500/5 hover:shadow-xl transition-all">
              <CardContent className="pt-8 pb-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                  ${Math.min(...trips.map(t => t.totalPrice || 0)).toLocaleString()} - $
                  {Math.max(...trips.map(t => t.totalPrice || 0)).toLocaleString()}
                </div>
                <p className="text-sm font-medium text-muted-foreground">Price Range</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User-Created Trips Section */}
        <div className="mb-16 animate-slide-up animate-delay-300">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Browse Custom Itineraries
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore trips designed by fellow travelers - click any trip to see full details and request a booking
            </p>
          </div>

          {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <Card
                  key={trip.id}
                  className="border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-card to-card/50"
                  onClick={() => router.push(`/plan-your-trip/${trip.documentId}`)}
                >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {trip.tripName}
                    </CardTitle>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Badge>
                  </div>
                  {trip.user && (
                    <CardDescription className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Created by {trip.user.username || trip.user.email?.split("@")[0] || "Traveler"}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {trip.destinations?.length || 0} destinations
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        {trip.estimatedDuration} {trip.estimatedDuration === 1 ? "day" : "days"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Total Cost</span>
                        <span className="text-xl font-bold text-primary">
                          ${trip.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ${trip.pricePerDay?.toFixed(0)} per day
                      </div>
                    </div>

                    {trip.destinations && trip.destinations.length > 0 && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-1">Destinations:</p>
                        <div className="flex flex-wrap gap-1">
                          {trip.destinations.slice(0, 3).map((dest: any, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-muted px-2 py-1 rounded"
                            >
                              {dest.title}
                            </span>
                          ))}
                          {trip.destinations.length > 3 && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              +{trip.destinations.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full mt-2 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/plan-your-trip/${trip.documentId}`);
                      }}
                    >
                      View Details & Book
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          ) : (
            <div className="space-y-4">
              <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-primary/10 rounded-full mb-6">
                    <TrendingUp className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No Custom Trips Yet</h3>
                  <p className="text-muted-foreground text-center mb-8 max-w-md">
                    Be the first to create a custom itinerary and share it with the community!
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-lg"
                    onClick={() => router.push("/plan-your-trip/create")}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Trip
                  </Button>
                </CardContent>
              </Card>

              {/* Debug Info */}
              <Card className="border-amber-500/50 bg-amber-500/5">
                <CardContent className="pt-6">
                  <h4 className="font-bold mb-2 text-amber-600">Debug Information</h4>
                  <div className="text-xs space-y-1 font-mono">
                    <p>Data object exists: {allTrips ? "Yes" : "No"}</p>
                    <p>Data.data exists: {allTrips?.data ? "Yes" : "No"}</p>
                    <p>Data.data is array: {Array.isArray(allTrips?.data) ? "Yes" : "No"}</p>
                    <p>Trips count: {trips.length}</p>
                    <p>Raw response: {JSON.stringify(allTrips).substring(0, 200)}...</p>
                  </div>
                  <Button
                    onClick={() => refetch()}
                    size="sm"
                    variant="outline"
                    className="mt-4"
                  >
                    Refetch Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Create Your Own Section */}
        <div className="animate-slide-up animate-delay-400">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-amber-500/10 to-primary/10 shadow-2xl overflow-hidden relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full blur-3xl"></div>

            <CardHeader className="text-center pb-6 relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-primary to-amber-600 rounded-2xl shadow-lg">
                  <Plus className="w-10 h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                Don't See What You Like?
              </CardTitle>
              <CardDescription className="text-lg mt-3 max-w-2xl mx-auto">
                Create your own custom itinerary by selecting destinations and building your perfect Egypt adventure
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8 relative z-10">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-2xl px-8 py-6 text-lg hover:scale-105 transition-transform"
                onClick={() => router.push("/plan-your-trip/create")}
              >
                <Plus className="w-6 h-6 mr-3" />
                Create Your Own Trip
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
