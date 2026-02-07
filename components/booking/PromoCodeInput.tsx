"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { validatePromoCode, PromoCode } from "@/fetch/promo-codes";
import { Loader2, Tag, X, CheckCircle2, Clock, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { PromoCodeSuggestions } from "./PromoCodeSuggestions";

interface PromoCodeInputProps {
  totalAmount: number;
  programId?: string;
  userEmail?: string;
  userId?: string;
  onPromoApplied: (promoCode: PromoCode, discountAmount: number, finalPrice: number) => void;
  onPromoRemoved: () => void;
}

export function PromoCodeInput({
  totalAmount,
  programId,
  userEmail,
  userId,
  onPromoApplied,
  onPromoRemoved,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [previewDiscount, setPreviewDiscount] = useState<number | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: PromoCode;
    discountAmount: number;
    finalPrice: number;
  } | null>(null);

  // Real-time preview as user types
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (code.trim().length >= 3 && !appliedPromo) {
        try {
          const result = await validatePromoCode(code.trim(), totalAmount, programId, userEmail, userId);
          if (result.isValid && result.discountAmount) {
            setPreviewDiscount(result.discountAmount);
            setPreviewError(null);
          } else {
            setPreviewDiscount(null);
            setPreviewError(result.errorMessage || null);
          }
        } catch (error) {
          setPreviewDiscount(null);
          setPreviewError(null);
        }
      } else {
        setPreviewDiscount(null);
        setPreviewError(null);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [code, totalAmount, programId, userEmail, userId, appliedPromo]);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsValidating(true);
    try {
      const result = await validatePromoCode(code.trim(), totalAmount, programId, userEmail, userId);

      if (result.isValid && result.promoCode && result.discountAmount !== undefined && result.finalPrice !== undefined) {
        setAppliedPromo({
          code: result.promoCode,
          discountAmount: result.discountAmount,
          finalPrice: result.finalPrice,
        });
        onPromoApplied(result.promoCode, result.discountAmount, result.finalPrice);
        toast.success(`Promo code applied! You saved $${result.discountAmount.toFixed(2)}`);
        setCode("");
      } else {
        toast.error(result.errorMessage || "Invalid promo code");
      }
    } catch (error) {
      toast.error("Error applying promo code. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    setAppliedPromo(null);
    setCode("");
    setPreviewDiscount(null);
    setPreviewError(null);
    onPromoRemoved();
    toast.info("Promo code removed");
  };

  // Calculate time until expiry for countdown
  const getExpiryCountdown = (validUntil: string) => {
    const now = new Date();
    const expiry = new Date(validUntil);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 1) {
      return `Expires in ${diffDays} days`;
    } else if (diffHours > 1) {
      return `Expires in ${diffHours} hours`;
    } else {
      return "Expiring soon!";
    }
  };

  if (appliedPromo) {
    const expiryText = getExpiryCountdown(appliedPromo.code.validUntil);
    const isExpiringSoon = expiryText.includes("soon") || expiryText.includes("hours");

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono">
                  {appliedPromo.code.code}
                </Badge>
                <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Applied
                </span>
              </div>
              {appliedPromo.code.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {appliedPromo.code.description}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className={`text-xs ${isExpiringSoon ? 'text-orange-600 dark:text-orange-400 font-medium' : 'text-muted-foreground'}`}>
                  {expiryText}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-green-700 dark:text-green-300 hover:text-red-600 dark:hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Discount:</span>
          <span className="text-green-600 dark:text-green-400 font-semibold">
            -${appliedPromo.discountAmount.toFixed(2)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Have a promo code?
      </label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleApply();
                }
              }}
              className="font-mono uppercase pr-10"
              disabled={isValidating}
            />
            {isValidating && (
              <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            )}
          </div>
          <Button
            onClick={handleApply}
            disabled={isValidating || !code.trim()}
            variant="outline"
          >
            {isValidating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Apply"
            )}
          </Button>
        </div>

        {/* Preview discount or error */}
        {previewDiscount !== null && code.trim().length >= 3 && (
          <div className="flex items-center gap-2 text-sm p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-md">
            <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">
              You'll save ${previewDiscount.toFixed(2)}!
            </span>
          </div>
        )}

        {previewError && code.trim().length >= 3 && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {previewError}
          </p>
        )}
      </div>

      {/* Suggestions toggle */}
      <div className="border-t pt-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="w-full justify-between text-sm"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            View available promo codes
          </span>
          {showSuggestions ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {showSuggestions && (
          <div className="mt-3 animate-in slide-in-from-top-2 fade-in duration-300">
            <PromoCodeSuggestions
              totalAmount={totalAmount}
              programId={programId}
              userEmail={userEmail}
              userId={userId}
              onPromoSelect={(selectedCode) => {
                setCode(selectedCode);
                setShowSuggestions(false);
                // Auto-apply after a short delay
                setTimeout(() => {
                  handleApply();
                }, 100);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
