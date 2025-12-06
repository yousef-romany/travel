"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Copy,
  Check,
  Users,
  DollarSign,
  Clock,
  Share2,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  generateReferralCode,
  validateReferralCode,
  getReferralStats,
  getReferralHistory,
  type ReferralStats,
  type Referral,
} from "@/fetch/referrals";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  shareOnFacebook,
  shareOnTwitter,
  shareOnWhatsApp,
  shareViaEmail,
} from "@/lib/social-sharing";

export function ReferralProgram() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [history, setHistory] = useState<Referral[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    try {
      setIsLoadingStats(true);
      const [statsData, historyData] = await Promise.all([
        getReferralStats(),
        getReferralHistory(),
      ]);
      setStats(statsData);
      setHistory(historyData);
      if (statsData.activeCode) {
        setReferralCode(statsData.activeCode);
      }
    } catch (error) {
      console.error("Error loading referral data:", error);
      // Don't show error toast - the fetch functions already handle missing endpoints gracefully
      // Set default data instead
      setStats({
        totalReferrals: 0,
        pendingReferrals: 0,
        completedReferrals: 0,
        totalEarned: 0,
        activeCode: null,
      });
      setHistory([]);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!user) {
      toast.error("Please log in to generate a referral code");
      return;
    }

    try {
      setIsGenerating(true);
      const result = await generateReferralCode();
      setReferralCode(result.referralCode);
      toast.success(result.message);
      loadReferralData(); // Reload stats
    } catch (error: any) {
      console.error("Error generating code:", error);
      toast.error(error.response?.data?.error?.message || "Failed to generate referral code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    if (!referralCode) return;

    try {
      await navigator.clipboard.writeText(referralCode);
      setIsCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const getReferralLink = () => {
    if (typeof window === "undefined" || !referralCode) return "";
    return `${window.location.origin}/signup?ref=${referralCode}`;
  };

  const handleShareReferral = (platform: "facebook" | "twitter" | "whatsapp" | "email") => {
    const referralLink = getReferralLink();
    const shareOptions = {
      title: "Join ZoeHolidays and Get $50!",
      text: `Use my referral code ${referralCode} to get $50 off your first booking with ZoeHolidays. I'll get $50 too!`,
      url: referralLink,
      hashtags: ["Travel", "ZoeHolidays", "TravelDeals"],
      via: "ZoeHolidays",
    };

    const shareConfig = {
      contentType: "custom" as const,
      contentId: "referral-program",
      contentTitle: "ZoeHolidays Referral Program",
    };

    switch (platform) {
      case "facebook":
        shareOnFacebook(shareOptions, shareConfig);
        break;
      case "twitter":
        shareOnTwitter(shareOptions, shareConfig);
        break;
      case "whatsapp":
        shareOnWhatsApp(shareOptions, shareConfig);
        break;
      case "email":
        shareViaEmail(shareOptions, shareConfig);
        break;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
          <CardDescription>Please log in to access the referral program</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Refer Friends, Earn Rewards!</CardTitle>
              <CardDescription className="text-base">
                Give $50, Get $50 - Share the love of travel
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* How it Works */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Share Your Code</h4>
                <p className="text-sm text-muted-foreground">
                  Send your unique referral code to friends
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">They Book a Trip</h4>
                <p className="text-sm text-muted-foreground">
                  Your friend gets $50 off their first booking
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">You Both Win</h4>
                <p className="text-sm text-muted-foreground">
                  Get $50 credit after their booking is confirmed
                </p>
              </div>
            </div>
          </div>

          {/* Referral Code Section */}
          <div className="space-y-3">
            {referralCode ? (
              <>
                <Label>Your Referral Code</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={referralCode}
                      readOnly
                      className="font-mono text-lg font-bold pr-10"
                    />
                  </div>
                  <Button onClick={handleCopyCode} variant="outline">
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareReferral("facebook")}
                  >
                    Share on Facebook
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareReferral("twitter")}
                  >
                    Share on Twitter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareReferral("whatsapp")}
                  >
                    Share on WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShareReferral("email")}>
                    Share via Email
                  </Button>
                </div>

                <div className="bg-muted p-3 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Referral Link</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs flex-1 truncate">{getReferralLink()}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(getReferralLink());
                        toast.success("Link copied!");
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Button onClick={handleGenerateCode} disabled={isGenerating} size="lg" className="w-full">
                {isGenerating ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Gift className="h-5 w-5 mr-2" />
                    Generate My Referral Code
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Referrals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalReferrals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.pendingReferrals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.completedReferrals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">${stats.totalEarned.toFixed(0)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Referral History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
            <CardDescription>Track your referrals and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {referral.referralCode}
                      </code>
                      <Badge
                        variant={
                          referral.status === "completed"
                            ? "default"
                            : referral.status === "pending"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {referral.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {referral.referred
                        ? `Referred user signed up`
                        : "Waiting for someone to use this code"}
                    </p>
                    {referral.completedAt && (
                      <p className="text-xs text-muted-foreground">
                        Completed: {new Date(referral.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ${referral.referralReward.toFixed(0)}
                    </div>
                    {referral.status === "completed" && referral.isRewardClaimed && (
                      <Badge variant="outline" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Claimed
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terms & Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Program Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Both referrer and referred user receive $50 credit</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Credit is applied after the referred user completes their first booking</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Referral codes are valid for 6 months from generation</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Cannot refer yourself or use multiple accounts</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Credits can be used on any future booking</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Unlimited referrals - the more you share, the more you earn!</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Compact referral widget for dashboard
 */
export function ReferralWidget() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);

  useEffect(() => {
    if (user) {
      getReferralStats()
        .then(setStats)
        .catch((error) => console.error("Error loading stats:", error));
    }
  }, [user]);

  if (!user || !stats) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Refer & Earn</CardTitle>
            <CardDescription>Share and get $50 per referral</CardDescription>
          </div>
          <Gift className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{stats.completedReferrals}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-green-600">${stats.totalEarned}</div>
            <div className="text-xs text-muted-foreground">Earned</div>
          </div>
        </div>
        <Button className="w-full" size="sm" asChild>
          <a href="/dashboard?tab=referrals">
            <Share2 className="h-4 w-4 mr-2" />
            View Details
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
