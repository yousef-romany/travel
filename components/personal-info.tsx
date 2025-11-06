"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, TrendingUp, Plane, Heart, Calendar } from "lucide-react"

export default function PersonalInfo() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/login"
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          localStorage.removeItem("token")
          window.location.href = "/login"
          return
        }

        const data = await res.json()
        setUser(data)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [])

  if (!user) {
    return <p className="text-center text-white py-10">Loading your profile...</p>
  }

  const stats = [
    { label: "Total Trips", value: user.totalTrips || "0", icon: Plane, color: "text-blue-500" },
    { label: "Total Spent", value: user.totalSpent ? `$${user.totalSpent}` : "$0", icon: TrendingUp, color: "text-green-500" },
    { label: "Wishlist Items", value: user.wishlistCount || "0", icon: Heart, color: "text-rose-500" },
    { label: "Member Since", value: user.createdAt?.slice(0, 4) || "—", icon: Calendar, color: "text-amber-500" },
  ]

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.label} className="border border-border bg-card hover:border-amber-500/50 transition-all shadow-sm hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} opacity-60`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Personal Information */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your profile details</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Full Name", value: user.username },
              { label: "Email Address", value: user.email },
              { label: "Phone Number", value: user.phone || "Not provided" },
              { label: "Date of Birth", value: user.birthDate || "Not provided" },
              { label: "Address", value: user.address || "Not provided" },
              { label: "Membership Level", value: user.role?.name || "Standard" },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {field.label}
                </label>

                {field.label === "Membership Level" ? (
                  <div className="mt-2">
                    <Badge className="bg-amber-600 hover:bg-amber-700">{field.value}</Badge>
                  </div>
                ) : (
                  <p className="text-base font-medium text-foreground mt-2">
                    {field.value}
                  </p>
                )}
              </div>
            ))}

          </div>

        </CardContent>
      </Card>

    </div>
  )
}
