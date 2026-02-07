"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile, getUserStats, type UserProfile, type UserStats } from "@/fetch/user";
import { fetchUserPlanTrips } from "@/fetch/plan-trip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, TrendingUp, Plane, Heart, Calendar, Loader2, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PersonalInfo() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Fetch profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: () => getUserProfile(user!.id, user!.token),
    enabled: !!user?.id && !!user?.token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: () => getUserStats(user!.id, user!.token),
    enabled: !!user?.id && !!user?.token,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch user's plan trips
  const { data: planTrips } = useQuery({
    queryKey: ["userPlanTrips", user?.documentId],
    queryFn: () => fetchUserPlanTrips(user?.documentId),
    enabled: !!user?.documentId,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }

    if (!authLoading && user && profile && !profile.isProfileCompleted) {
      router.push("/complete-profile");
    }
  }, [user, authLoading, router, profile]);

  if (authLoading || profileLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="text-center text-muted-foreground py-10">
        Profile not found. Please complete your profile.
      </p>
    );
  }

  const statCards = [
    {
      label: "Total Trips",
      value: stats?.totalTrips || "0",
      icon: Plane,
      color: "text-blue-500",
    },
    {
      label: "Total Spent",
      value: stats?.totalSpent ? `$${stats.totalSpent.toLocaleString()}` : "$0",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Wishlist Items",
      value: stats?.wishlistCount || "0",
      icon: Heart,
      color: "text-rose-500",
    },
    {
      label: "Member Since",
      value: user?.createdAt?.slice(0, 4) || new Date().getFullYear().toString(),
      icon: Calendar,
      color: "text-amber-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
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

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          const delayClass = `animate-delay-${index * 100}` as const;
          return (
            <Card
              key={stat.label}
              className={`group border border-primary/20 bg-gradient-to-br from-card to-card/50 hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-card-enter ${delayClass}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} opacity-60 group-hover:opacity-100 group-hover:animate-icon-bounce transition-opacity bg-gradient-to-br from-primary/10 to-amber-500/10 p-3 rounded-full`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Plan Trips Preview */}
      {planTrips?.data && planTrips.data.length > 0 && (
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Custom Trips</CardTitle>
                <CardDescription>
                  Your personalized travel plans
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href="/plan-your-trip">
                  Create New
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {planTrips.data.slice(0, 3).map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{trip.tripName}</h4>
                      <Badge className={getStatusColor(trip.tripStatus)}>
                        {trip.tripStatus.charAt(0).toUpperCase() + trip.tripStatus.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {trip.destinations?.length || 0} destinations
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {trip.estimatedDuration} {trip.estimatedDuration === 1 ? 'day' : 'days'}
                      </span>
                      <span className="font-semibold text-primary">
                        ${trip.totalPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link href="/plan-your-trip">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
            {planTrips.data.length > 3 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/plan-your-trip">
                    View All {planTrips.data.length} Trips
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Personal Information */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Manage your profile details
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={() => router.push("/edit-profile")}
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "First Name", value: profile.firstName },
              { label: "Last Name", value: profile.lastName },
              { label: "Phone Number", value: profile.phone },
              { label: "Nationality", value: profile.nationality },
              { label: "Passport Number", value: profile.passportNumber },
              { label: "Passport Expiry", value: profile.passportExpiry },
              { label: "Address", value: profile.address },
              { label: "City", value: profile.city },
              { label: "Country", value: profile.country },
              { label: "ZIP Code", value: profile.zipCode },
              { label: "Emergency Contact Name", value: profile.emergencyContactName },
              { label: "Emergency Contact Phone", value: profile.emergencyContactPhone },
              { label: "Date of Birth", value: profile.dateOfBirth },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {field.label}
                </label>
                <p className="text-base font-medium text-foreground mt-2">
                  {field.value || "Not provided"}
                </p>
              </div>
            ))}
            {/* Profile Completed Status */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Profile Completed
              </label>
              <div className="mt-2">
                {profile.isProfileCompleted ? (
                  <Badge className="bg-green-600">Completed</Badge>
                ) : (
                  <Badge className="bg-red-600">Incomplete</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
