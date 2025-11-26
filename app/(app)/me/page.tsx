"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/profile-header";
import PersonalInfo from "@/components/personal-info";
import TripsSection from "@/components/trips-section";
import InvoicesSection from "@/components/invoices-section";
import WishlistSection from "@/components/wishlist-section";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
      </div>
      <div className="animate-slide-down">
        <ProfileHeader />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-slide-up animate-delay-200">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto mb-8 bg-card border border-border shadow-sm p-1 rounded-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded transition-smooth"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="trips"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded transition-smooth"
            >
              Trips
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded transition-smooth"
            >
              Invoices
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded transition-smooth"
            >
              Wishlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 tab-content-enter">
            <PersonalInfo />
          </TabsContent>

          <TabsContent value="trips" className="space-y-6 tab-content-enter">
            <TripsSection />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6 tab-content-enter">
            <InvoicesSection />
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6 tab-content-enter">
            <WishlistSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
