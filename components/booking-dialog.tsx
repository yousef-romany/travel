"use client";

import { useState } from "react";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createBooking } from "@/fetch/bookings";
import { createInvoice } from "@/fetch/invoices";
import { downloadInvoicePDF } from "@/lib/pdf-generator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

export default function BookingDialog({
  isOpen,
  onClose,
  program,
}: BookingDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: user?.profile?.name || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    numberOfTravelers: 1,
    travelDate: undefined as Date | undefined,
    specialRequests: "",
  });

  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: async (data) => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });

      try {
        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}-${data.data.id}`;
        const totalAmount = program.price * formData.numberOfTravelers;

        // Create invoice in database
        await createInvoice({
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
          totalAmount,
          userId: user?.documentId,
        });

        // Generate and download PDF
        await downloadInvoicePDF(
          {
            invoiceNumber,
            customerName: formData.fullName,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            tripName: program.title,
            tripDate: formData.travelDate!.toISOString(),
            tripDuration: program.duration,
            numberOfTravelers: formData.numberOfTravelers,
            pricePerPerson: program.price,
            totalAmount,
            bookingDate: new Date().toISOString(),
          },
          `invoice-${invoiceNumber}.pdf`
        );

        // Send WhatsApp message
        sendWhatsAppMessage();

        // Show success message
        toast.success("Booking submitted successfully! Invoice PDF downloaded.");
      } catch (error) {
        console.error("Invoice generation error:", error);
        toast.error("Booking created but invoice generation failed.");
      }

      // Close dialog and reset form
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error("Booking error:", error);
      toast.error("Failed to submit booking. Please try again.");
    },
  });

  const resetForm = () => {
    setFormData({
      fullName: user?.profile?.name || "",
      email: user?.email || "",
      phone: user?.profile?.phone || "",
      numberOfTravelers: 1,
      travelDate: undefined,
      specialRequests: "",
    });
  };

  const sendWhatsAppMessage = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201555100961";

    const message = `🎉 *New Booking Request*

📋 *Booking Details:*
• Tour: ${program.title}
• Customer: ${formData.fullName}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Number of Travelers: ${formData.numberOfTravelers}
• Travel Date: ${formData.travelDate ? format(formData.travelDate, "PPP") : "Not specified"}
• Total Amount: $${(program.price * formData.numberOfTravelers).toFixed(2)}

${formData.specialRequests ? `📝 *Special Requests:*\n${formData.specialRequests}\n` : ""}
Please confirm this booking as soon as possible.

Thank you! 🙏`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.travelDate) {
      toast.error("Please select a travel date");
      return;
    }

    // Check if user is logged in
    if (!user) {
      toast.error("Please log in to make a booking");
      return;
    }

    // Submit booking
    createBookingMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      numberOfTravelers: formData.numberOfTravelers,
      travelDate: formData.travelDate.toISOString(),
      specialRequests: formData.specialRequests,
      programId: program.documentId,
      userId: user.documentId,
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
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

          {/* Email */}
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

          {/* Phone */}
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

          {/* Number of Travelers */}
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

          {/* Travel Date */}
          <div className="space-y-2">
            <Label htmlFor="travelDate">
              Preferred Travel Date <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.travelDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.travelDate ? (
                    format(formData.travelDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.travelDate}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, travelDate: date }))
                  }
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Special Requests */}
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

          {/* Price Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Price per person:</span>
              <span>${program.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Number of travelers:</span>
              <span>{formData.numberOfTravelers}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

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
