"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { validatePromoCode, PromoCode } from "@/fetch/promo-codes";
import { Loader2, Tag, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface PromoCodeInputProps {
  totalAmount: number;
  programId?: string;
  onPromoApplied: (promoCode: PromoCode, discountAmount: number, finalPrice: number) => void;
  onPromoRemoved: () => void;
}

export function PromoCodeInput({
  totalAmount,
  programId,
  onPromoApplied,
  onPromoRemoved,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: PromoCode;
    discountAmount: number;
    finalPrice: number;
  } | null>(null);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsValidating(true);
    try {
      const result = await validatePromoCode(code.trim(), totalAmount, programId);

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
    onPromoRemoved();
    toast.info("Promo code removed");
  };

  if (appliedPromo) {
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
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Have a promo code?
      </label>
      <div className="flex gap-2">
        <Input
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleApply();
            }
          }}
          className="font-mono uppercase"
          disabled={isValidating}
        />
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
    </div>
  );
}
