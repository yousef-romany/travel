"use client";

import { Mail, Phone, MapPin, Edit2, LogOut, Verified, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ProfileHeader() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full border-b border-border/50 bg-background">
        <div className="container mx-auto px-4 py-10 max-w-7xl">
          <div className="flex items-center gap-6 animate-pulse">
            <div className="w-28 h-28 rounded-full bg-muted" />
            <div className="space-y-3">
              <div className="h-7 w-48 bg-muted rounded-lg" />
              <div className="h-4 w-32 bg-muted rounded-lg" />
              <div className="h-4 w-56 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  const displayName =
    user.profile?.firstName
      ? `${user.profile.firstName}${user.profile.lastName ? ` ${user.profile.lastName}` : ""}`
      : user.username;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isProfileComplete = user.profile?.isProfileCompleted;
  const memberYear = user.createdAt?.slice(0, 4) || new Date().getFullYear().toString();

  return (
    <div className="relative bg-gradient-to-br from-background via-background to-amber-950/10 border-b border-amber-900/15 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-600/6 rounded-full blur-[80px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">

          {/* Avatar + Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 blur-md opacity-40 scale-110" />
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-[3px] border-amber-500/40 relative z-10 shadow-xl">
                <AvatarImage
                  src={
                    typeof user.profile?.avatar === "string"
                      ? user.profile.avatar
                      : user.profile?.avatar?.url || ""
                  }
                  alt={displayName}
                />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Online indicator */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-background rounded-full z-20 shadow-sm" />
            </div>

            {/* Name & details */}
            <div>
              {/* Name row */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {displayName}
                </h1>
                {isProfileComplete && (
                  <span title="Profile verified" className="text-blue-400">
                    <Verified className="w-5 h-5 fill-blue-400 text-background" />
                  </span>
                )}
              </div>

              {/* Role / tier badge */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-400">
                  <Crown className="w-3 h-3" />
                  {user.profile?.role || "Explorer"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Member since {memberYear}
                </span>
              </div>

              {/* Contact row */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>{user.email}</span>
                </div>
                {user.profile?.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-500/70" />
                    <span>{user.profile.phone}</span>
                  </div>
                )}
                {user.profile?.city && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500/70" />
                    <span>
                      {user.profile.city}
                      {user.profile.country ? `, ${user.profile.country}` : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border/70 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
              asChild
            >
              <Link href="/edit-profile">
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
