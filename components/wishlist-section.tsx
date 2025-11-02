"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Star, Clock } from "lucide-react"
import { useState } from "react"

export default function WishlistSection() {
  const wishlist = [
    {
      id: 1,
      title: "Abu Simbel Temple Adventure",
      location: "Abu Simbel, Aswan",
      price: "$1,899",
      duration: "4 Days",
      rating: 4.9,
      reviews: 342,
      difficulty: "Moderate",
      image: "/abu-simbel-temple.jpg",
    },
    {
      id: 2,
      title: "Sinai Desert Safari",
      location: "Mount Sinai, Sharm El-Sheikh",
      price: "$1,499",
      duration: "3 Days",
      rating: 4.8,
      reviews: 287,
      difficulty: "Challenging",
      image: "/mount-sinai-desert-safari.jpg",
    },
    {
      id: 3,
      title: "Nile Delta Photography Tour",
      location: "Nile Delta",
      price: "$1,299",
      duration: "2 Days",
      rating: 4.7,
      reviews: 156,
      difficulty: "Easy",
      image: "/nile-delta-landscape.jpg",
    },
    {
      id: 4,
      title: "Oasis & Desert Expedition",
      location: "Siwa & White Desert",
      price: "$2,199",
      duration: "5 Days",
      rating: 5.0,
      reviews: 198,
      difficulty: "Moderate",
      image: "/white-desert-oasis.jpg",
    },
  ]

  const [liked, setLiked] = useState<number[]>([])

  const toggleLike = (id: number) => {
    setLiked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wishlist.map((item) => (
          <Card
            key={item.id}
            className="border border-border bg-card overflow-hidden hover:border-amber-500/30 transition-all shadow-sm hover:shadow-lg group"
          >
            <div className="relative h-40 bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLike(item.id)}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white dark:bg-slate-800/90 hover:dark:bg-slate-800 rounded-full p-2 h-10 w-10"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    liked.includes(item.id) ? "fill-red-500 text-red-500" : "text-slate-400"
                  }`}
                />
              </Button>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base line-clamp-2">{item.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <CardDescription className="text-xs">{item.location}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">{item.rating}</span>
                  <span className="text-xs text-muted-foreground">({item.reviews})</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.duration}
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.difficulty}
                </Badge>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-lg font-bold text-amber-600 dark:text-amber-500 mb-2">{item.price}</p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">Book Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
