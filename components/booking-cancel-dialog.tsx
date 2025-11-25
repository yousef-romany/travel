"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Clock } from "lucide-react";
import { cancelBooking } from "@/fetch/bookings";
import { canCancelBooking, getRemainingCancellationTime } from "@/lib/cancellation-policy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface BookingCancelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingCreatedAt: string;
  tripName: string;
}

export default function BookingCancelDialog({
  isOpen,
  onClose,
  bookingId,
  bookingCreatedAt,
  tripName,
}: BookingCancelDialogProps) {
  const queryClient = useQueryClient();
  const canCancel = canCancelBooking(bookingCreatedAt);
  const remainingTime = getRemainingCancellationTime(bookingCreatedAt);

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(bookingId, bookingCreatedAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      toast.success("Booking cancelled successfully!");
      onClose();
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to cancel booking. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleCancel = () => {
    if (!canCancel) {
      toast.error("Cancellation period has expired");
      return;
    }
    cancelMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Cancel Booking
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your booking for <strong>{tripName}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Cancellation Policy Alert */}
          <Alert variant={canCancel ? "default" : "destructive"}>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-1">24-Hour Cancellation Policy</div>
              {canCancel ? (
                <div>
                  <p className="text-sm">
                    You can cancel this booking free of charge within 24 hours of creation.
                  </p>
                  <p className="text-sm font-medium mt-2 text-primary">
                    Time remaining: {remainingTime}
                  </p>
                </div>
              ) : (
                <p className="text-sm">
                  The 24-hour cancellation period has expired. You can no longer cancel this
                  booking online. Please contact support for assistance.
                </p>
              )}
            </AlertDescription>
          </Alert>

          {/* Booking Details */}
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID:</span>
              <span className="font-medium">{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">
                {new Date(bookingCreatedAt).toLocaleString()}
              </span>
            </div>
          </div>

          {canCancel && (
            <div className="text-sm text-muted-foreground">
              <p>
                Once cancelled, this action cannot be undone. You will receive a confirmation
                email shortly.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={cancelMutation.isPending}
          >
            Keep Booking
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelMutation.isPending || !canCancel}
          >
            {cancelMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Booking"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
