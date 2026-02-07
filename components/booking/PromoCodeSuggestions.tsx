"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRecommendedPromos, PromoCode, validatePromoCode } from "@/fetch/promo-codes";
import { Sparkles, Tag, Clock, Percent, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface PromoCodeSuggestionsProps {
    totalAmount: number;
    programId?: string;
    userEmail?: string;
    userId?: string;
    onPromoSelect: (code: string) => void;
}

export function PromoCodeSuggestions({
    totalAmount,
    programId,
    userEmail,
    userId,
    onPromoSelect,
}: PromoCodeSuggestionsProps) {
    const [promos, setPromos] = useState<PromoCode[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPromos = async () => {
            setIsLoading(true);
            try {
                const recommended = await getRecommendedPromos(
                    totalAmount,
                    programId,
                    userEmail,
                    userId
                );
                setPromos(recommended.slice(0, 3)); // Show top 3
            } catch (error) {
                console.error("Error fetching recommended promos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (totalAmount > 0) {
            fetchPromos();
        }
    }, [totalAmount, programId, userEmail, userId]);

    const calculateDiscount = (promo: PromoCode): number => {
        if (promo.discountType === "percentage") {
            const discount = (totalAmount * promo.discountValue) / 100;
            return promo.maximumDiscount
                ? Math.min(discount, promo.maximumDiscount)
                : discount;
        }
        return Math.min(promo.discountValue, totalAmount);
    };

    const getExpiryText = (validUntil: string): string => {
        const now = new Date();
        const expiry = new Date(validUntil);
        const diffMs = expiry.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 7) {
            return `Valid for ${diffDays} days`;
        } else if (diffDays > 1) {
            return `Expires in ${diffDays} days`;
        } else if (diffHours > 1) {
            return `Expires in ${diffHours} hours`;
        } else {
            return "Expiring soon!";
        }
    };

    if (isLoading || promos.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Available Promo Codes</span>
            </div>

            <div className="space-y-2">
                {promos.map((promo) => {
                    const discount = calculateDiscount(promo);
                    const expiryText = getExpiryText(promo.validUntil);
                    const isExpiringSoon = expiryText.includes("soon") || expiryText.includes("hours");

                    return (
                        <Card
                            key={promo.id}
                            className="border-primary/20 hover:border-primary/40 transition-all cursor-pointer group"
                            onClick={() => onPromoSelect(promo.code)}
                        >
                            <CardContent className="p-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="secondary" className="font-mono font-bold">
                                                {promo.code}
                                            </Badge>
                                            {promo.firstTimeOnly && (
                                                <Badge variant="outline" className="text-xs">
                                                    First-time users
                                                </Badge>
                                            )}
                                        </div>

                                        {promo.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {promo.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                {promo.discountType === "percentage" ? (
                                                    <>
                                                        <Percent className="h-3 w-3" />
                                                        <span>{promo.discountValue}% off</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <DollarSign className="h-3 w-3" />
                                                        <span>${promo.discountValue} off</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span className={isExpiringSoon ? "text-orange-600 dark:text-orange-400 font-medium" : ""}>
                                                    {expiryText}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right space-y-1">
                                        <div className="text-sm font-bold text-green-600 dark:text-green-400">
                                            Save ${discount.toFixed(2)}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 text-xs group-hover:bg-primary group-hover:text-white transition-colors"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
