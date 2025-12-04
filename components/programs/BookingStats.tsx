"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, Flame } from "lucide-react";
import { fetchUserBookings } from "@/fetch/bookings";

interface BookingStatsProps {
  programId: string;
  programTitle: string;
}

export function BookingStats({ programId, programTitle }: BookingStatsProps) {
  const [stats, setStats] = useState({
    todayBookings: 0,
    weekBookings: 0,
    totalBookings: 0,
    recentBooking: null as string | null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookingStats();
  }, [programId]);

  const loadBookingStats = async () => {
    try {
      setIsLoading(true);
      // Note: In production, you'd want a specific endpoint for program booking stats
      // For now, we'll use the existing booking endpoint
      const response = await fetchUserBookings();

      const programBookings = response.data.filter(
        (booking) => booking.program?.documentId === programId
      );

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const todayBookings = programBookings.filter(
        (booking) => new Date(booking.createdAt) >= today
      ).length;

      const weekBookings = programBookings.filter(
        (booking) => new Date(booking.createdAt) >= weekAgo
      ).length;

      const recentBooking = programBookings.length > 0
        ? programBookings[0].createdAt
        : null;

      setStats({
        todayBookings,
        weekBookings,
        totalBookings: programBookings.length,
        recentBooking,
      });
    } catch (error) {
      console.error("Error loading booking stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeSince = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Today's Bookings */}
      {stats.todayBookings > 0 && (
        <Badge variant="secondary" className="flex items-center gap-2 py-2 px-3">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="font-semibold text-orange-600 dark:text-orange-400">
            {stats.todayBookings} {stats.todayBookings === 1 ? 'person' : 'people'} booked today
          </span>
        </Badge>
      )}

      {/* This Week's Bookings */}
      {stats.weekBookings > 0 && (
        <Badge variant="outline" className="flex items-center gap-2 py-2 px-3">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span>
            {stats.weekBookings} {stats.weekBookings === 1 ? 'booking' : 'bookings'} this week
          </span>
        </Badge>
      )}

      {/* Recent Booking */}
      {stats.recentBooking && (
        <Badge variant="outline" className="flex items-center gap-2 py-2 px-3">
          <Clock className="h-4 w-4 text-blue-500" />
          <span className="text-sm">
            Last booked {getTimeSince(stats.recentBooking)}
          </span>
        </Badge>
      )}

      {/* Total Bookings - High Demand Indicator */}
      {stats.totalBookings >= 10 && (
        <Badge variant="secondary" className="flex items-center gap-2 py-2 px-3 bg-primary/10 border-primary/20">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-semibold text-primary">
            Popular Choice - {stats.totalBookings}+ travelers
          </span>
        </Badge>
      )}
    </div>
  );
}
