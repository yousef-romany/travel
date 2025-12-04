"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchProgramAvailability, getAvailableDates } from "@/fetch/availability";
import { Loader2 } from "lucide-react";

interface AvailabilityCalendarProps {
  programId: string;
  onDateSelect?: (date: Date | undefined) => void;
  selectedDate?: Date;
}

export function AvailabilityCalendar({
  programId,
  onDateSelect,
  selectedDate,
}: AvailabilityCalendarProps) {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(selectedDate);

  useEffect(() => {
    loadAvailability();
  }, [programId]);

  const loadAvailability = async () => {
    try {
      setIsLoading(true);
      const dates = await getAvailableDates(programId, 90);
      setAvailableDates(dates);
    } catch (error) {
      console.error("Error loading availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateStr = date.toISOString().split("T")[0];
    return availableDates.includes(dateStr);
  };

  const isDateDisabled = (date: Date): boolean => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Disable dates more than 90 days ahead
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    if (date > maxDate) return true;

    // Disable unavailable dates
    return !isDateAvailable(date);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Travel Date</CardTitle>
          <CardDescription>Choose an available date for your trip</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Travel Date</CardTitle>
        <CardDescription>
          Choose an available date for your trip. Available dates are shown below.
        </CardDescription>
        <div className="flex gap-2 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-primary"></div>
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-muted"></div>
            <span className="text-sm text-muted-foreground">Unavailable</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {availableDates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">
              No availability information available yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Please contact us for booking inquiries.
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_disabled: "text-muted-foreground opacity-50",
              }}
            />
          </div>
        )}
        {date && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm font-medium">Selected Date:</p>
            <p className="text-lg font-bold text-primary">
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
