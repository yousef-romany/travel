"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Loader2,
  ChevronDownIcon,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Check,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { createBooking } from "@/fetch/bookings";
import { createInvoice } from "@/fetch/invoices";
import { generateInvoicePDF, downloadInvoicePDF } from "@/lib/pdf-generator";
import { uploadFileToStrapi } from "@/lib/upload-file";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import PaymentComingSoonBanner from "@/components/payment-coming-soon-banner";
import { trackWhatsAppBooking } from "@/lib/analytics";
import { fetchProgramAvailability } from "@/fetch/availability";
import { PromoCodeInput } from "@/components/booking/PromoCodeInput";
import { PromoCode, incrementPromoCodeUsage } from "@/fetch/promo-codes";

interface BookingPageContentProps {
  program: {
    documentId: string;
    title: string;
    price: number;
    duration: number;
    tripType?: "single-day" | "multi-day";
    startTime?: string;
    endTime?: string;
    meetingPoint?: string;
    departureLocation?: string;
    returnLocation?: string;
    Location?: string;
    images?: any[];
  };
}

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  numberOfTravelers: number;
  travelDate: Date | undefined;
  specialRequests: string;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201555100961";

export default function BookingPageContent({ program }: BookingPageContentProps) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // Map of date string (YYYY-MM-DD) to availability data (spots + status)
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, { spots: number; status: string }>>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: PromoCode;
    discountAmount: number;
    finalPrice: number;
  } | null>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phone: "",
    numberOfTravelers: 1,
    travelDate: undefined,
    specialRequests: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to make a booking");
      router.push(`/login?redirect=/programs/${program.documentId}/book`);
    }
  }, [user, router, program.documentId]);

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName:
          user?.profile?.firstName && user?.profile?.lastName
            ? `${user.profile.firstName} ${user.profile.lastName}`
            : prev.fullName,
        email: user?.email || prev.email,
        phone: user?.profile?.phone || prev.phone,
      }));
    }
  }, [user]);

  // Load availability
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        setIsLoadingAvailability(true);
        // Fetch 90 days of availability
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 90);

        const response = await fetchProgramAvailability(
          program.documentId,
          today.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0]
        );

        // Create map of date -> { spots, status }
        const map: Record<string, { spots: number; status: string }> = {};
        response.data.forEach((item) => {
          // Only include dates that are available and not sold-out/cancelled
          if (
            item.isAvailable &&
            item.availableSpots > 0 &&
            item.availabilityStatus !== "sold-out" &&
            item.availabilityStatus !== "cancelled"
          ) {
            map[item.date] = {
              spots: item.availableSpots,
              status: item.availabilityStatus
            };
          }
        });

        setAvailabilityMap(map);
      } catch (error) {
        console.error("Error loading availability:", error);
      } finally {
        setIsLoadingAvailability(false);
      }
    };
    loadAvailability();
  }, [program.documentId]);

  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: async (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });

      try {
        // Increment promo code usage if applied
        if (appliedPromo) {
          await incrementPromoCodeUsage(appliedPromo.code.documentId);
        }

        const invoiceNumber = `INV-${Date.now()}-${data.data.documentId}`;
        const finalAmount = appliedPromo ? appliedPromo.finalPrice : (program.price * formData.numberOfTravelers);

        const invoiceData = {
          invoiceNumber,
          bookingId: data.data.documentId,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          tripName: program.title,
          tripDate: formData.travelDate!.toISOString(),
          tripDuration: program.duration,
          numberOfTravelers: formData.numberOfTravelers,
          pricePerPerson: program.price,
          totalAmount: finalAmount,
          bookingType: "program" as const,
          userId: user?.documentId,
          bookingDate: new Date().toISOString(),
        };

        // Generate PDF
        const pdfBlob = await generateInvoicePDF(invoiceData);

        // Upload PDF
        let pdfUrl: string | undefined;
        try {
          pdfUrl = await uploadFileToStrapi(pdfBlob, `invoice-${invoiceNumber}.pdf`);
        } catch (uploadError) {
          console.error("PDF upload failed:", uploadError);
        }

        // Create invoice
        await createInvoice({ ...invoiceData, pdfUrl });

        // Download PDF
        await downloadInvoicePDF(invoiceData, `invoice-${invoiceNumber}.pdf`);

        // WhatsApp message with discount info
        const discountText = appliedPromo ? `\n• Discount: -$${appliedPromo.discountAmount.toFixed(2)} (${appliedPromo.code.code})` : "";
        const whatsAppMessage = `🎉 *New Booking Request*\n\n📋 *Booking Details:*\n• Tour: ${program.title}\n• Customer: ${formData.fullName}\n• Email: ${formData.email}\n• Phone: ${formData.phone}\n• Number of Travelers: ${formData.numberOfTravelers}\n• Travel Date: ${format(formData.travelDate!, "PPP")}${discountText}\n• Total Amount: $${finalAmount.toFixed(2)}\n\n${formData.specialRequests ? `📝 *Special Requests:*\n${formData.specialRequests}\n` : ""}Please confirm this booking as soon as possible.\n\nThank you! 🙏`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsAppMessage)}`;

        // Track WhatsApp booking
        trackWhatsAppBooking(program.title, program.documentId, finalAmount);

        window.open(whatsappUrl, "_blank");

        toast.success("Booking submitted successfully! Invoice PDF downloaded.");
        router.push("/me?tab=bookings");
      } catch (error) {
        console.error("Invoice generation error:", error);
        toast.error("Booking created but invoice generation failed.");
      }
    },
    onError: (error: any) => {
      console.error("Booking error:", error);
      let errorMessage = "Failed to submit booking. Please try again.";
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      }
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.travelDate) {
      toast.error("Please select a travel date");
      return;
    }

    if (!user) {
      toast.error("Please log in to make a booking");
      return;
    }

    // Check availability for selected date
    if (formData.travelDate) {
      const dateStr = formData.travelDate.toISOString().split("T")[0];
      // Only check if we have availability data loaded
      if (Object.keys(availabilityMap).length > 0) {
        const availability = availabilityMap[dateStr];
        if (!availability) {
          toast.error("Selected date is not available");
          return;
        }
        if (availability.status === "sold-out") {
          toast.error("This date is sold out. Please select another date.");
          return;
        }
        if (availability.status === "cancelled") {
          toast.error("This date has been cancelled. Please select another date.");
          return;
        }
        if (formData.numberOfTravelers > availability.spots) {
          toast.error(`Only ${availability.spots} spot${availability.spots === 1 ? '' : 's'} available for this date`);
          return;
        }
      }
    }

    const totalAmount = program.price * formData.numberOfTravelers;
    const finalAmount = appliedPromo ? appliedPromo.finalPrice : totalAmount;

    createBookingMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      numberOfTravelers: formData.numberOfTravelers,
      travelDate: formData.travelDate!.toISOString(),
      specialRequests: formData.specialRequests,
      programId: program.documentId,
      userId: user!.documentId,
      totalAmount: finalAmount,
      promoCodeId: appliedPromo?.code.documentId,
      discountAmount: appliedPromo?.discountAmount,
      finalPrice: appliedPromo?.finalPrice,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfTravelers" ? parseInt(value) || 1 : value,
    }));
  };

  const isDateAvailable = (date: Date): boolean => {
    // If no availability data loaded yet or empty, allow all future dates
    if (Object.keys(availabilityMap).length === 0) return true;
    const dateStr = date.toISOString().split("T")[0];
    return !!availabilityMap[dateStr]; // true if date exists in map (implies spots > 0 from fetch logic)
  };

  const isDateDisabled = (date: Date): boolean => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // If availability data exists, check if date is available
    if (Object.keys(availabilityMap).length > 0 && !isDateAvailable(date)) return true;

    return false;
  };

  // Get available spots for selected date
  const getSelectedDateSpots = (): number | null => {
    if (!formData.travelDate) return null;
    const dateStr = formData.travelDate.toISOString().split("T")[0];
    return availabilityMap[dateStr]?.spots ?? null;
  };

  // Get availability status for selected date
  const getSelectedDateStatus = (): string | null => {
    if (!formData.travelDate) return null;
    const dateStr = formData.travelDate.toISOString().split("T")[0];
    return availabilityMap[dateStr]?.status ?? null;
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "limited":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "sold-out":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "cancelled":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const handlePromoApplied = (promoCode: PromoCode, discountAmount: number, finalPrice: number) => {
    setAppliedPromo({ code: promoCode, discountAmount, finalPrice });
  };

  const handlePromoRemoved = () => {
    setAppliedPromo(null);
  };

  const totalAmount = program.price * formData.numberOfTravelers;
  const finalAmount = appliedPromo ? appliedPromo.finalPrice : totalAmount;
  const firstImage = program.images?.[0];
  const imageUrl = firstImage?.imageUrl
    ? getImageUrl(firstImage.imageUrl as string)
    : firstImage
      ? getImageUrl(firstImage as any)
      : "/placeholder.svg";

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link
          href={`/programs/${program.documentId}`}
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Program
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            Book Your Experience
          </h1>
          <p className="text-muted-foreground">Complete your booking for {program.title}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="md:col-span-2">
            <PaymentComingSoonBanner />

            <Card className="border-primary/20 shadow-xl mt-6">
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Personal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+20 123 456 7890"
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Trip Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Trip Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numberOfTravelers">
                          Number of Travelers <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="numberOfTravelers"
                          name="numberOfTravelers"
                          type="number"
                          min="1"
                          max="50"
                          value={formData.numberOfTravelers}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="travelDate">
                          Preferred Travel Date <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {formData.travelDate ? (
                                format(formData.travelDate, "PPP")
                              ) : (
                                <span className="text-muted-foreground">Select date</span>
                              )}
                              <ChevronDownIcon className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          {formData.travelDate && getSelectedDateSpots() !== null && (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2">
                                <Check className="w-3 h-3 text-primary" />
                                <span className="text-xs font-medium text-foreground">
                                  {getSelectedDateSpots()} spot{getSelectedDateSpots() === 1 ? '' : 's'} available
                                </span>
                              </div>
                              {getSelectedDateStatus() && (
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadgeClass(getSelectedDateStatus()!)}`}>
                                    {getSelectedDateStatus() === "available" ? "✓ Available" :
                                      getSelectedDateStatus() === "limited" ? "⚠ Limited Spots" :
                                        getSelectedDateStatus() === "sold-out" ? "✕ Sold Out" :
                                          getSelectedDateStatus() === "cancelled" ? "✕ Cancelled" :
                                            getSelectedDateStatus()}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.travelDate}
                              onSelect={(date) => {
                                setFormData((prev) => ({ ...prev, travelDate: date }));
                                if (date) setIsCalendarOpen(false);
                              }}
                              disabled={isDateDisabled}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                      rows={4}
                    />
                  </div>

                  <Separator />

                  {/* Promo Code */}
                  <div className="space-y-4">
                    <PromoCodeInput
                      totalAmount={totalAmount}
                      programId={program.documentId}
                      onPromoApplied={handlePromoApplied}
                      onPromoRemoved={handlePromoRemoved}
                    />
                  </div>

                  <Separator />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white text-lg py-6"
                    disabled={createBookingMutation.isPending}
                  >
                    {createBookingMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Booking...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Program Summary */}
              <Card className="border-primary/20 shadow-xl overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={imageUrl}
                    alt={program.title}
                    fill
          sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 400px"
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold">{program.title}</h3>

                  {program.Location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {program.Location}
                    </div>
                  )}

                  {program.startTime && program.endTime && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {program.startTime} - {program.endTime}
                    </div>
                  )}

                  {program.meetingPoint && (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">Meeting Point:</p>
                      <p className="text-sm text-muted-foreground">{program.meetingPoint}</p>
                    </div>
                  )}

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Price per person:</span>
                      <span className="font-semibold">${program.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Number of travelers:</span>
                      <span className="font-semibold">{formData.numberOfTravelers}</span>
                    </div>
                    {appliedPromo && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({appliedPromo.code.code}):</span>
                          <span className="font-semibold">-${appliedPromo.discountAmount.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        Total Amount:
                      </span>
                      <span className="text-primary">${finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Badge */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-amber-600/5 p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Secure Booking</p>
                    <p className="text-xs text-muted-foreground">
                      Your information is encrypted and secure. We'll send you a confirmation email and invoice after booking.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
