"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, TrendingUp, Plane, Heart, Calendar } from "lucide-react";

export default function PersonalInfo() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (!loading && user) {
      const loadProfile = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profiles?filters[user][id]=${user?.id}&populate=*`,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );

          const json = await res.json();

          if (!json.data.length) {
            router.push("/complete-profile");
            return;
          }

          setProfile(json.data[0].attributes);
        } catch (err) {
          console.error("Error loading profile:", err);
        }
      };

      loadProfile();
    }
  }, [user, loading, router]);

  if (loading || !profile) {
    return (
      <p className="text-center text-white py-10">
        Loading your profile...
      </p>
    );
  }

  const stats = [
    {
      label: "Total Trips",
      value: user?.totalTrips || "0",
      icon: Plane,
      color: "text-blue-500",
    },
    {
      label: "Total Spent",
      value: user?.totalSpent ? `$${user?.totalSpent}` : "$0",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Wishlist Items",
      value: user?.wishlistCount || "0",
      icon: Heart,
      color: "text-rose-500",
    },
    {
      label: "Member Since",
      value: user?.createdAt?.slice(0, 4) || "—",
      icon: Calendar,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label} className="border border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} opacity-60`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
              {
                label: "Profile Completed",
                value: profile.isProfileCompleted ? (
                  <Badge className="bg-green-600">Completed</Badge>
                ) : (
                  <Badge className="bg-red-600">Incomplete</Badge>
                ),
              },
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
