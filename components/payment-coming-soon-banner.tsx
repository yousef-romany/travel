"use client";

import { useState, useEffect } from "react";
import { X, CreditCard, Globe, Lock, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PaymentComingSoonBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user has dismissed the banner (stored in localStorage)
  useEffect(() => {
    const dismissed = localStorage.getItem("paymentBannerDismissed");
    if (dismissed === "true") {
      setIsVisible(false);
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("paymentBannerDismissed", "true");
  };

  if (!isVisible || isDismissed) return null;

  return (
    <Alert className="mb-6 border-2 border-amber-500/50 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100">
                Online Payment Coming Soon!
              </h3>
              <Badge className="bg-amber-600 text-white">New Feature</Badge>
            </div>

            <AlertDescription className="text-amber-800 dark:text-amber-200 space-y-3">
              <p className="font-medium">
                We're excited to announce that we'll soon be accepting online payments worldwide! 🌍
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Secure Payments</p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Bank-level encryption
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Multiple Currencies</p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Pay in your local currency
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Payment Options</p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Credit, debit & more
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm mt-3">
                <strong>Current Payment:</strong> Please contact us via WhatsApp to complete your booking.
                We accept bank transfers and will guide you through the process.
              </p>
            </AlertDescription>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-amber-700 hover:text-amber-900 hover:bg-amber-200 dark:text-amber-300 dark:hover:text-amber-100"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
}
