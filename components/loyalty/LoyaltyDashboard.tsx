"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  getCurrentTier,
  getNextTier,
  getPointsToNextTier,
  getTierProgress,
  LOYALTY_TIERS,
  formatPoints,
  pointsToDollars,
  PointTransaction,
} from "@/lib/loyalty";
import { Gift, TrendingUp, Star, Award, Calendar, ArrowRight } from "lucide-react";

interface LoyaltyDashboardProps {
  userId: number;
  totalPoints: number;
  lifetimeSpent: number;
  bookingsCount: number;
  earnedThisMonth: number;
  history: PointTransaction[];
}

export function LoyaltyDashboard({
  userId,
  totalPoints,
  lifetimeSpent,
  bookingsCount,
  earnedThisMonth,
  history,
}: LoyaltyDashboardProps) {
  const currentTier = getCurrentTier(totalPoints);
  const nextTier = getNextTier(totalPoints);
  const pointsToNext = getPointsToNextTier(totalPoints);
  const progress = getTierProgress(totalPoints);
  const redeemableValue = pointsToDollars(totalPoints);

  return (
    <div className="space-y-6">
      {/* Current Tier Card */}
      <Card className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundColor: currentTier.color }}
        />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <span className="text-4xl">{currentTier.icon}</span>
                {currentTier.name}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {formatPoints(totalPoints)} Points
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="text-lg px-4 py-2"
              style={{ backgroundColor: currentTier.color + "20", color: currentTier.color }}
            >
              ${redeemableValue.toFixed(2)} Value
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {nextTier && pointsToNext && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextTier.name}</span>
                <span className="font-semibold">
                  {formatPoints(pointsToNext)} points to go
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                You're {progress}% of the way to {nextTier.icon} {nextTier.name}!
              </p>
            </div>
          )}
          {!nextTier && (
            <div className="text-center py-4">
              <Award className="h-12 w-12 mx-auto mb-2 text-yellow-500" />
              <p className="font-semibold">You've reached the highest tier!</p>
              <p className="text-sm text-muted-foreground">
                Continue earning points for exclusive rewards
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${lifetimeSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {bookingsCount} bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPoints(earnedThisMonth)}</div>
            <p className="text-xs text-muted-foreground">
              Points earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redeemable</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${redeemableValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Available to use
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Your {currentTier.name} Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentTier.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          {nextTier && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                {nextTier.icon} Unlock {nextTier.name} Benefits
              </h4>
              <ul className="space-y-1 text-sm">
                {nextTier.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <span>•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-4 w-full" variant="outline" asChild>
                <a href="/programs">
                  Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest point transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                  {transaction.relatedBooking && (
                    <p className="text-xs text-muted-foreground">
                      Booking: {transaction.relatedBooking}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`font-semibold ${
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount}
                  </span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Tiers Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Tiers</CardTitle>
          <CardDescription>See all the benefits you can unlock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {LOYALTY_TIERS.map((tier, index) => (
              <div
                key={tier.name}
                className={`p-4 rounded-lg border-2 ${
                  tier.name === currentTier.name
                    ? "border-primary bg-primary/5"
                    : "border-muted"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tier.icon}</span>
                    <div>
                      <h4 className="font-semibold">{tier.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPoints(tier.minPoints)}+ points
                      </p>
                    </div>
                  </div>
                  {tier.name === currentTier.name && (
                    <Badge>Current Tier</Badge>
                  )}
                </div>
                <ul className="text-sm space-y-1 mt-2">
                  {tier.benefits.slice(0, 3).map((benefit, idx) => (
                    <li key={idx} className="text-muted-foreground">
                      • {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Compact Loyalty Widget for homepage
 */
export function LoyaltyWidget() {
  const [loyaltyData, setLoyaltyData] = useState({
    totalPoints: 0,
    lifetimeSpent: 0,
    bookingsCount: 0,
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    setLoyaltyData({
      totalPoints: 0,
      lifetimeSpent: 0,
      bookingsCount: 0,
    });
  }, []);

  const currentTier = getCurrentTier(loyaltyData.totalPoints);
  const nextTier = getNextTier(loyaltyData.totalPoints);
  const progress = getTierProgress(loyaltyData.totalPoints);

  return (
    <Card className="border-2 border-primary/20 hover-lift">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{currentTier.icon}</div>
            <div>
              <h3 className="text-2xl font-bold">{currentTier.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatPoints(loyaltyData.totalPoints)} points
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {currentTier.discount}% OFF
          </Badge>
        </div>

        {nextTier && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to {nextTier.name}</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {formatPoints(getPointsToNextTier(loyaltyData.totalPoints) || 0)} points to next tier
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{loyaltyData.bookingsCount}</div>
            <div className="text-xs text-muted-foreground">Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              ${pointsToDollars(loyaltyData.totalPoints).toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">In Credits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {currentTier.discount}%
            </div>
            <div className="text-xs text-muted-foreground">Discount</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
