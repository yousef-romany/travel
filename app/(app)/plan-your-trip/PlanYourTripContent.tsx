/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBestCustomTrips, fetchUserPlanTrips } from "@/fetch/plan-trip";
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
  User,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export default function PlanYourTripContent() {
  const router = useRouter();
  const { user } = useAuth();

  // Fetch user's own trips
  const { data: userTripsData, isLoading: userTripsLoading, error: userTripsError, refetch: refetchUserTrips } = useQuery({
    queryKey: ["userPlanTrips", user?.documentId],
    queryFn: () => fetchUserPlanTrips(user?.documentId),
    retry: 2,
    refetchOnMount: true,
    enabled: !!user?.documentId,
  });

  // Fetch all custom trips from all users
  const { data: allTrips, isLoading: allTripsLoading, error: allTripsError, refetch: refetchAllTrips } = useQuery({
    queryKey: ["bestCustomTrips"],
    queryFn: () => fetchBestCustomTrips(50),
    retry: 2,
    refetchOnMount: true,
  });

  // Handle both response formats
  const userTrips = React.useMemo(() => {
    if (!userTripsData) return [];
    if (Array.isArray(userTripsData)) return userTripsData;
    if (userTripsData.data && Array.isArray(userTripsData.data)) return userTripsData.data;
    return [];
  }, [userTripsData]);

  const trips = React.useMemo(() => {
    if (!allTrips) return [];
    if (Array.isArray(allTrips)) return allTrips;
    if (allTrips.data && Array.isArray(allTrips.data)) return allTrips.data;
    return [];
  }, [allTrips]);

  // Debug logging
  console.log("Plan Your Trip - User:", user);
  console.log("Plan Your Trip - User Trips Loading:", userTripsLoading);
  console.log("Plan Your Trip - User Trips Data:", userTripsData);
  console.log("Plan Your Trip - User Trips Array:", userTrips);
  console.log("Plan Your Trip - User Trips Count:", userTrips.length);
  console.log("Plan Your Trip - All Trips Loading:", allTripsLoading);
  console.log("Plan Your Trip - All Trips Data:", allTrips);
  console.log("Plan Your Trip - All Trips Array:", trips);
  console.log("Plan Your Trip - All Trips Count:", trips.length);

  const isLoading = userTripsLoading || allTripsLoading;
  const error = userTripsError || allTripsError;

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4 text-destructive">Error Loading Trips</h2>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "Failed to load custom trips"}
            </p>
            <Button onClick={() => {
              refetchUserTrips();
              refetchAllTrips();
            }}>Try Again</Button>
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent px-4">
            Plan Your Egypt Adventure
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed px-4">
            Browse custom itineraries created by fellow travelers or design your own unique journey through the land of pharaohs
          </p>

          <Alert className="max-w-3xl mx-auto bg-gradient-to-r from-primary/5 to-amber-500/5 border-primary/30 shadow-lg mx-4">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <AlertDescription className="text-sm md:text-base">
              Choose from ready-made itineraries below or create your own custom trip tailored to your preferences
            </AlertDescription>
          </Alert>
        </div>

        {/* Stats Bar */}
        {(trips.length > 0 || userTrips.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 animate-slide-up animate-delay-200 px-4">
            <Card className="text-center border-primary/20 bg-gradient-to-br from-card to-primary/5 hover:shadow-xl transition-all">
              <CardContent className="pt-6 md:pt-8 pb-4 md:pb-6">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent mb-2 md:mb-3">
                  {trips.length}
                </div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Custom Itineraries Available</p>
              </CardContent>
            </Card>
            <Card className="text-center border-amber-500/20 bg-gradient-to-br from-card to-amber-500/5 hover:shadow-xl transition-all">
              <CardContent className="pt-6 md:pt-8 pb-4 md:pb-6">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-600 to-primary bg-clip-text text-transparent mb-2 md:mb-3">
                  {trips.reduce((acc, trip) => acc + (trip.destinations?.length || 0), 0)}
                </div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Destinations</p>
              </CardContent>
            </Card>
            <Card className="text-center border-green-500/20 bg-gradient-to-br from-card to-green-500/5 hover:shadow-xl transition-all sm:col-span-2 md:col-span-1">
              <CardContent className="pt-6 md:pt-8 pb-4 md:pb-6">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 md:mb-3">
                  ${Math.min(...trips.map(t => t.totalPrice || 0)).toLocaleString()} - $
                  {Math.max(...trips.map(t => t.totalPrice || 0)).toLocaleString()}
                </div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Price Range</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User-Created Trips Section with Tabs */}
        <div className="mb-16 animate-slide-up animate-delay-300">
          <Tabs defaultValue={user ? "my-trips" : "all-trips"} className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    Custom Itineraries
                  </span>
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  {user ? "Manage your trips or browse community itineraries" : "Explore trips from our community"}
                </p>
              </div>

              <TabsList className="grid w-full md:w-auto grid-cols-2 bg-muted/50">
                {user && (
                  <TabsTrigger value="my-trips" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">My Trips</span>
                    <span className="sm:hidden">Mine</span>
                    {userTrips.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {userTrips.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                )}
                <TabsTrigger value="all-trips" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">All Trips</span>
                  <span className="sm:hidden">All</span>
                  {trips.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {trips.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* My Trips Tab */}
            {user && (
              <TabsContent value="my-trips" className="mt-6">
                {userTrips.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {userTrips.map((trip) => (
                      <Card
                        key={trip.id}
                        className="border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-card to-card/50 overflow-hidden"
                        onClick={() => router.push(`/plan-your-trip/${trip.documentId}`)}
                      >
                        {/* Trip Image */}
                        {trip.destinations && trip.destinations.length > 0 && trip.destinations[0].image && (
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={getImageUrl(trip.destinations[0].image) || "/placeholder.svg"}
                              alt={trip.tripName}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <Badge className={`${getStatusColor(trip.status)} backdrop-blur-sm`}>
                                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        )}

                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors line-clamp-2">
                              {trip.tripName}
                            </CardTitle>
                            {(!trip.destinations || !trip.destinations[0]?.image) && (
                              <Badge className={getStatusColor(trip.status)}>
                                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs md:text-sm">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                                {trip.destinations?.length || 0} destinations
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <CalendarIcon className="w-3 h-3 md:w-4 md:h-4" />
                                {trip.estimatedDuration} {trip.estimatedDuration === 1 ? "day" : "days"}
                              </span>
                            </div>

                            <div className="pt-2 border-t border-border">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Total Cost</span>
                                <span className="text-lg md:text-xl font-bold text-primary">
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
                                      className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[100px]"
                                      title={dest.title}
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
                              className="w-full mt-2 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-lg text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/plan-your-trip/${trip.documentId}`);
                              }}
                            >
                              View & Manage
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5">
                    <CardContent className="flex flex-col items-center justify-center py-12 md:py-16">
                      <div className="p-4 bg-primary/10 rounded-full mb-6">
                        <User className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-3">No Planned Trips Yet</h3>
                      <p className="text-sm md:text-base text-muted-foreground text-center mb-8 max-w-md px-4">
                        You haven't created any custom trips yet. Start planning your Egyptian adventure!
                      </p>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-lg"
                        onClick={() => router.push("/plan-your-trip/create")}
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First Trip
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}

            {/* All Trips Tab */}
            <TabsContent value="all-trips" className="mt-6">
              <p className="text-sm md:text-base text-muted-foreground text-center mb-6">
                Explore trips designed by fellow travelers - click any trip to see full details
              </p>

              {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {trips.map((trip) => (
                <Card
                  key={trip.id}
                  className="border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-card to-card/50 overflow-hidden"
                  onClick={() => router.push(`/plan-your-trip/${trip.documentId}`)}
                >
                {/* Trip Image */}
                {trip.destinations && trip.destinations.length > 0 && trip.destinations[0].image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={getImageUrl(trip.destinations[0].image) || "/placeholder.svg"}
                      alt={trip.tripName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <Badge className={`${getStatusColor(trip.status)} backdrop-blur-sm`}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </Badge>
                      {trip.user && (
                        <Badge variant="secondary" className="backdrop-blur-sm flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {trip.user.username || trip.user.email?.split("@")[0] || "Traveler"}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {trip.tripName}
                    </CardTitle>
                    {(!trip.destinations || !trip.destinations[0]?.image) && (
                      <Badge className={getStatusColor(trip.status)}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </Badge>
                    )}
                  </div>
                  {trip.user && (!trip.destinations || !trip.destinations[0]?.image) && (
                    <CardDescription className="flex items-center gap-1 text-xs md:text-sm">
                      <Users className="w-3 h-3" />
                      <span className="truncate">
                        {trip.user.username || trip.user.email?.split("@")[0] || "Traveler"}
                      </span>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        {trip.destinations?.length || 0} destinations
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon className="w-3 h-3 md:w-4 md:h-4" />
                        {trip.estimatedDuration} {trip.estimatedDuration === 1 ? "day" : "days"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Total Cost</span>
                        <span className="text-lg md:text-xl font-bold text-primary">
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
                              className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[100px]"
                              title={dest.title}
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
                      className="w-full mt-2 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-lg text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/plan-your-trip/${trip.documentId}`);
                      }}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          ) : (
              <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5">
                <CardContent className="flex flex-col items-center justify-center py-12 md:py-16">
                  <div className="p-4 bg-primary/10 rounded-full mb-6">
                    <TrendingUp className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3">No Community Trips Yet</h3>
                  <p className="text-sm md:text-base text-muted-foreground text-center mb-8 max-w-md px-4">
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
          )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Create Your Own Section */}
        <div className="animate-slide-up animate-delay-400">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-amber-500/10 to-primary/10 shadow-2xl overflow-hidden relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full blur-3xl"></div>

            <CardHeader className="text-center pb-4 md:pb-6 relative z-10 px-4">
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="p-3 md:p-4 bg-gradient-to-br from-primary to-amber-600 rounded-2xl shadow-lg">
                  <Plus className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                Don't See What You Like?
              </CardTitle>
              <CardDescription className="text-sm sm:text-base md:text-lg mt-2 md:mt-3 max-w-2xl mx-auto">
                Create your own custom itinerary by selecting destinations and building your perfect Egypt adventure
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6 md:pb-8 relative z-10 px-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white shadow-2xl px-6 py-5 md:px-8 md:py-6 text-base md:text-lg hover:scale-105 transition-transform w-full sm:w-auto"
                onClick={() => router.push("/plan-your-trip/create")}
              >
                <Plus className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                <span className="hidden sm:inline">Create Your Own Trip</span>
                <span className="sm:hidden">Create Trip</span>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
