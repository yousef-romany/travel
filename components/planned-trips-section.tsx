"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, MapPin, Loader2, AlertCircle, Trash2, Eye } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchUserPlanTrips, deletePlanTrip, type PlanTripType, PlanTripDestination } from "@/fetch/plan-trip"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function PlannedTripsSection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<PlanTripType | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userPlanTrips", user?.documentId],
    queryFn: () => fetchUserPlanTrips(user?.documentId),
    enabled: !!user?.documentId,
    staleTime: 2 * 60 * 1000,
  });

  const trips: any = data  || [];

  const deleteTripMutation = useMutation({
    mutationFn: (tripId: string) => deletePlanTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPlanTrips"] });
      toast.success("Planned trip deleted successfully");
      setTripToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip. Please try again.");
    },
  });

  const handleDeleteTrip = (tripId: string) => {
    setTripToDelete(tripId);
  };

  const confirmDeleteTrip = () => {
    if (tripToDelete) {
      deleteTripMutation.mutate(tripToDelete);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "quoted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "booked":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (!user) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">Please log in</p>
          <p className="text-sm text-muted-foreground mb-4">You need to be logged in to view your planned trips</p>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading your planned trips...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-semibold">Failed to load planned trips</p>
        <p className="text-sm text-muted-foreground">There was an error loading your trips. Please try again.</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">No planned trips yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            You haven't created any custom trips yet. Start planning your Egyptian adventure!
          </p>
          <Button asChild>
            <Link href="/plan-your-trip">Plan Your Trip</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map((trip: any) => {
        return (
          <Card
            key={trip.id}
            className="border border-border bg-card overflow-hidden hover:border-amber-500/30 transition-all shadow-sm hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl">{trip.tripName}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4" />
                    {trip.destinations?.length || 0} destinations
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(trip.status)}>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Created</p>
                  <p className="text-foreground font-semibold flex items-center gap-2 mt-1">
                    <CalendarIcon className="w-4 h-4 text-amber-500" />
                    {formatDate(trip.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Duration</p>
                  <p className="text-foreground font-semibold mt-1">
                    {trip.estimatedDuration || 1} {trip.estimatedDuration === 1 ? 'Day' : 'Days'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Destinations</p>
                  <p className="text-foreground font-semibold mt-1">
                    {trip.destinations?.length || 0} places
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Total Cost</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-500 mt-1">
                    ${trip.totalPrice?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Destinations Preview */}
              {trip.destinations && trip.destinations.length > 0 && (
                <div className="mb-4 pb-4 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Itinerary:</p>
                  <div className="flex flex-wrap gap-2">
                    {trip.destinations.slice(0, 4).map((dest: any, idx: any) => (
                      <span
                        key={idx}
                        className="text-xs bg-muted px-2 py-1 rounded"
                      >
                        {dest.title}
                      </span>
                    ))}
                    {trip.destinations.length > 4 && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        +{trip.destinations.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  className="bg-amber-600 hover:bg-amber-700 gap-2"
                  size="sm"
                  asChild
                >
                  <Link href={`/plan-your-trip/${trip.documentId}`}>
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTrip(trip)}
                >
                  Quick View
                </Button>
                {(trip.status === "draft" || trip.status === "cancelled") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTrip(trip.documentId)}
                    disabled={deleteTripMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteTripMutation.isPending && tripToDelete === trip.documentId
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!tripToDelete} onOpenChange={() => setTripToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Planned Trip?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this planned trip? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTripToDelete(null)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteTrip}
              variant="destructive"
              disabled={deleteTripMutation.isPending}
            >
              {deleteTripMutation.isPending ? "Deleting..." : "Delete Trip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trip Details Dialog */}
      <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTrip?.tripName}</DialogTitle>
            <DialogDescription>
              Planned trip details and itinerary
            </DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-6">
              {/* Trip Overview */}
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-primary">Trip Overview</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(selectedTrip.status)}>
                      {selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Places</p>
                    <p className="font-semibold">{selectedTrip.destinations?.length || 0} destinations</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold">{selectedTrip.estimatedDuration} {selectedTrip.estimatedDuration === 1 ? 'Day' : 'Days'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated Cost</p>
                    <p className="font-semibold text-primary">${selectedTrip.totalPrice}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <p className="text-muted-foreground text-sm">Average cost per day</p>
                  <p className="font-semibold text-lg text-primary">${selectedTrip.pricePerDay?.toFixed(2)}/day</p>
                </div>
              </div>

              {/* Itinerary */}
              {selectedTrip.destinations && selectedTrip.destinations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Your Itinerary</h3>
                  <div className="space-y-3">
                    {selectedTrip.destinations.map((dest, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{dest.title}</h4>
                          {dest.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {dest.description}
                            </p>
                          )}
                          {dest.location && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {dest.location}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">${dest.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedTrip.notes && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-primary">Notes</h3>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedTrip.notes}
                  </p>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  {selectedTrip.destinations?.map((dest, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Day {index + 1}: {dest.title}
                      </span>
                      <span>${dest.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total Estimated Cost</span>
                    <span className="text-primary">${selectedTrip.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedTrip(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
