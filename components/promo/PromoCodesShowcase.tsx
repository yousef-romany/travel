"use client";

import { useState, useEffect } from "react";
import { getActivePromoCodes, PromoCode } from "@/fetch/promo-codes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Copy, Check, Clock, Percent, DollarSign, Gift, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PromoCodesShowcaseProps {
  limit?: number;
  showTitle?: boolean;
  variant?: "grid" | "carousel" | "banner";
}

export function PromoCodesShowcase({
  limit,
  showTitle = true,
  variant = "grid"
}: PromoCodesShowcaseProps) {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const codes = await getActivePromoCodes();
        setPromoCodes(limit ? codes.slice(0, limit) : codes);
      } catch (error) {
        console.error("Error fetching promo codes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoCodes();
  }, [limit]);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Promo code "${code}" copied!`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const formatDiscount = (code: PromoCode) => {
    if (code.discountType === "percentage") {
      return `${code.discountValue}% OFF`;
    } else {
      return `$${code.discountValue} OFF`;
    }
  };

  const formatExpiry = (validUntil: string) => {
    const date = new Date(validUntil);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Expires today!";
    if (diffDays === 1) return "Expires tomorrow!";
    if (diffDays <= 7) return `Expires in ${diffDays} days`;
    return `Valid until ${date.toLocaleDateString()}`;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (promoCodes.length === 0) {
    return null;
  }

  if (variant === "banner" && promoCodes.length > 0) {
    const code = promoCodes[0];
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-amber-500 to-orange-500 p-1">
        <div className="relative bg-background rounded-xl p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-amber-500/10 rounded-xl">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-gradient-to-r from-primary to-amber-500 text-white border-0">
                    {formatDiscount(code)}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatExpiry(code.validUntil)}
                  </span>
                </div>
                <h3 className="font-bold text-lg">
                  {code.description || "Special Discount Available!"}
                </h3>
                {code.minimumPurchase && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Min. purchase: ${code.minimumPurchase}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-lg border-2 border-dashed border-primary/30">
                <span className="font-mono font-bold text-lg text-primary">
                  {code.code}
                </span>
              </div>
              <Button
                onClick={() => copyToClipboard(code.code)}
                className="bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
              >
                {copiedCode === code.code ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-full border border-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Special Offers</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            Active Promo Codes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Save big on your next adventure! Use these exclusive promo codes to get amazing discounts on our Egypt tour packages.
          </p>
        </div>
      )}

      <div className={`grid gap-4 ${
        variant === "carousel"
          ? "grid-cols-1 md:grid-cols-2"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }`}>
        {promoCodes.map((code) => (
          <Card
            key={code.id}
            className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="p-3 bg-gradient-to-br from-primary/10 to-amber-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  {code.discountType === "percentage" ? (
                    <Percent className="h-6 w-6 text-primary" />
                  ) : (
                    <DollarSign className="h-6 w-6 text-primary" />
                  )}
                </div>
                <Badge className="bg-gradient-to-r from-primary to-amber-500 text-white border-0">
                  {formatDiscount(code)}
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {code.description || "Exclusive Discount"}
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {code.minimumPurchase && (
                    <p className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      Min. purchase: ${code.minimumPurchase}
                    </p>
                  )}
                  {code.maximumDiscount && (
                    <p className="flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      Max. discount: ${code.maximumDiscount}
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <Clock className="h-3 w-3" />
                    {formatExpiry(code.validUntil)}
                  </p>
                </div>
              </div>

              {/* Code and Copy Button */}
              <div className="pt-4 border-t border-dashed space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 px-4 py-3 bg-gradient-to-r from-primary/5 to-amber-500/5 rounded-lg border-2 border-dashed border-primary/20">
                    <span className="font-mono font-bold text-lg text-primary">
                      {code.code}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(code.code)}
                    className="bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
                  >
                    {copiedCode === code.code ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {code.usageLimit && (
                  <div className="text-xs text-muted-foreground text-center">
                    {code.usageLimit - code.usageCount} uses remaining
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
