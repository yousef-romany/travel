"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function InvoicesSection() {
  const invoices = [
    {
      id: "INV-2024-001",
      date: "Nov 15, 2024",
      trip: "Cairo Historical Tour",
      amount: "$899",
      status: "Paid",
      dueDate: "Nov 20, 2024",
    },
    {
      id: "INV-2024-002",
      date: "Oct 20, 2024",
      trip: "Giza Plateau & Museum",
      amount: "$1,299",
      status: "Paid",
      dueDate: "Oct 25, 2024",
    },
    {
      id: "INV-2024-003",
      date: "Dec 1, 2024",
      trip: "Luxor & Aswan Nile Cruise",
      amount: "$2,499",
      status: "Pending",
      dueDate: "Dec 15, 2024",
    },
    {
      id: "INV-2024-004",
      date: "Sep 10, 2024",
      trip: "Alexandria City Tour",
      amount: "$749",
      status: "Paid",
      dueDate: "Sep 15, 2024",
    },
  ]

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
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50 border-b border-border">
                    <TableCell className="font-semibold text-foreground">{invoice.id}</TableCell>
                    <TableCell className="text-foreground">{invoice.trip}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                    <TableCell className="font-semibold text-foreground">{invoice.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                        }
                      >
                        {invoice.status}
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-100">Total Invoices</p>
              <p className="text-3xl font-bold text-white mt-2">$5,446</p>
              <p className="text-sm text-amber-100 mt-2">$2,499 pending payment</p>
            </div>
            <Button className="bg-white text-amber-700 hover:bg-amber-50 font-semibold">Pay Outstanding</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
