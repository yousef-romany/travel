"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Star, Clock, Filter, ArrowLeft, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getProgramImageUrl } from "@/lib/utils"
import { trackWishlistAction } from "@/lib/analytics"

// Helper function to get stagger delay class
const getStaggerDelay = (index: number): string => {
  const delay = Math.min(index * 100, 800);
  const delayClasses = {
    0: "animate-delay-0",
    100: "animate-delay-100",
    200: "animate-delay-200",
    300: "animate-delay-300",
    400: "animate-delay-400",
    500: "animate-delay-500",
    600: "animate-delay-600",
    700: "animate-delay-700",
    800: "animate-delay-800",
  } as const;
  return delayClasses[delay as keyof typeof delayClasses] || "animate-delay-0";
};

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

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

export default function WishlistPageContent() {
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

      // Update local state (all items have valid programs from state filter)
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

  // Extract categories from wishlist items (all items already have valid programs from state filter)
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
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[150px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent rounded-full blur-[150px]"></div>
      </div>

      {/* Header Section */}
      <div className="relative border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center gap-4 mb-4 animate-slide-up">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-6 h-6 text-primary fill-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Wishlist</h1>
              </div>
              <p className="text-muted-foreground">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'program' : 'programs'} saved
                {filterCategory && ` • ${filterCategory}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {wishlistItems.length > 0 && (
          <>
            {/* Filters & Sort */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up animate-delay-200">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Filter by Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterCategory === null ? "default" : "outline"}
                    onClick={() => setFilterCategory(null)}
                    size="sm"
                    className="rounded-full transition-smooth"
                  >
                    All ({wishlistItems.length})
                  </Button>
                  {categories.map((category) => {
                    const count = wishlistItems.filter((item) => item.program.descraption === category).length
                    return (
                      <Button
                        key={category}
                        variant={filterCategory === category ? "default" : "outline"}
                        onClick={() => setFilterCategory(category)}
                        size="sm"
                        className="rounded-full transition-smooth"
                      >
                        {category} ({count})
                      </Button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "price-low" | "price-high" | "rating")}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-smooth"
                >
                  <option value="rating">Highest Rated</option>
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
            {filteredItems.map((item, index) => (
              <Card
                key={item.id}
                className={`border border-border bg-card overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-xl group relative hover-lift animate-on-scroll ${getStaggerDelay(index)}`}
              >
                {/* Featured Badge */}
                {item.program.rating >= 4.8 && (
                  <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Top Rated
                  </div>
                )}

                <div className="relative h-56 bg-muted overflow-hidden">
                  <Image
                    src={getProgramImageUrl(item.program, 0, "/placeholder.svg?height=224&width=400")}
                    alt={`${item.program.title} - Egypt travel program`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500 hover-scale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {item.program.descraption && (
                    <Badge className="absolute bottom-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-sm">
                      {item.program.descraption}
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWishlist(item.program.id, item.program.title)}
                    disabled={removingId === item.program.id}
                    className="absolute top-3 right-3 bg-white/95 hover:bg-white dark:bg-slate-900/95 hover:dark:bg-slate-900 rounded-full p-2 h-10 w-10 shadow-lg z-10"
                  >
                    {removingId === item.program.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                    ) : (
                      <Heart className="w-5 h-5 fill-red-500 text-red-500 transition-transform hover:scale-110" />
                    )}
                  </Button>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {item.program.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <CardDescription className="text-sm truncate">{item.program.Location}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-lg">{item.program.rating}</span>
                      <span className="text-sm text-muted-foreground">/5</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.program.duration} Days</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">From</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-primary">${item.program.price}</span>
                        <span className="text-sm text-muted-foreground">/person</span>
                      </div>
                    </div>
                    <Link href={`/programs/${item.program.documentId}`} className="block">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth shadow-md hover:shadow-lg hover-glow">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="relative inline-block mb-6">
              <Heart className="w-20 h-20 text-muted-foreground mx-auto opacity-20" />
              <div className="absolute inset-0 animate-ping">
                <Heart className="w-20 h-20 text-muted-foreground mx-auto opacity-10" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {wishlistItems.length === 0 ? "Your wishlist is empty" : "No items match your filters"}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {wishlistItems.length === 0
                ? "Start adding your favorite Egypt travel programs to create your dream itinerary"
                : "Try adjusting your filters to see more programs"}
            </p>
            {wishlistItems.length === 0 && (
              <Link href="/programs">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover-glow">
                  <Heart className="w-5 h-5 mr-2" />
                  Browse Programs
                </Button>
              </Link>
            )}
            {wishlistItems.length > 0 && filteredItems.length === 0 && (
              <Button
                variant="outline"
                onClick={() => setFilterCategory(null)}
                className="shadow-sm transition-smooth"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
