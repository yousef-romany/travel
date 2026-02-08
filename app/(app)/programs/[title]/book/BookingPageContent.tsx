import { Service } from "@/type/programs";

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
import { createBooking, verifyBookingPayment } from "@/fetch/bookings";
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
import PayPalPayment from "@/components/booking/PayPalPayment";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
    services?: Service[];
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
  const [paymentStep, setPaymentStep] = useState<"details" | "payment">("details");

  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

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
          services: (program.services || [])
            .filter(s => selectedServices.includes(s.documentId))
            .map(s => ({
              name: s.name,
              price: s.type === 'per_person' ? s.price * formData.numberOfTravelers : s.price
            })),
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
        await createInvoice({
          ...invoiceData,
          pdfUrl,
          // If we are in payment step (PayPal flow), marking as paid would be ideal, 
          // but relying on backend verification is safer. 
          // For now, we update the status if the trigger was from payment success.
        });

        // Force update status if it was paid via PayPal
        // Note: The createInvoice function sets default 'pending'. 
        // If we want it 'paid', we should update it immediately or pass it if createInvoice allowed it.
        // Checking createInvoice sig (fetch/invoices.ts), it forces 'pending'. 
        // We will call updateInvoiceStatus if needed, or just let it be pending until verified.
        // Actually, let's update it to 'paid' since we captured the payment.
        try {
          const { updateInvoiceStatusByBookingId } = await import("@/fetch/invoices");
          await updateInvoiceStatusByBookingId(data.data.documentId, "paid");
        } catch (statusError) {
          console.error("Failed to update invoice status to paid", statusError);
        }

        // Download PDF

        // Download PDF
        await downloadInvoicePDF(invoiceData, `invoice-${invoiceNumber}.pdf`);

        // WhatsApp message with discount info
        const discountText = appliedPromo ? `\n• Discount: -$${appliedPromo.discountAmount.toFixed(2)} (${appliedPromo.code.code})` : "";
        const servicesText = selectedServices.length > 0
          ? `\n• Services: ${(program.services || [])
            .filter(s => selectedServices.includes(s.documentId))
            .map(s => `${s.name} ($${s.price})`)
            .join(", ")}`
          : "";

        const whatsAppMessage = `🎉 *New Booking Request*\n\n📋 *Booking Details:*\n• Tour: ${program.title}\n• Customer: ${formData.fullName}\n• Email: ${formData.email}\n• Phone: ${formData.phone}\n• Number of Travelers: ${formData.numberOfTravelers}\n• Travel Date: ${format(formData.travelDate!, "PPP")}${servicesText}${discountText}\n• Total Amount: $${finalAmount.toFixed(2)}\n\n${formData.specialRequests ? `📝 *Special Requests:*\n${formData.specialRequests}\n` : ""}Please confirm this booking as soon as possible.\n\nThank you! 🙏`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsAppMessage)}`;

        // Track WhatsApp booking
        trackWhatsAppBooking(program.title, program.documentId, finalAmount);

        window.open(whatsappUrl, "_blank");

        toast.success("Booking submitted successfully! Invoice PDF downloaded.");
        router.push(`/booking/success?bookingId=${data.data.documentId}`);
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


  const verifyBookingMutation = useMutation({
    mutationFn: (data: { orderID: string; bookingData: any }) =>
      verifyBookingPayment(data.orderID, data.bookingData),
    onSuccess: async (data: any) => {
      // Reuse the success logic from createBookingMutation
      // We can just extract the success logic into a helper function or copy it
      // For simplicity/robustness, let's copy the essential success logic here
      // or trigger the onSuccess of the other mutation if possible (not easily).
      // Let's refactor the success logic to a constant
      await handleBookingSuccess(data);
    },
    onError: (error: any) => {
      console.error("Verification error:", error);
      setPaymentError("Payment verification failed. Please contact support.");
      toast.error("Payment verification failed.");
    }
  });

  const handleBookingSuccess = async (data: any) => {
    queryClient.invalidateQueries({ queryKey: ["userBookings"] });

    try {
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
        services: (program.services || [])
          .filter(s => selectedServices.includes(s.documentId))
          .map(s => ({
            name: s.name,
            price: s.type === 'per_person' ? s.price * formData.numberOfTravelers : s.price
          })),
      };

      const pdfBlob = await generateInvoicePDF(invoiceData);
      let pdfUrl: string | undefined;
      try {
        pdfUrl = await uploadFileToStrapi(pdfBlob, `invoice-${invoiceNumber}.pdf`);
      } catch (uploadError) {
        console.error("PDF upload failed:", uploadError);
      }

      await createInvoice({
        ...invoiceData,
        pdfUrl,
      });

      // Update invoice to paid since this came from PayPal
      try {
        const { updateInvoiceStatusByBookingId } = await import("@/fetch/invoices");
        await updateInvoiceStatusByBookingId(data.data.documentId, "paid");
      } catch (statusError) {
        console.error("Failed to update invoice status", statusError);
      }

      await downloadInvoicePDF(invoiceData, `invoice-${invoiceNumber}.pdf`);

      const discountText = appliedPromo ? `\n• Discount: -$${appliedPromo.discountAmount.toFixed(2)} (${appliedPromo.code.code})` : "";
      const servicesText = selectedServices.length > 0
        ? `\n• Services: ${(program.services || [])
          .filter(s => selectedServices.includes(s.documentId))
          .map(s => `${s.name} ($${s.price})`)
          .join(", ")}`
        : "";

      const whatsAppMessage = `🎉 *New Booking Request*\n\n📋 *Booking Details:*\n• Tour: ${program.title}\n• Customer: ${formData.fullName}\n• Email: ${formData.email}\n• Phone: ${formData.phone}\n• Number of Travelers: ${formData.numberOfTravelers}\n• Travel Date: ${format(formData.travelDate!, "PPP")}${servicesText}${discountText}\n• Total Amount: $${finalAmount.toFixed(2)}\n\n${formData.specialRequests ? `📝 *Special Requests:*\n${formData.specialRequests}\n` : ""}Please confirm this booking as soon as possible.\n\nThank you! 🙏`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsAppMessage)}`;

      trackWhatsAppBooking(program.title, program.documentId, finalAmount);
      window.open(whatsappUrl, "_blank");

      toast.success("Booking confirmed! Invoice downloaded.");
      router.push(`/booking/success?bookingId=${data.data.documentId}`);
    } catch (error) {
      console.error("Post-booking processing error:", error);
      // Even if PDF/Invoice fails, booking is done
      router.push(`/booking/success?bookingId=${data.data.documentId}`);
    }
  };


  const handlePaymentSuccess = (details: any) => {
    // Payment approved!
    toast.success("Payment successful! Verifying and finalizing booking...");
    const totalAmount = program.price * formData.numberOfTravelers;
    const finalAmount = appliedPromo ? appliedPromo.finalPrice : totalAmount;

    // Call verify endpoint
    verifyBookingMutation.mutate({
      orderID: details.id, // PayPal returns 'id' as order ID
      bookingData: {
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
        selectedServices,
      }
    });
  };


  const handlePaymentError = (error: any) => {
    console.error("PayPal Error:", error);
    setPaymentError("Payment failed or was cancelled. Please try again.");
    toast.error("Payment failed. Please try again.");
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    // Validate fields
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.travelDate) {
      toast.error("Please select a travel date");
      return;
    }

    if (!user) {
      toast.error("Please log in");
      return;
    }

    // Validate availability
    if (formData.travelDate) {
      const dateStr = formData.travelDate.toISOString().split("T")[0];
      if (Object.keys(availabilityMap).length > 0) {
        const availability = availabilityMap[dateStr];
        if (!availability) {
          toast.error("Selected date is not available");
          return;
        }
        if (availability.status === "sold-out" || availability.status === "cancelled") {
          toast.error("Date is not available");
          return;
        }
        if (formData.numberOfTravelers > availability.spots) {
          toast.error(`Only ${availability.spots} spots available`);
          return;
        }
      }
    }

    // Set step to payment
    setPaymentStep("payment");
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Legacy submit (if we kept purely offline booking, but user wants PayPal)
  // We will keep this function references if needed, but primary flow is now Proceed -> Pay
  const handleSubmit = handleProceedToPayment;

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



  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const servicesTotal = (program.services || [])
    .filter(s => selectedServices.includes(s.documentId))
    .reduce((total, s) => {
      if (s.type === 'per_person') return total + (s.price * formData.numberOfTravelers);
      return total + s.price;
    }, 0);

  const baseTotal = program.price * formData.numberOfTravelers;
  const totalAmount = baseTotal + servicesTotal;
  const finalAmount = appliedPromo ? (appliedPromo.finalPrice + servicesTotal) : totalAmount;
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
            {paymentStep === "payment" && (
              <div className="mb-6 animate-in slide-in-from-top-4 fade-in duration-500">
                <Card className="border-primary/20 shadow-xl border-l-4 border-l-primary bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Review & Pay</h3>
                    <p className="text-muted-foreground mb-4">
                      Please review your details on the right and proceed with payment to confirm your booking.
                    </p>

                    {paymentError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Payment Error</AlertTitle>
                        <AlertDescription>{paymentError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="max-w-md mx-auto mt-6">
                      <PayPalPayment
                        amount={finalAmount}
                        currency="USD"
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                      <Button
                        variant="ghost"
                        onClick={() => setPaymentStep("details")}
                        className="w-full mt-4"
                      >
                        Back to Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card className="border-primary/20 shadow-xl mt-6">
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProceedToPayment} className={`space-y-6 ${paymentStep === "payment" ? "opacity-50 pointer-events-none grayscale" : ""}`}>
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
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Trip Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numberOfTravelers">
                          Number of Travelers <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const currentVal = parseInt(String(formData.numberOfTravelers));
                              const newValue = Math.max(1, currentVal - 1);
                              setFormData(prev => ({ ...prev, numberOfTravelers: newValue }));
                            }}
                            className="h-10 w-10 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <span className="text-xl font-medium">-</span>
                          </Button>
                          <div className="flex-1 max-w-[80px] text-center">
                            <span className="text-xl font-bold text-primary">{formData.numberOfTravelers}</span>
                            <p className="text-xs text-muted-foreground">Person{Number(formData.numberOfTravelers) !== 1 ? 's' : ''}</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const currentVal = parseInt(String(formData.numberOfTravelers));
                              const newValue = Math.min(50, currentVal + 1);
                              setFormData(prev => ({ ...prev, numberOfTravelers: newValue }));
                            }}
                            className="h-10 w-10 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <span className="text-xl font-medium">+</span>
                          </Button>
                          <input
                            type="hidden"
                            name="numberOfTravelers"
                            value={formData.numberOfTravelers}
                          />
                        </div>
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

                  {/* Services Selection */}
                  {program.services && program.services.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Check className="w-5 h-5 text-primary" />
                          Enhance Your Trip
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {program.services.map((service) => {
                            const isSelected = selectedServices.includes(service.documentId);
                            return (
                              <div
                                key={service.documentId}
                                onClick={() => handleServiceToggle(service.documentId)}
                                className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${isSelected
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border hover:border-primary/50 bg-card"
                                  }`}
                              >
                                {isSelected && (
                                  <div className="absolute top-3 right-3 text-primary bg-background rounded-full p-1 shadow-sm">
                                    <Check className="w-4 h-4" />
                                  </div>
                                )}

                                <div className="flex gap-4 items-start mb-3">
                                  {service.image ? (
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                      <Image
                                        src={getImageUrl(service.image)}
                                        alt={service.name}
                                        fill
                                        className="object-cover transition-transform hover:scale-105"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                      <DollarSign className="w-8 h-8 text-muted-foreground/50" />
                                    </div>
                                  )}

                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-base leading-tight mb-1 pr-6">{service.name}</h4>
                                    <p className="text-sm font-bold text-primary">
                                      +${service.price}
                                      <span className="text-xs font-normal text-muted-foreground ml-1">
                                        {service.type === 'per_person' ? '/ person' : '/ booking'}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                {service.description && (
                                  <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: service.description }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

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
                      userEmail={formData.email || user?.email}
                      userId={user?.documentId}
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
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="font-bold">Proceed to Payment</span>
                      </>
                    )}
                  </Button>

                  {/* Info Text */}
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    <p>Secure payment processing via PayPal</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6 z-10">
              {/* Program Summary */}
              <Card className="border-primary/20 shadow-2xl overflow-hidden backdrop-blur-sm bg-card/95 sticky top-24 transition-all duration-300 hover:shadow-primary/10">
                <div className="relative h-48 group">
                  <Image
                    src={imageUrl}
                    alt={program.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold line-clamp-2 leading-tight drop-shadow-md">{program.title}</h3>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  {program.Location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{program.Location}</span>
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

                    {/* Selected Services Summary */}
                    {selectedServices.length > 0 && (
                      <div className="pt-2 pb-2 space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">Add-ons:</p>
                        {(program.services || [])
                          .filter(s => selectedServices.includes(s.documentId))
                          .map(service => (
                            <div key={service.documentId} className="flex justify-between text-sm text-muted-foreground">
                              <span>+ {service.name}</span>
                              <span>${service.type === 'per_person'
                                ? (service.price * formData.numberOfTravelers).toFixed(2)
                                : service.price.toFixed(2)}
                              </span>
                            </div>
                          ))
                        }
                      </div>
                    )}

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

                    {servicesTotal > 0 && (
                      <div className="flex justify-between text-sm text-blue-600">
                        <span>Services:</span>
                        <span className="font-semibold">+${servicesTotal.toFixed(2)}</span>
                      </div>
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
    </div >
  );
}
