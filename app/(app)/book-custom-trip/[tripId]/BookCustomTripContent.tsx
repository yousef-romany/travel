"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, DollarSign, Users, Clock, CheckCircle, Loader2 } from "lucide-react";
import { PlanTripType } from "@/fetch/plan-trip";
import { createBooking } from "@/fetch/bookings";
import { createInvoice } from "@/fetch/invoices";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PaymentComingSoonBanner from "@/components/payment-coming-soon-banner";

interface BookCustomTripContentProps {
  trip: PlanTripType;
}

export default function BookCustomTripContent({ trip }: BookCustomTripContentProps) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: "",
    numberOfTravelers: 1,
    travelDate: undefined as Date | undefined,
    specialRequests: "",
  });

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!formData.travelDate) {
        throw new Error("Please select a travel date");
      }

      if (!formData.phone) {
        throw new Error("Please provide a phone number");
      }

      // Create booking for custom trip
      const bookingData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        numberOfTravelers: formData.numberOfTravelers,
        travelDate: formData.travelDate.toISOString(),
        totalAmount: trip.totalPrice * formData.numberOfTravelers,
        specialRequests: formData.specialRequests,
        bookingType: "custom-trip" as const,
        planTripId: trip.documentId,
        customTripName: trip.tripName,
        userId: user?.documentId,
      };

      const booking = await createBooking(bookingData);

      // Create invoice
      const invoiceData = {
        invoiceNumber: `INV-${Date.now()}`,
        bookingId: booking.data.documentId,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        tripName: trip.tripName,
        tripDate: formData.travelDate.toISOString(),
        tripDuration: trip.estimatedDuration,
        numberOfTravelers: formData.numberOfTravelers,
        pricePerPerson: trip.totalPrice,
        totalAmount: trip.totalPrice * formData.numberOfTravelers,
        bookingType: "custom-trip" as const,
        userId: user?.documentId,
      };

      await createInvoice(invoiceData);

      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      queryClient.invalidateQueries({ queryKey: ["userInvoices"] });
      toast.success("Booking created successfully! We'll contact you soon.");
      router.push("/me?tab=trips");
    },
    onError: (error: any) => {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to create booking. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to book this trip");
      router.push("/login");
      return;
    }

    bookingMutation.mutate();
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const totalCost = trip.totalPrice * formData.numberOfTravelers;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Booking Form - Left Side */}
        <div className="lg:col-span-2">
          <PaymentComingSoonBanner />

          <Card className="border-primary/20 shadow-xl mt-6">
            <CardHeader>
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Book Your Custom Trip
              </CardTitle>
              <CardDescription>
                Fill in your details to complete the booking for this amazing journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                {/* Trip Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Trip Details</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="travelers">Number of Travelers *</Label>
                      <Input
                        id="travelers"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.numberOfTravelers}
                        onChange={(e) => handleChange("numberOfTravelers", parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Travel Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.travelDate ? (
                              format(formData.travelDate, "PPP")
                            ) : (
                              <span className="text-muted-foreground">Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.travelDate}
                            onSelect={(date) => handleChange("travelDate", date)}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Textarea
                      id="requests"
                      value={formData.specialRequests}
                      onChange={(e) => handleChange("specialRequests", e.target.value)}
                      placeholder="Any special requirements or requests for your trip..."
                      rows={4}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg py-6"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirm Booking - ${totalCost.toLocaleString()}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Trip Summary - Right Side */}
        <div className="lg:col-span-1">
          <Card className="border-primary/20 shadow-xl sticky top-4">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-amber-500/10">
              <CardTitle className="text-xl">Trip Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <h3 className="font-bold text-xl mb-2">{trip.tripName}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">{trip.estimatedDuration} Days</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Destinations:</span>
                  <span className="font-semibold">{trip.destinations?.length || 0} Places</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Travelers:</span>
                  <span className="font-semibold">{formData.numberOfTravelers}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per person:</span>
                  <span className="font-semibold">${trip.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Number of travelers:</span>
                  <span className="font-semibold">× {formData.numberOfTravelers}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-primary">${totalCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Destinations Preview */}
              {trip.destinations && trip.destinations.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-sm">Itinerary:</h4>
                  <div className="space-y-1">
                    {trip.destinations.slice(0, 5).map((dest, idx) => (
                      <div key={idx} className="text-xs flex items-start gap-2">
                        <span className="text-primary font-bold">Day {idx + 1}:</span>
                        <span className="text-muted-foreground">{dest.title}</span>
                      </div>
                    ))}
                    {trip.destinations.length > 5 && (
                      <div className="text-xs text-muted-foreground italic">
                        +{trip.destinations.length - 5} more destinations
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
