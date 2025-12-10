"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchInvoiceById } from "@/fetch/invoices";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Users, Clock, Phone, Globe, Download, ArrowLeft } from "lucide-react";
import Image from "next/image";
import mainLogo from "@/public/mainLogo.png";
import logo from "@/public/logo.png";
import { Button } from "@/components/ui/button";
import { downloadInvoicePDF } from "@/lib/pdf-generator";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const invoiceId = resolvedParams.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => fetchInvoiceById(invoiceId),
    enabled: !!invoiceId,
  });

  const handleDownloadPDF = async () => {
    if (!data?.data) return;

    try {
      const invoice = data.data;
      await downloadInvoicePDF(
        {
          invoiceNumber: invoice.invoiceNumber,
          customerName: invoice.customerName,
          customerEmail: invoice.customerEmail,
          customerPhone: invoice.customerPhone,
          tripName: invoice.tripName,
          tripDate: invoice.tripDate,
          tripDuration: invoice.tripDuration,
          numberOfTravelers: invoice.numberOfTravelers,
          pricePerPerson: invoice.pricePerPerson,
          totalAmount: invoice.totalAmount,
          bookingDate: invoice.createdAt,
        },
        `invoice-${invoice.invoiceNumber}.pdf`
      );
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Error loading invoice. Please try again.
            </p>
            <Button className="w-full mt-4" asChild>
              <Link href="/me">Back to Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Invoice not found</p>
            <Button className="w-full mt-4" asChild>
              <Link href="/me">Back to Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invoice = data.data;

  // Create itinerary from trip name (you can enhance this based on your data)
  const itinerary = [
    "Visit to " + invoice.tripName,
    "Professional guided tour",
    "Transportation included",
    "All entrance fees covered"
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" asChild>
            <Link href="/me" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
          </Button>
          <Button onClick={handleDownloadPDF} className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>

        {/* Invoice Card - Exact EgyptInvoice Style */}
        <Card className="w-full max-w-4xl mx-auto bg-muted border-primary overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground py-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Image
                src={logo}
                alt="Egyptian Hieroglyphs"
                fill
          sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 400px"
                className="object-cover"
              />
            </div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-display mb-2">Egypt Tourism Invoice</CardTitle>
                <p className="text-lg font-serif !text-muted">Journey through the Land of Pharaohs</p>
              </div>
              <Image
                src={mainLogo}
                alt="Egypt Tourism Logo"
                width={80}
                height={80}
                className="rounded-full border-2 border-primary-foreground"
              />
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-display mb-4 text-primary">{invoice.tripName}</h2>
                <p className="font-serif mb-4 text-muted-foreground">
                  Experience the wonders of Egypt with our carefully curated tour package.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2 text-primary" />
                    <span>
                      {new Date(invoice.tripDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span>{invoice.tripDuration} Days</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    <span>{invoice.numberOfTravelers} Travelers</span>
                  </div>
                </div>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="text-xl font-display mb-3 text-primary">Customer Details</h3>
                <div className="space-y-2 font-serif">
                  <p>
                    <strong>Name:</strong> {invoice.customerName}
                  </p>
                  <p>
                    <strong>Nationality:</strong> International Traveler
                  </p>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-primary" />
                    <span>{invoice.customerPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-primary/30" />

            <div className="mb-6">
              <h3 className="text-xl font-display mb-3 text-primary">Itinerary Highlights</h3>
              <ul className="list-disc list-inside space-y-1 font-serif">
                {itinerary.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg mb-6">
              <h3 className="text-xl font-display mb-3 text-primary">Payment Details</h3>
              <div className="grid grid-cols-2 gap-4 font-serif">
                <div>
                  <strong>Total Price:</strong>
                </div>
                <div className="text-right">${invoice.totalAmount.toFixed(2)}</div>
                <div>
                  <strong>Transaction Number:</strong>
                </div>
                <div className="text-right">{invoice.invoiceNumber}</div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground font-serif">
              <p>Thank you for choosing Egypt Tourism for your adventure!</p>
              <p>For any inquiries, please contact us at:</p>
              <div className="flex justify-center items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  <span>www.zoeholiday.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  <span>+20 123 456 7890</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-8 bg-primary" />
        </Card>
      </div>
    </div>
  );
}
