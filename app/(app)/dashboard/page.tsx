"use client";

import DashboardSkeleton from "@/components/loading/DashboardSkeleton";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoyaltyDashboard } from "@/components/loyalty/LoyaltyDashboard";
import { ReferralProgram } from "@/components/social/ReferralProgram";
import { getMockLoyaltyData } from "@/lib/loyalty";
import type { PointTransaction } from "@/lib/loyalty";
import { getRecentlyViewed } from "@/lib/recently-viewed";
import { Calendar, Heart, Clock, Award, MapPin, DollarSign, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchUserBookings, type BookingType } from "@/fetch/bookings";
import { getUserStats, getUserWishlist, getLoyaltyData } from "@/fetch/user";
import { getImageUrl } from "@/lib/utils";
import TripsSection from "@/components/trips-section";
import WishlistSection from "@/components/wishlist-section";

// ✅ DASH-10: Proper type for loyalty data — uses PointTransaction from lib/loyalty
type LoyaltyState = {
  totalPoints: number;
  lifetimeSpent: number;
  bookingsCount: number;
  earnedThisMonth: number;
  history: PointTransaction[];
  currentTier: string;
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  // Fetch user bookings
  const { data: bookingsData, isLoading: bookingsLoading, isError: bookingsError, error: bookingsErrorObj } = useQuery({
    queryKey: ["userBookings", user?.documentId],
    queryFn: () => fetchUserBookings(user?.documentId, user?.token),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  // ✅ DASH-02: Use user.token from context — not localStorage
  const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
    queryKey: ["userWishlist"],
    queryFn: () => getUserWishlist(user!.token),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  // ✅ DASH-02: Use user.token from context
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: () => getUserStats(user!.id, user!.token),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  // ✅ DASH-03: Loyalty is its own isolated query — no useEffect waterfall
  const { data: loyaltyRaw } = useQuery({
    queryKey: ["loyaltyData", user?.id],
    queryFn: () => getLoyaltyData(user!.token),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // ✅ DASH-03: Compute loyaltyData from two queries — no useEffect dependency issue
  const loyaltyData: LoyaltyState | null = loyaltyRaw
    ? (() => {
        const now = new Date();
        const earnedThisMonth = (loyaltyRaw.history || [])
          .filter((h) => {
            const d = new Date(h.date);
            return (
              d.getMonth() === now.getMonth() &&
              d.getFullYear() === now.getFullYear() &&
              h.type === "earned"
            );
          })
          .reduce((sum, h) => sum + h.amount, 0);

        return {
          totalPoints: loyaltyRaw.points,
          lifetimeSpent: userStats?.totalSpent || 0,
          bookingsCount: userStats?.totalTrips || 0,
          earnedThisMonth,
          // Map Strapi history shape → PointTransaction shape
          history: (loyaltyRaw.history || []).map((h: any, i: number) => ({
            id: h.id ?? String(i),
            type: h.type,
            amount: h.amount,
            description: h.reason || h.description || "",
            date: h.date,
          })) as PointTransaction[],
          currentTier: loyaltyRaw.tier,
        };
      })()
    : userStats
    ? (() => {
        // Fallback mock when no loyalty record yet
        const mock = getMockLoyaltyData(user!.id);
        return {
          ...mock,
          lifetimeSpent: userStats.totalSpent || 0,
          bookingsCount: userStats.totalTrips || 0,
        };
      })()
    : null;

  // Load recently viewed from localStorage (device-local by design)
  useEffect(() => {
    if (user) {
      setRecentlyViewed(getRecentlyViewed());
    }
  }, [user]);

  if (loading) return <DashboardSkeleton />;
  // ✅ DASH-01: null render after middleware already redirected — no flash
  if (!user) return null;

  // ✅ DASH-07: Prefer firstName over username
  const displayName =
    user.profile?.firstName
      ? `${user.profile.firstName}${user.profile.lastName ? ` ${user.profile.lastName}` : ""}`
      : user.username;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {displayName}!</h1>
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
                    <p className="text-xs text-muted-foreground">Saved programs</p>
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
                <Link href="/me?tab=trips">
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
                  <p className="text-muted-foreground font-semibold mb-2">Failed to load bookings</p>
                  <p className="text-sm text-muted-foreground">
                    {bookingsErrorObj instanceof Error ? bookingsErrorObj.message : "Please try again later"}
                  </p>
                </div>
              ) : bookingsData?.data && bookingsData.data.length > 0 ? (
                <div className="space-y-4">
                  {bookingsData.data.slice(0, 2).map((booking: BookingType, index: number) => {
                    const programData = booking.program;
                    const planTripData = booking.plan_trip;
                    const eventData = booking.event;

                    const title =
                      programData?.title ||
                      planTripData?.tripName ||
                      eventData?.title ||
                      booking.customTripName ||
                      "Trip";
                    const location =
                      programData?.Location ||
                      planTripData?.destinations?.[0]?.location ||
                      eventData?.location ||
                      "Egypt";
                    const imageUrl = programData?.images?.[0]
                      ? getImageUrl(programData.images[0])
                      : eventData?.featuredImage
                      ? getImageUrl(eventData.featuredImage)
                      : eventData?.gallery?.[0]
                      ? getImageUrl(eventData.gallery[0])
                      : null;

                    const travelDate = new Date(booking.travelDate);
                    const formattedDate = travelDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={booking.documentId}
                        className={`flex items-center gap-4 ${index === 0 ? "border-b pb-4" : ""}`}
                      >
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={title}
                              fill
                              sizes="96px"
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
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                              booking.bookingStatus === "confirmed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : booking.bookingStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                          >
                            {booking.bookingStatus}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${booking.totalAmount}</div>
                          {/* ✅ DASH-05: "View Details" now links to booking success page */}
                          <Link href={`/booking/success?bookingId=${booking.documentId}`}>
                            <Button size="sm" variant="outline">View Details</Button>
                          </Link>
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
                    <CardDescription>Programs you&apos;ve checked out</CardDescription>
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
                      href={`/programs/${program.documentId}`}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        {program.imageUrl && (
                          <div className="relative h-40 w-full">
                            <Image
                              src={program.imageUrl}
                              alt={program.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 400px"
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h4 className="font-semibold line-clamp-1">{program.title}</h4>
                          <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-muted-foreground">
                              {program.duration} {program.duration === 1 ? "day" : "days"}
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
          <TripsSection />
        </TabsContent>

        {/* Loyalty Tab */}
        <TabsContent value="loyalty">
          {/* ✅ DASH-09: Show fallback message instead of blank tab */}
          {loyaltyData ? (
            <LoyaltyDashboard
              userId={user.id}
              totalPoints={loyaltyData.totalPoints}
              lifetimeSpent={loyaltyData.lifetimeSpent}
              bookingsCount={loyaltyData.bookingsCount}
              earnedThisMonth={loyaltyData.earnedThisMonth}
              history={loyaltyData.history}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p>Complete your first booking to start earning loyalty points.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Referrals Tab */}
        <TabsContent value="referrals">
          <ReferralProgram />
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <WishlistSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
