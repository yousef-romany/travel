"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingDown, Sparkles } from "lucide-react";
import {
  calculateGroupDiscount,
  getNextDiscountTier,
  getGroupDiscountTiers,
} from "@/lib/group-discounts";

interface GroupDiscountCalculatorProps {
  numberOfTravelers: number;
  basePrice: number;
  onDiscountCalculated?: (discountAmount: number, finalTotal: number) => void;
}

export function GroupDiscountCalculator({
  numberOfTravelers,
  basePrice,
  onDiscountCalculated,
}: GroupDiscountCalculatorProps) {
  const [calculation, setCalculation] = useState<any>(null);

  useEffect(() => {
    const result = calculateGroupDiscount(numberOfTravelers, basePrice);
    setCalculation(result);

    if (onDiscountCalculated) {
      onDiscountCalculated(result.originalTotal - result.finalTotal, result.finalTotal);
    }
  }, [numberOfTravelers, basePrice, onDiscountCalculated]);

  if (!calculation) return null;

  const nextTier = getNextDiscountTier(numberOfTravelers);
  const tiers = getGroupDiscountTiers();
  const hasDiscount = calculation.discount !== null;

  return (
    <div className="space-y-4">
      {/* Active Discount Display */}
      {hasDiscount && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                Group Discount Applied!
              </CardTitle>
              <Badge className="bg-green-600 dark:bg-green-700">
                Save {calculation.discount.discountPercentage}%
              </Badge>
            </div>
            <CardDescription className="text-green-700 dark:text-green-300">
              {calculation.discount.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700 dark:text-green-300">
                Per person discount:
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                -${calculation.discountAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700 dark:text-green-300">
                Discounted price per person:
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ${calculation.discountedPrice.toFixed(2)}
              </span>
            </div>
            <div className="pt-3 border-t border-green-200 dark:border-green-900">
              <div className="flex items-center justify-between">
                <span className="font-medium text-green-700 dark:text-green-300">
                  Total Savings:
                </span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  ${(calculation.originalTotal - calculation.finalTotal).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Tier Incentive */}
      {nextTier && (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">
                  Add {nextTier.minTravelers - numberOfTravelers} more{" "}
                  {nextTier.minTravelers - numberOfTravelers === 1 ? "traveler" : "travelers"} to
                  unlock {nextTier.discountPercentage}% discount!
                </p>
                <p className="text-xs text-muted-foreground">
                  {nextTier.description} - Save even more on your group booking
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discount Tiers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Group Discount Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tiers.map((tier, index) => {
              const isActive =
                numberOfTravelers >= tier.minTravelers &&
                numberOfTravelers <= tier.maxTravelers;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}>
                        {tier.minTravelers}-{tier.maxTravelers === Infinity ? "+" : tier.maxTravelers} travelers
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tier.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {tier.discountPercentage}% OFF
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
