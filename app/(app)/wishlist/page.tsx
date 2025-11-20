"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Star, Clock, Filter, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getProgramImageUrl } from "@/lib/utils"

interface Media {
  id: number
  name: string
  url: string
  formats?: {
    thumbnail?: { url: string }
    small?: { url: string }
    medium?: { url: string }
    large?: { url: string }
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

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "rating">("rating")
  const [removingId, setRemovingId] = useState<number | null>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view your wishlist")
      router.push("/login")
    }
  }, [user, authLoading, router])

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
      setWishlistItems(data.data || [])
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast.error("Failed to load wishlist")
    } finally {
      setLoading(false)
    }
  }, [user?.token])

  // Remove from wishlist
  const removeFromWishlist = async (programId: number) => {
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

  // Extract categories from wishlist items
  const categories = [...new Set(wishlistItems.map((item) => item.program.descraption || "General"))]

  // Filter items
  let filteredItems = filterCategory
    ? wishlistItems.filter((item) => item.program.descraption === filterCategory)
    : wishlistItems

  // Sort items
  filteredItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.program.price - b.program.price
    }
    if (sortBy === "price-high") {
      return b.program.price - a.program.price
    }
    return b.program.rating - a.program.rating
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
              <p className="text-muted-foreground mt-1">
                {wishlistItems.length} items saved • {filterCategory ? filterCategory : "All destinations"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {wishlistItems.length > 0 && (
          <>
            {/* Filters & Sort */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="md:col-span-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterCategory === null ? "default" : "outline"}
                    onClick={() => setFilterCategory(null)}
                    className="rounded-full"
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={filterCategory === category ? "default" : "outline"}
                      onClick={() => setFilterCategory(category)}
                      className="rounded-full"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "price-low" | "price-high" | "rating")}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Wishlist Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="border border-border bg-card overflow-hidden hover:border-accent/50 transition-all shadow-sm hover:shadow-lg group"
              >
                <div className="relative h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <Image
                    src={getProgramImageUrl(item.program, 0, "/placeholder.svg?height=192&width=400")}
                    alt={item.program.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                    {item.program.descraption || "Adventure"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWishlist(item.program.id)}
                    disabled={removingId === item.program.id}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white dark:bg-slate-800/90 hover:dark:bg-slate-800 rounded-full p-2 h-10 w-10"
                  >
                    {removingId === item.program.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                    ) : (
                      <Heart className="w-5 h-5 fill-red-500 text-red-500 transition-colors" />
                    )}
                  </Button>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{item.program.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-accent" />
                    <CardDescription className="text-sm">{item.program.Location}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-semibold">{item.program.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {item.program.duration} Days
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <p className="text-2xl font-bold text-accent">${item.program.price}</p>
                    </div>
                    <Link href={`/programs/${item.program.documentId}`}>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {wishlistItems.length === 0 ? "Your wishlist is empty" : "No items found"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {wishlistItems.length === 0
                ? "Start adding your favorite programs to your wishlist"
                : "Try adjusting your filters"}
            </p>
            {wishlistItems.length === 0 && (
              <Link href="/programs">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Browse Programs
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}