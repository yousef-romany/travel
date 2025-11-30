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
import { Loader2, ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { createBooking } from "@/fetch/bookings";
import { createInvoice } from "@/fetch/invoices";
import { generateInvoicePDF, downloadInvoicePDF } from "@/lib/pdf-generator";
import { uploadFileToStrapi } from "@/lib/upload-file";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PaymentComingSoonBanner from "@/components/payment-coming-soon-banner";

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

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201555100961";

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
  program: BookingDialogProps["program"]
): string => {
  const totalAmount = program.price * formData.numberOfTravelers;

  return `🎉 *New Booking Request*

📋 *Booking Details:*
• Tour: ${program.title}
• Customer: ${formData.fullName}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Number of Travelers: ${formData.numberOfTravelers}
• Travel Date: ${formData.travelDate ? format(formData.travelDate, "PPP") : "Not specified"}
• Total Amount: $${totalAmount.toFixed(2)}

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

  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });

      try {
        const { createData, pdfData } = generateInvoiceData(
          formData,
          program,
          data.data.documentId,
          user?.documentId
        );

        // Generate PDF blob
        const pdfBlob = await generateInvoicePDF(pdfData);

        // Upload PDF to Strapi and get URL
        let pdfUrl: string | undefined;
        try {
          pdfUrl = await uploadFileToStrapi(
            pdfBlob,
            `invoice-${createData.invoiceNumber}.pdf`
          );
          console.log("PDF uploaded successfully:", pdfUrl);
        } catch (uploadError) {
          console.error("PDF upload failed:", uploadError);
          // Continue without PDF URL if upload fails
        }

        // Create invoice with PDF URL
        await createInvoice({
          ...createData,
          pdfUrl,
        });

        // Download PDF for user
        await downloadInvoicePDF(pdfData, `invoice-${createData.invoiceNumber}.pdf`);

        const whatsAppMessage = generateWhatsAppMessage(formData, program);
        openWhatsApp(whatsAppMessage);

        toast.success("Booking submitted successfully! Invoice PDF downloaded.");
      } catch (error) {
        console.error("Invoice generation error:", error);
        toast.error("Booking created but invoice generation failed.");
      }

      onClose();
      resetForm();
    },
    onError: (error: any) => {
      console.error("Booking error:", error);

      let errorMessage = "Failed to submit booking. Please try again.";

      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. Please make sure you're logged in.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid booking data. Please check all fields.";
      }

      toast.error(errorMessage);
    },
  });

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateFormData(formData, user);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    createBookingMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      numberOfTravelers: formData.numberOfTravelers,
      travelDate: formData.travelDate!.toISOString(),
      specialRequests: formData.specialRequests,
      programId: program.documentId,
      userId: user!.documentId,
      totalAmount: totalAmount,
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

  const handleDateSelect = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, travelDate: date }));
    if (date) {
      setIsCalendarOpen(false);
    }
  };

  const totalAmount = program.price * formData.numberOfTravelers;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Your Tour</DialogTitle>
          <DialogDescription>
            Complete the form below to book <strong>{program.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <PaymentComingSoonBanner />

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
              rows={4}
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
              disabled={createBookingMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createBookingMutation.isPending}>
              {createBookingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </DialogFooter>
        </form>
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
  </div>
);
