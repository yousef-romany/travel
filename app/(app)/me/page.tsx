"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileHeader from "@/components/profile-header"
import PersonalInfo from "@/components/personal-info"
import TripsSection from "@/components/trips-section"
import InvoicesSection from "@/components/invoices-section"
import WishlistSection from "@/components/wishlist-section"


export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto mb-8 bg-card border border-border shadow-sm p-1 rounded-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded transition-all"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="trips"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded transition-all"
            >
              Trips
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded transition-all"
            >
              Invoices
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded transition-all"
            >
              Wishlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <PersonalInfo />
          </TabsContent>

          <TabsContent value="trips" className="space-y-6">
            <TripsSection />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <InvoicesSection />
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <WishlistSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
