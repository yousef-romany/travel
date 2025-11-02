"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, TrendingUp, Plane, Heart, Calendar } from "lucide-react"

export default function PersonalInfo() {
  const stats = [
    { label: "Total Trips", value: "12", icon: Plane, color: "text-blue-500" },
    { label: "Total Spent", value: "$8,450", icon: TrendingUp, color: "text-green-500" },
    { label: "Wishlist Items", value: "8", icon: Heart, color: "text-rose-500" },
    { label: "Member Since", value: "2022", icon: Calendar, color: "text-amber-500" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card
              key={stat.label}
              className="border border-border bg-card hover:border-amber-500/50 transition-all shadow-sm hover:shadow-md"
            >
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
              { label: "Full Name", value: "Ahmed Hassan" },
              { label: "Email Address", value: "ahmed@example.com" },
              { label: "Phone Number", value: "+20 100 123 4567" },
              { label: "Date of Birth", value: "January 15, 1990" },
              { label: "Address", value: "123 Nile St, Cairo, Egypt" },
              { label: "Membership Level", value: "Platinum" },
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
                  <p className="text-base font-medium text-foreground mt-2">{field.value}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
