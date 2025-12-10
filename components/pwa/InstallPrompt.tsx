"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Download, Smartphone, Zap, Wifi, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if user previously dismissed the prompt
    const dismissedTime = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Wait 5 seconds before showing the prompt for better UX
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show prompt after 5 seconds if not installed
    if (iOS && !window.matchMedia("(display-mode: standalone)").matches) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // For iOS, show instructions
      if (isIOS) {
        setShowIOSInstructions(true);
        return;
      }
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installed successfully");
      setShowPrompt(false);
      setIsInstalled(true);
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  const handleIOSInstructionsClose = () => {
    setShowIOSInstructions(false);
    handleDismiss();
  };

  // Don't show if already installed
  if (isInstalled || !showPrompt) {
    return null;
  }

  // iOS Instructions Modal
  if (showIOSInstructions) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleIOSInstructionsClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full"
          >
            <Card className="border-2 border-primary">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Install on iOS</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleIOSInstructionsClose}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    To install ZoeHoliday on your iOS device:
                  </p>

                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          Tap the <strong>Share</strong> button <span className="inline-block text-blue-500">⎙</span> at the bottom of Safari
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          Scroll down and tap <strong>"Add to Home Screen"</strong> <span className="inline-block">➕</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          Tap <strong>"Add"</strong> in the top right corner
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={handleIOSInstructionsClose} className="w-full">
                      Got it!
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Install Prompt
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[100]"
      >
        <Card className="border-2 border-primary shadow-2xl bg-card/95 backdrop-blur-lg">
          <CardContent className="p-6">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">Install ZoeHoliday</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant access to Egypt's best tours with one tap
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b">
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium">Fast Access</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium">Works Offline</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium">Get Updates</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                className="flex-1 gap-2 h-11 text-base font-semibold"
              >
                <Download className="h-5 w-5" />
                {isIOS ? "How to Install" : "Install App"}
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="px-4"
              >
                Not Now
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-3">
              Free • No download required • Takes 2 seconds
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
