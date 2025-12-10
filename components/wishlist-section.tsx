"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Star, Clock, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { getProgramImageUrl } from "@/lib/utils"
import { trackWishlistAction } from "@/lib/analytics"

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.zoeholidays.com';

interface Media {
  id: number
  name: string
  url: string
  formats?: {
    thumbnail?: { url: string; width: number; height: number }
    small?: { url: string; width: number; height: number }
    medium?: { url: string; width: number; height: number }
    large?: { url: string; width: number; height: number }
  }
}

interface Program {
  id: number
  documentId: string
  title: string
  Location: string
  price: number
  duration: number
  rating: number
  descraption: string
  images?: Media[]
}

interface WishlistItem {
  id: number
  documentId: string
  program: Program
}

export default function WishlistSection() {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<number | null>(null)

  // Fetch user's wishlist
  const fetchWishlist = useCallback(async () => {
    if (!user?.token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/api/wishlists/me`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
      }

      const data = await response.json()
      // Filter out any items with null programs before setting state
      const validItems = (data.data || []).filter((item: WishlistItem) => item?.program)
      setWishlistItems(validItems)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast.error("Failed to load wishlist")
    } finally {
      setLoading(false)
    }
  }, [user?.token])

  // Remove from wishlist
  const removeFromWishlist = async (programId: number, programTitle: string) => {
    if (!user?.token) return

    try {
      setRemovingId(programId)

      const response = await fetch(`${API_URL}/api/wishlists/remove/${programId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist")
      }

      // Track analytics
      trackWishlistAction("remove", programTitle)

      // Update local state
      setWishlistItems((prev) => prev.filter((item) => item.program.id !== programId))
      toast.success("Removed from wishlist")
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove from wishlist")
    } finally {
      setRemovingId(null)
    }
  }

  useEffect(() => {
    if (user?.token) {
      fetchWishlist()
    }
  }, [user?.token, fetchWishlist])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-muted-foreground mb-6">
          Start adding your favorite Egypt travel programs
        </p>
        <Link href="/programs">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Browse Programs
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Wishlist</h2>
          <p className="text-muted-foreground mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'program' : 'programs'} saved
          </p>
        </div>
        <Link href="/wishlist">
          <Button variant="outline" className="gap-2">
            View All
            <ExternalLink className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wishlistItems.slice(0, 4).filter((item) => item?.program).map((item) => (
          <Card
            key={item.id}
            className="border border-border bg-card overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-lg group"
          >
            <div className="relative h-44 bg-muted overflow-hidden">
              <Image
                src={getProgramImageUrl(item.program, 0, "/placeholder.svg?height=176&width=320")}
                alt={`${item.program.title} - Egypt tour`}
                fill
          sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 400px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromWishlist(item.program.id, item.program.title)}
                disabled={removingId === item.program.id}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white dark:bg-slate-800/90 hover:dark:bg-slate-800 rounded-full p-2 h-9 w-9 z-10"
              >
                {removingId === item.program.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                ) : (
                  <Heart className="w-4 h-4 fill-red-500 text-red-500 transition-transform hover:scale-110" />
                )}
              </Button>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base line-clamp-2">{item.program.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-3 h-3 text-primary" />
                <CardDescription className="text-xs line-clamp-1">{item.program.Location}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">{item.program.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {item.program.duration}d
                </div>
              </div>

              <div className="pt-2 border-t border-border space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">From</span>
                  <span className="text-xl font-bold text-primary">${item.program.price}</span>
                </div>
                <Link href={`/programs/${item.program.documentId}`} className="block">
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show more if there are more than 4 items */}
      {wishlistItems.length > 4 && (
        <div className="text-center pt-4">
          <Link href="/wishlist">
            <Button variant="outline">
              View {wishlistItems.length - 4} More {wishlistItems.length - 4 === 1 ? 'Program' : 'Programs'}
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
