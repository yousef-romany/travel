"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchUserLoyalty } from "@/fetch/loyalty";
import { getUserStats } from "@/fetch/user";
import { fetchUserBookings } from "@/fetch/bookings";
import { fetchUserInvoices } from "@/fetch/invoices";

import ProfileHeader from "@/components/profile-header";
import PersonalInfo from "@/components/personal-info";
import TripsSection from "@/components/trips-section";
import InvoicesSection from "@/components/invoices-section";
import WishlistSection from "@/components/wishlist-section";
import PlannedTripsSection from "@/components/planned-trips-section";
import TestimonialsSection from "@/components/testimonials-section";
import { LoyaltyDashboard } from "@/components/loyalty/LoyaltyDashboard";
import { ReferralProgram } from "@/components/social/ReferralProgram";
import {
  LoyaltyDashboardSkeleton,
} from "@/components/loading/ProfileSkeletons";
import PaymentsSection from "@/components/payments-section";

import {
  User,
  Plane,
  Map,
  FileText,
  Heart,
  Star,
  Award,
  Users2,
  CreditCard,
  ChevronRight,
} from "lucide-react";

// ─── Tab Configuration ──────────────────────────────────────────────────────
const TABS = [
  { id: "overview",      label: "Overview",       icon: User },
  { id: "bookings",      label: "Bookings",        icon: Plane },
  { id: "planned",       label: "Planned Trips",   icon: Map },
  { id: "payments",      label: "Payments",        icon: CreditCard },
  { id: "invoices",      label: "Invoices",        icon: FileText },
  { id: "wishlist",      label: "Wishlist",        icon: Heart },
  { id: "reviews",       label: "My Reviews",      icon: Star },
  { id: "loyalty",       label: "Loyalty",         icon: Award },
  { id: "referrals",     label: "Referrals",       icon: Users2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Quick-stat card shown in the sidebar ────────────────────────────────────
function SidebarNavItem({
  tab,
  active,
  onClick,
  badge,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
  onClick: () => void;
  badge?: number | string;
}) {
  const Icon = tab.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative ${
        active
          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
          : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent"
      }`}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
          active ? "text-amber-400" : "group-hover:scale-110"
        }`}
      />
      <span className="text-sm font-medium truncate">{tab.label}</span>
      {badge !== undefined && (
        <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-semibold">
          {badge}
        </span>
      )}
      {active && (
        <ChevronRight className="ml-auto w-4 h-4 text-amber-400 flex-shrink-0" />
      )}
    </button>
  );
}

// ─── Mobile horizontal tab strip ────────────────────────────────────────────
function MobileTabStrip({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <div className="lg:hidden mb-6 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20">
      <div className="flex gap-2 min-w-max px-1 pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                active === tab.id
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-sm"
                  : "text-muted-foreground border-transparent hover:bg-card hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function UserProfileContent() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { user } = useAuth();

  // ✅ FIX: Use user.token from context — not localStorage (which is always null)
  const { data: loyaltyData, isLoading: loyaltyLoading } = useQuery({
    queryKey: ["userLoyalty", user?.id],
    queryFn: async () => {
      if (!user?.token) throw new Error("Not authenticated");
      return fetchUserLoyalty(user.token);
    },
    enabled: !!user?.token,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  const { data: userStats } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: () => getUserStats(user!.id, user!.token),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["userBookings", user?.documentId],
    queryFn: () => fetchUserBookings(user?.documentId, user?.token),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  const { data: invoicesData } = useQuery({
    queryKey: ["userInvoices", user?.documentId],
    queryFn: () => fetchUserInvoices(user?.documentId, user?.token),
    enabled: !!user?.documentId,
    staleTime: 2 * 60 * 1000,
  });

  const bookingCount = bookingsData?.data?.length ?? undefined;
  const invoiceCount = invoicesData?.data?.length ?? undefined;
  const loyaltyPoints = loyaltyData?.totalPoints;

  const tabBadges: Partial<Record<TabId, number | string>> = {
    bookings: bookingCount,
    invoices: invoiceCount,
    loyalty: loyaltyPoints !== undefined ? `${loyaltyPoints} pts` : undefined,
  };

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    // Scroll content area into view on mobile
    if (window.innerWidth < 1024) {
      document.getElementById("me-content")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Profile Banner */}
        <div className="animate-slide-down">
          <ProfileHeader />
        </div>

        {/* Mobile Tab Strip */}
        <div className="container mx-auto px-4 pt-6 max-w-7xl">
          <MobileTabStrip active={activeTab} onChange={handleTabChange} />
        </div>

        {/* Two-column layout: sidebar + content */}
        <div className="container mx-auto px-4 pb-16 max-w-7xl animate-fade-in">
          <div className="flex gap-6">

            {/* ── Sidebar Navigation (desktop only) ──────────────────── */}
            <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 gap-1 self-start sticky top-6 pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-4 mb-2">
                Account
              </p>
              {TABS.map((tab) => (
                <SidebarNavItem
                  key={tab.id}
                  tab={tab}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  badge={tabBadges[tab.id]}
                />
              ))}
            </aside>

            {/* ── Tab Content ────────────────────────────────────────── */}
            <main id="me-content" className="flex-1 min-w-0 py-2">
              {/* Tab Title */}
              <div className="mb-6 flex items-center gap-3 animate-slide-up">
                {(() => {
                  const currentTab = TABS.find((t) => t.id === activeTab)!;
                  const Icon = currentTab.icon;
                  return (
                    <>
                      <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {currentTab.label}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          {getTabSubtitle(activeTab)}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Tab Panels */}
              <div className="tab-content-enter">
                {activeTab === "overview" && <PersonalInfo />}

                {activeTab === "bookings" && <TripsSection />}

                {activeTab === "planned" && <PlannedTripsSection />}

                {activeTab === "payments" && <PaymentsSection />}

                {activeTab === "invoices" && <InvoicesSection />}

                {activeTab === "wishlist" && <WishlistSection />}

                {activeTab === "reviews" && <TestimonialsSection />}

                {activeTab === "loyalty" && (
                  <>
                    {loyaltyLoading ? (
                      <LoyaltyDashboardSkeleton />
                    ) : loyaltyData && user ? (
                      <LoyaltyDashboard
                        userId={user.id}
                        totalPoints={loyaltyData.totalPoints}
                        lifetimeSpent={loyaltyData.lifetimeSpent}
                        bookingsCount={loyaltyData.bookingsCount}
                        earnedThisMonth={loyaltyData.earnedThisMonth}
                        history={loyaltyData.history}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="p-5 bg-amber-500/10 rounded-full border border-amber-500/20 mb-4">
                          <Award className="w-10 h-10 text-amber-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          No Loyalty Data Yet
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-sm">
                          Complete your first booking to start earning loyalty
                          points and unlock exclusive rewards.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "referrals" && <ReferralProgram />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTabSubtitle(tab: TabId): string {
  const map: Record<TabId, string> = {
    overview:  "Your personal information & stats",
    bookings:  "All your past and upcoming trips",
    planned:   "Custom trip plans you've created",
    payments:  "Payment history & pending charges",
    invoices:  "Download and manage your invoices",
    wishlist:  "Programs you've saved for later",
    reviews:   "Reviews you've left for trips",
    loyalty:   "Points, tiers & reward history",
    referrals: "Invite friends & earn rewards",
  };
  return map[tab];
}
