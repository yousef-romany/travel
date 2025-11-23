"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { fetchUserBookings } from "@/fetch/bookings"
import Loading from "@/components/Loading"

export default function InvoicesSection() {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ["userBookings", user?.documentId],
    queryFn: () => fetchUserBookings(user?.documentId),
    enabled: !!user?.documentId,
  })

  if (isLoading) return <Loading />
  if (error) return <p>Error loading invoices: {(error as Error).message}</p>

  const bookings = data?.data || []

  // Calculate totals
  const totalAmount = bookings.reduce(
    (sum, booking) => sum + (booking.totalAmount || 0),
    0
  )
  const pendingAmount = bookings
    .filter((booking) => booking.status === "pending")
    .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadgeClass = (status: string) => {
    if (status === "confirmed") {
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    } else if (status === "pending") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
    } else {
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
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
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No bookings found. Start by booking a tour!
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-muted/50 border-b border-border">
                      <TableCell className="font-semibold text-foreground">
                        INV-{booking.id}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {booking.program?.title || "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(booking.createdAt)}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ${booking.totalAmount?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(booking.travelDate)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" className="gap-2 h-8">
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2 h-8">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
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

      {bookings.length > 0 && (
        <Card className="border border-border bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-100">Total Bookings</p>
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
