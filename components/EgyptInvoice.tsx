"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users, Clock, Phone, Globe, Download, Eye, Loader2 } from "lucide-react"
import { generateInvoicePDF, downloadInvoicePDF, type InvoiceData } from "@/lib/pdf-generator"
import { toast } from "sonner"
import mainLogo from "@/public/mainLogo.png";
import logo from "@/public/logo.png";

interface InvoiceProps {
  tripName: string
  tripDescription: string
  price: number
  numberOfTravelers: number
  customerName: string
  customerNationality: string
  customerPhone: string
  customerEmail?: string
  transactionNumber: string
  tripDate: string
  tripDuration: string
  itinerary: string[]
}

export const EgyptInvoice: React.FC<InvoiceProps> = ({
  tripName,
  tripDescription,
  price,
  numberOfTravelers,
  customerName,
  customerNationality,
  customerPhone,
  customerEmail,
  transactionNumber,
  tripDate,
  tripDuration,
  itinerary,
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)

  const invoiceData: InvoiceData = {
    invoiceNumber: transactionNumber,
    customerName,
    customerEmail: customerEmail || "N/A",
    customerPhone,
    tripName,
    tripDate,
    tripDuration: parseInt(tripDuration) || 1,
    numberOfTravelers,
    pricePerPerson: price,
    totalAmount: price * numberOfTravelers,
    bookingDate: new Date().toISOString(),
  }

  const handlePreviewPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const pdfBlob = await generateInvoicePDF(invoiceData)
      const url = URL.createObjectURL(pdfBlob)
      setPdfPreviewUrl(url)
      toast.success("PDF preview generated successfully!")
    } catch (error) {
      console.error("Error generating PDF preview:", error)
      toast.error("Failed to generate PDF preview")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await downloadInvoicePDF(invoiceData, `invoice-${transactionNumber}.pdf`)
      toast.success("Invoice PDF downloaded successfully!")
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast.error("Failed to download PDF")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-6">
    <Card className="w-full max-w-4xl mx-auto my-8 bg-muted border-primary overflow-hidden">
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
            <h2 className="text-2xl font-display mb-4 text-primary">{tripName}</h2>
            <p className="font-serif mb-4 text-muted-foreground">{tripDescription}</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-primary" />
                <span>{tripDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                <span>{tripDuration}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                <span>{numberOfTravelers} Travelers</span>
              </div>
            </div>
          </div>
          <div className="bg-secondary/30 p-4 rounded-lg">
            <h3 className="text-xl font-display mb-3 text-primary">Customer Details</h3>
            <div className="space-y-2 font-serif">
              <p>
                <strong>Name:</strong> {customerName}
              </p>
              <p>
                <strong>Nationality:</strong> {customerNationality}
              </p>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary" />
                <span>{customerPhone}</span>
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
            <div className="text-right">${price.toFixed(2)}</div>
            <div>
              <strong>Transaction Number:</strong>
            </div>
            <div className="text-right">{transactionNumber}</div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground font-serif">
          <p>Thank you for choosing Egypt Tourism for your adventure!</p>
          <p>For any inquiries, please contact us at:</p>
          <div className="flex justify-center items-center mt-2 space-x-4">
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              <span>www.egypttourism.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              <span>+20 123 456 7890</span>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-primary/30" />

        {/* PDF Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handlePreviewPDF}
            disabled={isGeneratingPDF}
            variant="outline"
            className="w-full sm:w-auto gap-2"
          >
            {isGeneratingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            Preview PDF
          </Button>
          <Button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90"
          >
            {isGeneratingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Invoice PDF
          </Button>
        </div>
      </CardContent>
      <div className="h-8 bg-primary" />
    </Card>

    {/* PDF Preview */}
    {pdfPreviewUrl && (
      <Card className="w-full max-w-4xl mx-auto bg-muted border-primary">
        <CardHeader>
          <CardTitle className="text-center">PDF Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] border border-primary/20 rounded-lg overflow-hidden">
            <iframe
              src={pdfPreviewUrl}
              className="w-full h-full"
              title="Invoice PDF Preview"
            />
          </div>
        </CardContent>
      </Card>
    )}
    </div>
  )
}

