"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, ChevronDownIcon, ArrowLeft, ShieldCheck, AlertCircle, Phone, CreditCard, Handshake } from "lucide-react";
import { format } from "date-fns";
import { createInvoice } from "@/fetch/invoices";
import { generateInvoicePDF, downloadInvoicePDF } from "@/lib/pdf-generator";
import { uploadFileToStrapi } from "@/lib/upload-file";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PayPalPayment from "@/components/booking/PayPalPayment";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  program: {
    documentId: string;
    title: string;
    price: number;
    duration: number;
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

interface CreateInvoiceData {
  invoiceNumber: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tripName: string;
  tripDate: string;
  tripDuration: number;
  numberOfTravelers: number;
  pricePerPerson: number;
  totalAmount: number;
  bookingType?: "program" | "custom-trip" | "event";
  userId?: string;
}

interface PDFInvoiceData extends CreateInvoiceData {
  bookingDate: string;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201030354067";

const generateInvoiceData = (
  formData: BookingFormData,
  program: BookingDialogProps["program"],
  bookingId: string,
  userId?: string
): { createData: CreateInvoiceData; pdfData: PDFInvoiceData } => {
  const invoiceNumber = `INV-${Date.now()}-${bookingId}`;
  const totalAmount = program.price * formData.numberOfTravelers;

  const createData: CreateInvoiceData = {
    invoiceNumber,
    bookingId,
    customerName: formData.fullName,
    customerEmail: formData.email,
    customerPhone: formData.phone,
    tripName: program.title,
    tripDate: formData.travelDate!.toISOString(),
    tripDuration: program.duration,
    numberOfTravelers: formData.numberOfTravelers,
    pricePerPerson: program.price,
    totalAmount,
    bookingType: "program" as const,
    userId,
  };

  const pdfData: PDFInvoiceData = {
    ...createData,
    bookingDate: new Date().toISOString(),
  };

  return { createData, pdfData };
};

const generateWhatsAppMessage = (
  formData: BookingFormData,
  program: BookingDialogProps["program"],
  paymentMethod: "full" | "partial",
  paypalAmount: number,
  faceToFaceAmount: number
): string => {
  const totalAmount = program.price * formData.numberOfTravelers;
  const paymentMethodText = paymentMethod === "partial"
    ? `\n💳 Pay via PayPal: $${paypalAmount.toFixed(2)} (30%)\n🤝 Pay face-to-face: $${faceToFaceAmount.toFixed(2)} (70%)`
    : `\n💳 Full payment via PayPal: $${totalAmount.toFixed(2)}`;

  return `🎉 *New Booking Request*

📋 *Booking Details:*
• Tour: ${program.title}
• Customer: ${formData.fullName}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Number of Travelers: ${formData.numberOfTravelers}
• Travel Date: ${formData.travelDate ? format(formData.travelDate, "PPP") : "Not specified"}
• Total Amount: $${totalAmount.toFixed(2)}
${paymentMethodText}

${formData.specialRequests ? `📝 *Special Requests:*\n${formData.specialRequests}\n` : ""}Please confirm this booking as soon as possible.

Thank you! 🙏`;
};

const openWhatsApp = (message: string): void => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
};

const validateFormData = (formData: BookingFormData, user: any): string | null => {
  if (!formData.fullName || !formData.email || !formData.phone) {
    return "Please fill in all required fields";
  }

  if (!formData.travelDate) {
    return "Please select a travel date";
  }

  if (!user) {
    return "Please log in to make a booking";
  }

  return null;
};

const FormField = ({
  id,
  label,
  required = false,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
  </div>
);

export default function BookingDialog({
  isOpen,
  onClose,
  program,
}: BookingDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [step, setStep] = useState<"form" | "payment" | "error">("form");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentRef, setPaymentRef] = useState<string | null>(null); // Holds PayPal orderID on backend failure
  const [paymentMethod, setPaymentMethod] = useState<"full" | "partial">("full");

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phone: "",
    numberOfTravelers: 1,
    travelDate: new Date(),
    specialRequests: "",
  });

  // Auto-fill user data when user profile loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user?.profile?.firstName && user?.profile?.lastName
          ? `${user.profile.firstName} ${user.profile.lastName}`
          : prev.fullName,
        email: user?.email || prev.email,
        phone: user?.profile?.phone || prev.phone,
      }));
    }
  }, [user]);

  // Called by PayPal after user approves & order is captured
  const handlePayPalSuccess = async (details: any) => {
    if (isProcessingPayment) return; // Prevent double-fire
    setIsProcessingPayment(true);

    const orderId: string = details?.id || details?.orderID || 'UNKNOWN';
    setPaymentRef(orderId);

    const bookingPayload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      numberOfTravelers: formData.numberOfTravelers,
      travelDate: formData.travelDate!.toISOString(),
      specialRequests: formData.specialRequests,
      programId: program.documentId,
      userId: user!.documentId,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      paypalAmount: paypalAmount,
      faceToFaceAmount: faceToFaceAmount,
    };

    try {
      // 15-second timeout to prevent infinite spinner
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15_000);

      let verifyRes: Response;
      try {
        // ✅ SECURITY: Route through server-side API proxy — no admin token on client
        verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderID: orderId, bookingData: bookingPayload }),
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!verifyRes.ok) {
        const errData = await verifyRes.json().catch(() => ({} as any)) as any;
        const message = errData?.error?.message || errData?.message || 'Booking creation failed';
        // Payment was captured but booking failed — show recovery screen
        setStep('error');
        toast.error('Your payment was received but booking confirmation failed. Use the reference below to contact us.');
        return;
      }

      const data = await verifyRes.json() as { data: { documentId: string } };
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });

      // Generate and download invoice (non-blocking — don't fail the success flow)
      try {
        const { createData, pdfData } = generateInvoiceData(
          formData, program, data.data.documentId, user?.documentId
        );
        const pdfBlob = await generateInvoicePDF(pdfData);
        let pdfUrl: string | undefined;
        try {
          pdfUrl = await uploadFileToStrapi(pdfBlob, `invoice-${createData.invoiceNumber}.pdf`, user?.token);
        } catch {
          // PDF upload failure is non-fatal
        }
        await createInvoice({ ...createData, pdfUrl }, user?.token);
        await downloadInvoicePDF(pdfData, `invoice-${createData.invoiceNumber}.pdf`);
      } catch (invoiceError) {
        console.error('Invoice error (non-fatal):', invoiceError);
      }

      toast.success('🎉 Payment successful! Your booking is confirmed.');
      onClose();
      resetForm();
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setStep('error');
        toast.error('Request timed out. Your payment may have gone through — use the reference below to contact us.');
      } else {
        console.error('Payment processing error:', err);
        setStep('error');
        toast.error('An unexpected error occurred. Please contact us with your PayPal reference.');
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePayPalError = (error: any) => {
    console.error('PayPal error:', error);
    toast.error('Payment failed. Please try again or use a different payment method.');
  };

  const handlePayPalCancel = () => {
    toast.info('Payment cancelled. You can try again when ready.');
  };

  const resetForm = () => {
    setFormData({
      fullName: user?.profile?.firstName && user?.profile?.lastName
        ? `${user.profile.firstName} ${user.profile.lastName}`
        : "",
      email: user?.email || "",
      phone: user?.profile?.phone || "",
      numberOfTravelers: 1,
      travelDate: undefined,
      specialRequests: "",
    });
    setIsCalendarOpen(false);
    setStep("form");
    setPaymentRef(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateFormData(formData, user);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Advance to payment step
    setStep("payment");
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

  const handleDateSelect = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, travelDate: date }));
    if (date) {
      setIsCalendarOpen(false);
    }
  };

  const totalAmount = program.price * formData.numberOfTravelers;
  const paypalAmount = paymentMethod === "partial" ? totalAmount * 0.3 : totalAmount;
  const faceToFaceAmount = paymentMethod === "partial" ? totalAmount * 0.7 : 0;

  return (
    // Prevent closing dialog while payment is processing
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isProcessingPayment) onClose(); }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "form" ? "Book Your Tour" : "Complete Payment"}
          </DialogTitle>
          <DialogDescription>
            {step === "form"
              ? <>Complete the form below to book <strong>{program.title}</strong></>
              : <>Secure online payment for <strong>{program.title}</strong></>}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Booking Form */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField id="fullName" label="Full Name" required>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </FormField>

            <FormField id="email" label="Email" required>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </FormField>

            <FormField id="phone" label="Phone Number" required>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+20 123 456 7890"
                required
              />
            </FormField>

            <FormField id="numberOfTravelers" label="Number of Travelers" required>
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
            </FormField>

            <FormField id="travelDate" label="Preferred Travel Date" required>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    id="travelDate"
                    className="w-full justify-between font-normal h-11"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsCalendarOpen(!isCalendarOpen);
                    }}
                  >
                    {formData.travelDate ? (
                      format(formData.travelDate, "PPP")
                    ) : (
                      <span className="text-muted-foreground">Select date</span>
                    )}
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="center"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <Calendar
                    mode="single"
                    selected={formData.travelDate}
                    captionLayout="dropdown"
                    onSelect={handleDateSelect}
                    disabled={(date: Date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 10}
                    defaultMonth={formData.travelDate || new Date()}
                  />
                </PopoverContent>
              </Popover>
            </FormField>

            <FormField id="specialRequests" label="Special Requests (Optional)">
              <Textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                rows={3}
              />
            </FormField>

            <PriceSummary
              pricePerPerson={program.price}
              numberOfTravelers={formData.numberOfTravelers}
              totalAmount={totalAmount}
            />

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                Proceed to Payment →
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* Step 2: PayPal Payment */}
        {step === "payment" && (
          <div className="space-y-5">
            {/* Payment Method Selection */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Choose Payment Method</p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("full")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    paymentMethod === "full"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === "full" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Pay Full Amount Online</p>
                    <p className="text-xs text-muted-foreground">Pay 100% via PayPal now</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "full" ? "border-primary" : "border-muted-foreground/30"
                  }`}>
                    {paymentMethod === "full" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("partial")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    paymentMethod === "partial"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === "partial" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Handshake className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Pay 30% Now, 70% Face-to-Face</p>
                    <p className="text-xs text-muted-foreground">Pay deposit online, rest on arrival</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "partial" ? "border-primary" : "border-muted-foreground/30"
                  }`}>
                    {paymentMethod === "partial" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Order summary card */}
            <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Order Summary
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tour</span>
                  <span className="font-medium">{program.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Traveler(s)</span>
                  <span className="font-medium">{formData.numberOfTravelers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {formData.travelDate ? format(formData.travelDate, "PPP") : "—"}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-1">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary text-base">${totalAmount.toFixed(2)}</span>
                </div>
                {paymentMethod === "partial" && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm font-medium">Pay now via PayPal (30%)</span>
                      <span className="font-semibold">${paypalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-amber-600">
                      <span className="text-sm font-medium">Pay on arrival (70%)</span>
                      <span className="font-semibold">${faceToFaceAmount.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {isProcessingPayment ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Confirming your booking…</p>
                <p className="text-xs text-muted-foreground">Please don&apos;t close this window.</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-center text-muted-foreground">
                  🔒 Payments are securely processed by PayPal. Pay with your PayPal account or any credit/debit card.
                </p>
                {paymentMethod === "partial" && (
                  <p className="text-xs text-center text-amber-600 font-medium">
                    You are paying 30% deposit now. The remaining 70% (${faceToFaceAmount.toFixed(2)}) will be collected face-to-face.
                  </p>
                )}
                <PayPalPayment
                  amount={paypalAmount}
                  currency="USD"
                  onSuccess={handlePayPalSuccess}
                  onError={handlePayPalError}
                  onCancel={handlePayPalCancel}
                />
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setStep("form")}
              disabled={isProcessingPayment}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to booking details
            </Button>
          </div>
        )}

        {/* Step 3: Error Recovery (payment captured, booking creation failed) */}
        {step === "error" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-destructive">Payment received, but booking failed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your payment was successfully captured by PayPal, but we encountered an error creating your booking record.
                    <strong> You have NOT been charged twice.</strong>
                  </p>
                </div>
              </div>

              {paymentRef && (
                <div className="rounded-lg bg-muted p-3 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">PayPal Reference ID</p>
                  <p className="font-mono text-sm font-medium break-all select-all">{paymentRef}</p>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Please contact us with this reference ID and we will manually confirm your booking within 24 hours.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={() => {
                  const msg = `Hi, I paid via PayPal (Ref: ${paymentRef}) for ${program.title} but my booking was not confirmed. Please help.`;
                  window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201030354067'}?text=${encodeURIComponent(msg)}`, '_blank');
                }}
              >
                <Phone className="w-4 h-4 mr-2" /> Contact Us on WhatsApp
              </Button>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const PriceSummary = ({
  pricePerPerson,
  numberOfTravelers,
  totalAmount,
}: {
  pricePerPerson: number;
  numberOfTravelers: number;
  totalAmount: number;
}) => (
  <div className="border-t pt-4 space-y-2">
    <div className="flex justify-between text-sm">
      <span>Price per person:</span>
      <span>${pricePerPerson.toFixed(2)}</span>
    </div>
    <div className="flex justify-between text-sm">
      <span>Number of travelers:</span>
      <span>{numberOfTravelers}</span>
    </div>
    <div className="flex justify-between text-lg font-bold">
      <span>Total Amount:</span>
      <span className="text-primary">${totalAmount.toFixed(2)}</span>
    </div>
    <p className="text-xs text-muted-foreground pt-1">
      Choose your payment method in the next step: pay 100% online or 30% online + 70% on arrival.
    </p>
  </div>
);
