"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { fetchUserInvoices } from "@/fetch/invoices"
import { downloadInvoicePDF } from "@/lib/pdf-generator"
import Loading from "@/components/Loading"
import { toast } from "sonner"
import { useState } from "react"

export default function InvoicesSection() {
  const { user } = useAuth()
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<number | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ["userInvoices", user?.documentId],
    queryFn: () => fetchUserInvoices(user?.documentId),
    enabled: !!user?.documentId,
  })

  if (isLoading) return <Loading />
  if (error) return <p>Error loading invoices: {(error as Error).message}</p>

  const invoices = data?.data || []

  // Calculate totals
  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + (invoice.totalAmount || 0),
    0
  )
  const pendingAmount = invoices
    .filter((invoice) => invoice.status === "pending")
    .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadgeClass = (status: string) => {
    if (status === "paid") {
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    } else if (status === "pending") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
    } else {
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    }
  }

  const handleViewInvoice = (invoiceDocumentId: string) => {
    // Open invoice in new tab using documentId
    window.open(`/invoices/${invoiceDocumentId}`, "_blank")
  }

  const handleDownloadInvoice = async (invoice: any) => {
    try {
      setDownloadingInvoiceId(invoice.id)

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
      )

      toast.success("Invoice downloaded successfully!")
    } catch (error) {
      console.error("Error downloading invoice:", error)
      toast.error("Failed to download invoice")
    } finally {
      setDownloadingInvoiceId(null)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Trip Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No invoices found. Start by booking a tour!
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-muted/50 border-b border-border">
                      <TableCell className="font-semibold text-foreground">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {invoice.tripName || "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(invoice.createdAt)}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ${invoice.totalAmount?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(invoice.tripDate)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 h-8"
                            onClick={() => handleViewInvoice(invoice.documentId)}
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 h-8"
                            onClick={() => handleDownloadInvoice(invoice)}
                            disabled={downloadingInvoiceId === invoice.id}
                          >
                            {downloadingInvoiceId === invoice.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">
                              {downloadingInvoiceId === invoice.id ? "Downloading..." : "Download"}
                            </span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {invoices.length > 0 && (
        <Card className="border border-border bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-100">Total Invoices</p>
                <p className="text-3xl font-bold text-white mt-2">
                  ${totalAmount.toFixed(2)}
                </p>
                {pendingAmount > 0 && (
                  <p className="text-sm text-amber-100 mt-2">
                    ${pendingAmount.toFixed(2)} pending payment
                  </p>
                )}
              </div>
              {pendingAmount > 0 && (
                <Button className="bg-white text-amber-700 hover:bg-amber-50 font-semibold">
                  Pay Outstanding
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
