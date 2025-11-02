"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, ArrowRight } from "lucide-react"

export default function TripsSection() {
  const trips = [
    {
      id: 1,
      title: "Luxor & Aswan Nile Cruise",
      destination: "Luxor, Aswan",
      date: "Dec 15-22, 2024",
      duration: "7 Days",
      status: "Upcoming",
      price: "$2,499",
      travelers: 2,
      image: "/luxor-temple-nile-cruise.jpg",
    },
    {
      id: 2,
      title: "Cairo Historical Tour",
      destination: "Cairo",
      date: "Nov 20-23, 2024",
      duration: "3 Days",
      status: "Completed",
      price: "$899",
      travelers: 1,
      image: "/cairo-pyramids-giza.jpg",
    },
    {
      id: 3,
      title: "Red Sea Beach Resort",
      destination: "Hurghada",
      date: "Jan 5-12, 2025",
      duration: "7 Days",
      status: "Confirmed",
      price: "$1,799",
      travelers: 4,
      image: "/red-sea-beach-resort.jpg",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "Upcoming":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
    }
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <Card
          key={trip.id}
          className="border border-border bg-card overflow-hidden hover:border-amber-500/30 transition-all shadow-sm hover:shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            <div className="md:col-span-1 h-48 md:h-auto relative bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <img src={trip.image || "/placeholder.svg"} alt={trip.title} className="w-full h-full object-cover" />
            </div>
            <div className="md:col-span-3">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{trip.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <MapPin className="w-4 h-4" />
                      {trip.destination}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Date</p>
                    <p className="text-foreground font-semibold flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      {trip.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Duration</p>
                    <p className="text-foreground font-semibold mt-1">{trip.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Travelers</p>
                    <p className="text-foreground font-semibold flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-amber-500" />
                      {trip.travelers}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Price</p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-500 mt-1">{trip.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-amber-600 hover:bg-amber-700 gap-2" size="sm">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  {trip.status === "Upcoming" && (
                    <Button variant="outline" size="sm">
                      Modify
                    </Button>
                  )}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
