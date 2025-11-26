/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import PlaceCard from "./components/PlaceCard";
import TravelPlanItem from "./components/TravelPlanItem";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import {
  PlacesToGoBlogs,
  PlacesToGoCategory,
  PlacesToGoCategoryData,
  PlacesToGoSubcategories,
} from "@/type/placesToGo";
import { fetchPlanYourTrip } from "@/fetch/planYourTrip";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { MapPin, FileText, Send, Eye, Save, Users, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { createPlanTrip, type PlanTripDestination, fetchBestCustomTrips } from "@/fetch/plan-trip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlanYourTripContent() {
  const [travelPlan, setTravelPlan] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [tripName, setTripName] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active?.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active?.id !== over?.id) {
      setTravelPlan((items) => {
        const oldIndex = items.findIndex(
          (item) => item?.id.toString() === active?.id
        );
        const newIndex = items.findIndex(
          (item) => item?.id.toString() === over?.id
        );

        if (oldIndex === -1) {
          const newItem = selectedSubcategory?.place_to_go_blogs?.find(
            (place) => place?.id.toString() === active?.id
          );
          if (newItem && !items.some((item) => item?.id === newItem?.id)) {
            return [
              ...items.slice(0, newIndex),
              newItem,
              ...items.slice(newIndex),
            ];
          }
        } else if (newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }

        return items;
      });
    }

    setActiveId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (over && active?.id !== over?.id) {
      const activePlace = selectedSubcategory?.place_to_go_blogs?.find(
        (place) => place?.id.toString() === active?.id
      );
      if (
        activePlace &&
        !travelPlan.some((place) => place?.id === activePlace?.id)
      ) {
        setTravelPlan((prevPlan) => [...prevPlan, activePlace]);
      }
    }
  };

  const removeFromPlan = (placeId: number) => {
    setTravelPlan((prevPlan) =>
      prevPlan.filter((place) => place?.id !== placeId)
    );
  };

  const totalPrice = travelPlan.reduce(
    (sum, place) => sum + Number(place.price),
    0
  );

  // Estimate 1 day per place, with realistic trip duration
  const estimatedDuration = travelPlan.length > 0 ? Math.max(travelPlan.length, 1) : 0;
  const pricePerDay = estimatedDuration > 0 ? totalPrice / estimatedDuration : 0;

  const handleFinishPlanning = () => {
    if (travelPlan.length === 0) {
      toast.error("Please add at least one place to your travel plan");
      return;
    }
    setIsFinishDialogOpen(true);
  };

  // Mutation for creating plan trip
  const createPlanTripMutation = useMutation({
    mutationFn: createPlanTrip,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userPlanTrips"] });

      // Show different message based on status
      if (data?.data?.status === "quoted") {
        toast.success("Booking request submitted! We'll contact you soon with a quote.");
      } else {
        toast.success("Trip plan saved successfully!");
      }

      setIsFinishDialogOpen(false);
      setTripName("");
    },
    onError: (error: any) => {
      console.error("Error saving trip plan:", error);
      const errorMessage = error.response?.data?.error?.message || "Failed to save trip plan. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSaveCustomTrip = () => {
    if (!user) {
      toast.error("Please login to save your trip");
      router.push("/login");
      return;
    }

    if (!tripName.trim()) {
      toast.error("Please enter a trip name");
      return;
    }

    if (travelPlan.length === 0) {
      toast.error("Please add at least one place to your travel plan");
      return;
    }

    // Prepare destinations data
    const destinations: PlanTripDestination[] = travelPlan.map((place) => ({
      id: place.id,
      title: place.title,
      price: Number(place.price),
      location: place.location || "",
      description: place.description || "",
    }));

    // Create plan trip
    createPlanTripMutation.mutate({
      tripName,
      destinations,
      totalPrice,
      estimatedDuration,
      pricePerDay,
      userId: user.documentId,
    });
  };

  const handleCreateBooking = () => {
    if (!user) {
      toast.error("Please login to create a booking");
      router.push("/login");
      return;
    }

    if (!tripName.trim()) {
      toast.error("Please enter a trip name");
      return;
    }

    if (travelPlan.length === 0) {
      toast.error("Please add at least one place to your travel plan");
      return;
    }

    // Prepare destinations data
    const destinations: PlanTripDestination[] = travelPlan.map((place) => ({
      id: place.id,
      title: place.title,
      price: Number(place.price),
      location: place.location || "",
      description: place.description || "",
    }));

    // Create plan trip with "quoted" status
    createPlanTripMutation.mutate({
      tripName,
      destinations,
      totalPrice,
      estimatedDuration,
      pricePerDay,
      userId: user.documentId,
      status: "quoted",
    });
  };

  const handleRequestQuote = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201555100961";

    const placesList = travelPlan.map((place, idx) => `Day ${idx + 1}: ${place.title} - $${place.price}`).join("\n");

    const message = `🌍 *Custom Trip Quote Request*

📍 *Itinerary:*
${placesList}

📊 *Trip Summary:*
⏱️ Duration: ${estimatedDuration} ${estimatedDuration === 1 ? 'Day' : 'Days'}
💰 Total Cost: $${totalPrice}
📈 Price/Day: $${pricePerDay.toFixed(2)}
🧳 Destinations: ${travelPlan.length}

${user ? `👤 *Contact Info:*\n📛 Name: ${user.profile?.firstName} ${user.profile?.lastName}\n📧 Email: ${user.email}\n` : ""}
I would like to get a personalized quote for this custom itinerary. Please contact me with more details.

Thank you! 🙏`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast.success("Opening WhatsApp to request quote!");
    setIsFinishDialogOpen(false);
  };

  const handleViewSummary = () => {
    setIsFinishDialogOpen(false);
    setIsSummaryDialogOpen(true);
  };

  const { data, isLoading, error } = useQuery<PlacesToGoCategory>({
    queryKey: ["fetchPlanYourTrip"],
    queryFn: fetchPlanYourTrip,
  });

  // Fetch best custom trips
  const { data: bestTrips } = useQuery({
    queryKey: ["bestCustomTrips"],
    queryFn: () => fetchBestCustomTrips(6),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [selectedCategory, setSelectedCategory] = useState(data?.data?.at(0));
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    data?.data?.at(0)?.place_to_go_subcategories[0]
  );
  useEffect(() => {
    setSelectedCategory(data?.data?.at(0));
    setSelectedSubcategory(data?.data?.at(0)?.place_to_go_subcategories[0]);
  }, [data]);
  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="!px-[2em] mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary animate-slide-up">
          Plan Your Travel
        </h1>

        {/* Best Custom Trips Section */}
        {bestTrips?.data && bestTrips.data.length > 0 && (
          <div className="mb-12 animate-slide-up animate-delay-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Popular Custom Trips
                </h2>
                <p className="text-muted-foreground mt-1">
                  Discover amazing itineraries created by our community
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestTrips.data.map((trip) => (
                <Card
                  key={trip.id}
                  className="border-border hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => router.push(`/plan-your-trip/${trip.documentId}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg hover:text-primary transition-colors">{trip.tripName}</CardTitle>
                      <Badge className={getStatusColor(trip.status)}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </Badge>
                    </div>
                    {trip.user && (
                      <CardDescription className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Created by {trip.user.username || trip.user.email?.split('@')[0] || 'Anonymous'}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {trip.destinations?.length || 0} stops
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <CalendarIcon className="w-4 h-4" />
                          {trip.estimatedDuration} {trip.estimatedDuration === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Total Cost</span>
                          <span className="text-xl font-bold text-primary">
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
                            {trip.destinations.slice(0, 3).map((dest, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-muted px-2 py-1 rounded"
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 animate-slide-up animate-delay-300">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {data?.data?.map((category: PlacesToGoCategoryData) => (
                  <Badge
                    key={category?.id}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedSubcategory(
                        category?.place_to_go_subcategories[0]
                      );
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer`}
                    variant={
                      selectedCategory?.categoryName === category.categoryName
                        ? "default"
                        : "secondary"
                    }
                  >
                    {category.categoryName}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Subcategories
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedCategory?.place_to_go_subcategories.map(
                  (subcategory: PlacesToGoSubcategories) => (
                    <Badge
                      key={subcategory.categoryName}
                      onClick={() => setSelectedSubcategory(subcategory)}
                      className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer`}
                      variant={
                        selectedSubcategory?.categoryName ===
                          subcategory?.categoryName
                          ? "default"
                          : "secondary"
                      }
                    >
                      {subcategory.categoryName}
                    </Badge>
                  )
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Places
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSubcategory?.place_to_go_blogs?.map(
                  (place: PlacesToGoBlogs) => (
                    <PlaceCard
                      key={place?.id}
                      place={place}
                      isInPlan={travelPlan.some((p) => p?.id === place?.id)}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          <div className="animate-slide-up animate-delay-400">
            <div className="bg-card shadow-lg rounded-lg p-6 sticky top-4">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Your Travel Plan
              </h2>
              <SortableContext
                items={travelPlan.map((item) => item?.id)}
                strategy={verticalListSortingStrategy}
                disabled
              >
                {travelPlan.map((place) => (
                  <TravelPlanItem
                    key={place?.id}
                    place={place}
                    onRemove={() => {
                      removeFromPlan(place?.id);
                    }}
                  />
                ))}
              </SortableContext>
              {travelPlan.length === 0 && (
                <p className="text-primary text-center">
                  Drag and drop places here to build your plan
                </p>
              )}
              {travelPlan.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Estimated Duration</p>
                      <p className="font-semibold text-primary">{estimatedDuration} {estimatedDuration === 1 ? 'Day' : 'Days'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price per Day</p>
                      <p className="font-semibold text-primary">${pricePerDay.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xl font-semibold text-primary">
                      Total Price: ${totalPrice}
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-4 space-y-2">
                <Button
                  onClick={handleFinishPlanning}
                  className="w-full py-2 px-4 rounded transition duration-200"
                  disabled={travelPlan.length === 0}
                >
                  Finish Planning
                </Button>
                <Button
                  onClick={() => setTravelPlan([])}
                  variant="outline"
                  className="w-full py-2 px-4 rounded transition duration-200"
                >
                  Clear Plan
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Finish Planning Dialog */}
        <Dialog open={isFinishDialogOpen} onOpenChange={setIsFinishDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>What would you like to do with your trip plan?</DialogTitle>
              <DialogDescription>
                You have {travelPlan.length} place{travelPlan.length !== 1 ? 's' : ''} in your plan with a total of ${totalPrice}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Trip Name Input */}
              <div className="space-y-2">
                <Label htmlFor="tripName">Trip Name (required for saving)</Label>
                <Input
                  id="tripName"
                  placeholder="e.g., Egypt Adventure 2025"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="grid gap-3">
                <Button
                  onClick={handleSaveCustomTrip}
                  variant="outline"
                  className="w-full justify-start h-auto py-4"
                  disabled={createPlanTripMutation.isPending}
                >
                  <Save className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">
                      {createPlanTripMutation.isPending ? "Saving..." : "Save as Custom Trip"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Save this itinerary to your account for later
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={handleCreateBooking}
                  variant="outline"
                  className="w-full justify-start h-auto py-4"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Create Booking Now</div>
                    <div className="text-xs text-muted-foreground">
                      Book this trip and proceed to payment
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={handleRequestQuote}
                  variant="outline"
                  className="w-full justify-start h-auto py-4"
                >
                  <Send className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Request Quote</div>
                    <div className="text-xs text-muted-foreground">
                      Get a personalized quote for this itinerary
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={handleViewSummary}
                  variant="outline"
                  className="w-full justify-start h-auto py-4"
                >
                  <Eye className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">View Summary</div>
                    <div className="text-xs text-muted-foreground">
                      See detailed summary of your planned trip
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Trip Summary Dialog */}
        <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Your Custom Trip Summary</DialogTitle>
              <DialogDescription>
                Review your planned itinerary details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Trip Overview */}
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-primary">Trip Overview</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Places</p>
                    <p className="font-semibold">{travelPlan.length} destinations</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold">{estimatedDuration} {estimatedDuration === 1 ? 'Day' : 'Days'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated Cost</p>
                    <p className="font-semibold text-primary">${totalPrice}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <p className="text-muted-foreground text-sm">Average cost per day</p>
                  <p className="font-semibold text-lg text-primary">${pricePerDay.toFixed(2)}/day</p>
                </div>
              </div>

              {/* Itinerary */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-primary">Your Itinerary</h3>
                <div className="space-y-3">
                  {travelPlan.map((place, index) => (
                    <div
                      key={place.id}
                      className="flex gap-4 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{place.title}</h4>
                        {place.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {place.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">${place.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  {travelPlan.map((place, index) => (
                    <div key={place.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Day {index + 1}: {place.title}
                      </span>
                      <span>${place.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total Estimated Cost</span>
                    <span className="text-primary">${totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleRequestQuote}
                  className="flex-1"
                >
                  Request Quote via WhatsApp
                </Button>
                <Button
                  onClick={() => setIsSummaryDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <DragOverlay>
        {activeId ? (
          <PlaceCard
            place={
              selectedSubcategory?.place_to_go_blogs?.find(
                (place) => place?.id.toString() === activeId
              ) || travelPlan.find((place) => place?.id.toString() === activeId)
            }
            isInPlan={travelPlan.some((p) => p?.id.toString() === activeId)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
