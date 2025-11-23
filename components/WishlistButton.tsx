"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

interface WishlistButtonProps {
  programId: number
  className?: string
}

export default function WishlistButton({ programId, className = "" }: WishlistButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [inWishlist, setInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  // Check if program is in wishlist
  const checkWishlist = useCallback(async () => {
    try {
      if (!user?.token) {
        setChecking(false)
        return
      }

      const response = await fetch(`${API_URL}/api/wishlists/check/${programId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInWishlist(data.inWishlist)
      } else {
        console.error("Failed to check wishlist:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Error checking wishlist:", error)
    } finally {
      setChecking(false)
    }
  }, [user?.token, programId])

  // Toggle wishlist
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // If not logged in, redirect to login
    if (!user?.token) {
      toast.error("Please login to add items to wishlist")
      router.push("/login")
      return
    }

    try {
      setLoading(true)

      if (inWishlist) {
        // Remove from wishlist
        const response = await fetch(`${API_URL}/api/wishlists/remove/${programId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (response.ok) {
          setInWishlist(false)
          toast.success("Removed from wishlist")
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error("Remove failed:", response.status, errorData)
          throw new Error(errorData.error?.message || "Failed to remove from wishlist")
        }
      } else {
        // Add to wishlist
        console.log("Adding to wishlist, programId:", programId)
        const response = await fetch(`${API_URL}/api/wishlists/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ programId }),
        })

        const responseData = await response.json()
        console.log("Add wishlist response:", response.status, responseData)

        if (response.ok) {
          setInWishlist(true)
          toast.success("Added to wishlist")
        } else {
          throw new Error(responseData.error?.message || responseData.message || "Failed to add to wishlist")
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update wishlist")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkWishlist()
  }, [checkWishlist])

  if (checking) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className={`rounded-full p-2 h-10 w-10 ${className}`}
      >
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleWishlist}
      disabled={loading}
      className={`rounded-full p-2 h-10 w-10 ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-red-500" />
      ) : (
        <Heart
          className={`w-5 h-5 transition-colors ${
            inWishlist ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-400"
          }`}
        />
      )}
    </Button>
  )
}