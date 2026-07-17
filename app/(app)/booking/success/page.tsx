"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Download, Loader2, MapPin, Calendar, Users, AlertCircle, ShieldAlert } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchBookingById } from "@/fetch/bookings";
import { fetchInvoiceByBookingId } from "@/fetch/invoices";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/utils";

// ✅ PAY-06: Simple toast state component instead of alert()
function ToastMessage({ message, type }: { message: string; type: "error" | "info" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 ${
        type === "error"
          ? "bg-destructive text-destructive-foreground"
          : "bg-primary text-primary-foreground"
      }`}
    >
      {message}
    </div>
  );
}

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const { user } = useAuth();

  // Fetch booking details — populate user for ownership check
  const {
    data: bookingData,
    isLoading: bookingLoading,
    error: bookingError,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBookingById(bookingId!, user?.token),
    enabled: !!bookingId,
    retry: 1,
  });

  // Fetch invoice details
  const { data: invoiceData, isLoading: invoiceLoading } = useQuery({
    queryKey: ["invoice", bookingId],
    queryFn: () => fetchInvoiceByBookingId(bookingId!, user?.token),
    enabled: !!bookingId,
    retry: 1,
  });

  const booking = bookingData?.data;
  const invoice = invoiceData?.data;

  // ✅ PAY-03: Ownership check — redirect if booking belongs to a different user
  useEffect(() => {
    if (booking && user) {
      const bookingUserId = (booking as any).user?.id;
      if (bookingUserId && bookingUserId !== user.id) {
        router.replace("/");
      }
    }
  }, [booking, user, router]);

  // Confetti — only if booking is confirmed
  useEffect(() => {
    if (booking && !bookingLoading && booking.bookingStatus === "confirmed") {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: ReturnType<typeof setInterval> = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [booking, bookingLoading]);

  const handleDownloadInvoice = () => {
    if (invoice?.pdfUrl) {
      const url = getImageUrl(invoice.pdfUrl);
      window.open(url, "_blank");
    }
    // ✅ PAY-06: No alert() — the button is disabled when pdfUrl is missing
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Invalid booking reference.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (bookingLoading || invoiceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Retrieving your booking details...</p>
        </div>
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive/20">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle>Booking Not Found</CardTitle>
            <p className="text-muted-foreground mt-2">
              We couldn&apos;t find the details for this booking.
            </p>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ✅ PAY-03: Soft guard while ownership check runs
  const bookingUserId = (booking as any).user?.id;
  if (user && bookingUserId && bookingUserId !== user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive/20">
          <CardHeader className="text-center">
            <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <p className="text-muted-foreground mt-2">
              You don&apos;t have permission to view this booking.
            </p>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const title =
    booking.program?.title ||
    booking.plan_trip?.tripName ||
    booking.event?.title ||
    booking.customTripName ||
    "Trip";
  const imageUrl = booking.program?.images?.[0]
    ? getImageUrl(booking.program.images[0])
    : booking.event?.featuredImage
    ? getImageUrl(booking.event.featuredImage)
    : null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  // ✅ PAY-05: Use finalPrice if available, fall back to totalAmount
  const amountPaid = booking.finalPrice ?? booking.totalAmount;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden py-12">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-lg border-primary/20 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 animate-in zoom-in delay-200 duration-500">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" strokeWidth={3} />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            Booking Confirmed!
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Thank you for booking with Zoe Holidays. Your adventure awaits!
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Trip Snapshot */}
          <div className="flex gap-4 items-center bg-card border rounded-lg p-3">
            {imageUrl ? (
              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <Image src={imageUrl} alt={title} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                <MapPin className="w-8 h-8 text-muted-foreground/50" />
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-semibold truncate">{title}</h4>
              <div className="flex items-center text-xs text-muted-foreground gap-2">
                <Calendar className="w-3 h-3" />
                {format(new Date(booking.travelDate), "PPP")}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border/50">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Booking Summary
            </h3>

            <div className="text-sm font-medium text-muted-foreground mb-4 flex justify-between items-center">
              <span>Reference ID:</span>
              <span className="text-foreground tracking-wider font-mono bg-background px-2 py-1 rounded border opacity-80">
                {booking.id}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    booking.bookingStatus === "confirmed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : booking.bookingStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Travelers</span>
                <span className="font-medium flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {booking.numberOfTravelers} Person{booking.numberOfTravelers !== 1 ? "s" : ""}
                </span>
              </div>

              <Separator className="my-2" />

              {/* ✅ PAY-05: Only show "Total Paid" label when confirmed */}
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold">
                  {booking.bookingStatus === "confirmed" ? "Total Paid" : "Total Amount"}
                </span>
                <span className="font-bold text-primary text-lg">{formatPrice(amountPaid)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-sm text-blue-800 dark:text-blue-300">
            A confirmation email has been sent to <strong>{booking.email}</strong>.
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* ✅ PAY-06: Button disabled when no PDF — no alert() needed */}
          <Button
            variant="outline"
            className="w-full gap-2 border-primary/20 hover:bg-primary/5"
            onClick={handleDownloadInvoice}
            disabled={!invoice?.pdfUrl}
            title={!invoice?.pdfUrl ? "Invoice PDF is being generated, check your email." : undefined}
          >
            <Download className="w-4 h-4" />
            {invoice?.pdfUrl ? "Download Invoice" : "Invoice Pending..."}
          </Button>
          <Button className="w-full bg-gradient-to-r from-primary to-amber-600 gap-2" asChild>
            <Link href="/me?tab=bookings">
              <Users className="w-4 h-4" />
              My Bookings
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
