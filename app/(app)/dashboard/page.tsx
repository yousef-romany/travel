"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoyaltyDashboard } from "@/components/loyalty/LoyaltyDashboard";
import { ReferralProgram } from "@/components/social/ReferralProgram";
import { getMockLoyaltyData } from "@/lib/loyalty";
import { getRecentlyViewed } from "@/lib/recently-viewed";
import { Calendar, Heart, Clock, Award, MapPin, DollarSign, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchUserBookings, type BookingType } from "@/fetch/bookings";
import { getUserStats, getUserWishlist } from "@/fetch/user";
import { getImageUrl } from "@/lib/utils";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  // Fetch user bookings from Strapi
  const { data: bookingsData, isLoading: bookingsLoading, isError: bookingsError } = useQuery({
    queryKey: ["userBookings", user?.documentId],
    queryFn: () => fetchUserBookings(user?.documentId),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch user wishlist from Strapi
  const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
    queryKey: ["userWishlist"],
    queryFn: async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return [];
      return getUserWishlist(authToken);
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch user stats from Strapi
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken || !user) return null;
      return getUserStats(user.id, authToken);
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/dashboard");
      return;
    }

    if (user) {
      // Load loyalty data (keep mock for now until backend is ready)
      const data = getMockLoyaltyData(user.id);
      setLoyaltyData(data);

      // Load recently viewed
      const viewed = getRecentlyViewed();
      setRecentlyViewed(viewed);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user.username}!
        </h1>
        <p className="text-muted-foreground">
          Manage your bookings, loyalty points, and travel preferences
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-16 mb-2" />
                    <div className="h-4 bg-muted rounded w-24" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{userStats?.upcomingTrips || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {userStats?.upcomingTrips ? "Bookings confirmed" : "No upcoming trips"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loyaltyData?.totalPoints?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loyaltyData?.currentTier || "Explorer"} tier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {wishlistLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-16 mb-2" />
                    <div className="h-4 bg-muted rounded w-24" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{wishlistData?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Saved programs
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-20 mb-2" />
                    <div className="h-4 bg-muted rounded w-28" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ${userStats?.totalSpent?.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across {userStats?.totalTrips || 0} bookings
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Bookings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Bookings</CardTitle>
                  <CardDescription>Your next adventures</CardDescription>
                </div>
                <Link href="/dashboard?tab=bookings">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-4 animate-pulse">
                      <div className="w-24 h-24 bg-muted rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-muted rounded w-2/3" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                      <div className="h-10 w-24 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : bookingsError ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <p className="text-muted-foreground">Failed to load bookings</p>
                </div>
              ) : bookingsData?.data && bookingsData.data.length > 0 ? (
                <div className="space-y-4">
                  {bookingsData.data.slice(0, 2).map((booking: BookingType, index: number) => {
                    const programData = booking.program;
                    const planTripData = booking.plan_trip;
                    const eventData = booking.event;

                    const title = programData?.title || planTripData?.tripName || eventData?.title || booking.customTripName || "Trip";
                    const location = programData?.Location || planTripData?.destinations?.[0]?.location || eventData?.location || "Egypt";
                    const imageUrl = programData?.images?.[0] ? getImageUrl(programData.images[0]) :
                                     eventData?.images?.[0] ? getImageUrl(eventData.images[0]) : null;

                    const travelDate = new Date(booking.travelDate);
                    const formattedDate = travelDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <div key={booking.documentId} className={`flex items-center gap-4 ${index === 0 ? 'border-b pb-4' : ''}`}>
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formattedDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {location}
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${booking.totalAmount}</div>
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                  <Link href="/programs">
                    <Button>Browse Programs</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recently Viewed
                    </CardTitle>
                    <CardDescription>Programs you've checked out</CardDescription>
                  </div>
                  <Link href="/programs">
                    <Button variant="outline" size="sm">Browse More</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recentlyViewed.slice(0, 3).map((program) => (
                    <Link
                      key={program.documentId}
                      href={`/programs/${program.title.replace(/\s+/g, "-").toLowerCase()}`}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        {program.imageUrl && (
                          <div className="relative h-40 w-full">
                            <Image
                              src={program.imageUrl}
                              alt={program.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h4 className="font-semibold line-clamp-1">{program.title}</h4>
                          <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-muted-foreground">
                              {program.duration} days
                            </span>
                            <span className="font-bold text-primary">
                              ${program.price.toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>View and manage your travel bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Booking management coming soon with payment integration
              </p>
              <div className="text-center">
                <Link href="/programs">
                  <Button>Browse Programs</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loyalty Tab */}
        <TabsContent value="loyalty">
          {loyaltyData && (
            <LoyaltyDashboard
              userId={user.id}
              totalPoints={loyaltyData.totalPoints}
              lifetimeSpent={loyaltyData.lifetimeSpent}
              bookingsCount={loyaltyData.bookingsCount}
              earnedThisMonth={loyaltyData.earnedThisMonth}
              history={loyaltyData.history}
            />
          )}
        </TabsContent>

        {/* Referrals Tab */}
        <TabsContent value="referrals">
          <ReferralProgram />
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                My Wishlist
              </CardTitle>
              <CardDescription>Programs you want to book</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Your wishlist will appear here
              </p>
              <div className="text-center">
                <Link href="/programs">
                  <Button>Discover Programs</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
