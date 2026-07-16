"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, CheckCircle, ArrowLeft, Loader, RefreshCw } from "lucide-react";

export default function EmailConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ?confirmation=TOKEN  → user clicked Strapi email link
  const confirmationToken = searchParams.get("confirmation");
  // ?confirmed=true      → server already confirmed, redirected here
  const isAlreadyConfirmed = searchParams.get("confirmed") === "true";
  // ?email=user@...      → passed from signup so we can display it
  const emailParam = searchParams.get("email") || "";

  const [verifying, setVerifying] = useState(!!confirmationToken);
  const [verified, setVerified] = useState(isAlreadyConfirmed);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);

  // Email to show on the "check your inbox" screen
  const [displayEmail, setDisplayEmail] = useState(
    emailParam ||
    (typeof window !== "undefined" ? sessionStorage.getItem("pendingEmail") || "" : "")
  );

  const [emailInput, setEmailInput] = useState(displayEmail);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  // ── Verify the token from the URL ──
  useEffect(() => {
    if (!confirmationToken) return;

    async function confirmEmail() {
      try {
        const res = await fetch(`/api/confirm-email?confirmation=${confirmationToken}`);

        // Server redirects on success — if we're still here, check status
        if (res.redirected || res.ok) {
          setVerified(true);
          return;
        }

        const data = await res.json();
        const msg = (data?.error?.message || data?.error || "").toLowerCase();
        if (msg.includes("already")) {
          setAlreadyVerified(true);
        } else {
          setError(data?.error || "Verification failed. The link may have expired.");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setVerifying(false);
      }
    }

    confirmEmail();
  }, [confirmationToken]);

  // ── Auto-redirect countdown after successful verification ──
  useEffect(() => {
    if (!verified) return;
    if (countdown <= 0) {
      router.push("/complete-profile?fromConfirmation=true");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [verified, countdown, router]);

  const resendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendState("sending");
    try {
      const res = await fetch("/api/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });
      setSendState(res.ok ? "sent" : "failed");
    } catch {
      setSendState("failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex justify-center items-center px-4 relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/60 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md p-8 bg-card border border-primary/20 rounded-2xl shadow-2xl relative">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          {confirmationToken || isAlreadyConfirmed ? "Email Verification" : "Check Your Email"}
        </h1>

        {/* ── Verifying spinner ── */}
        {verifying && (
          <div className="text-center space-y-3">
            <Loader className="animate-spin mx-auto text-primary" size={40} />
            <p className="text-muted-foreground">Verifying your email...</p>
          </div>
        )}

        {/* ── Success ── */}
        {!verifying && verified && (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Email Verified! 🎉</h2>
            <p className="text-muted-foreground">
              Your account is now active. Let&apos;s set up your traveller profile.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-sm text-primary">
              Redirecting in <span className="font-bold">{countdown}s</span>...
            </div>
            <button
              onClick={() => router.push("/complete-profile?fromConfirmation=true")}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue to Profile Setup →
            </button>
            <Link href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
              Or browse tours first
            </Link>
          </div>
        )}

        {/* ── Already verified ── */}
        {!verifying && alreadyVerified && (
          <div className="text-center space-y-4">
            <CheckCircle size={48} className="text-blue-500 mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">Already Verified</h2>
            <p className="text-muted-foreground">Your email is already confirmed.</p>
            <Link
              href="/login"
              className="block bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}

        {/* ── Check your inbox (no token yet) ── */}
        {!verifying && !confirmationToken && !verified && !alreadyVerified && (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto">
              <Mail size={40} className="text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Verification Email Sent!</h2>
            <p className="text-muted-foreground">
              We&apos;ve sent a confirmation link to{" "}
              <span className="font-semibold text-foreground">
                {displayEmail || "your email address"}
              </span>
              . Click the link in that email to activate your account.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground text-left space-y-1">
              <p className="font-medium mb-2">Can&apos;t find it?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check your spam / junk folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait 1–2 minutes for delivery</li>
              </ul>
            </div>

            {/* While waiting, let them explore */}
            <Link
              href="/programs"
              className="flex items-center justify-center gap-2 w-full py-3 border border-primary/30 text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              Explore tours while you wait →
            </Link>

            {/* Resend form */}
            <form onSubmit={resendEmail} className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">Didn&apos;t get it? Resend:</p>
              <input
                type="email"
                className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={sendState === "sending"}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {sendState === "sending" ? (
                  <><Loader size={16} className="animate-spin" /> Sending...</>
                ) : (
                  <><RefreshCw size={16} /> Resend Verification Email</>
                )}
              </button>
              {sendState === "sent" && (
                <p className="text-green-500 text-sm flex items-center justify-center gap-1">
                  <CheckCircle size={16} /> Email sent! Check your inbox.
                </p>
              )}
              {sendState === "failed" && (
                <p className="text-destructive text-sm">Failed to send. Please try again.</p>
              )}
            </form>
          </div>
        )}

        {/* ── Verification failed ── */}
        {!verifying && confirmationToken && !verified && !alreadyVerified && error && (
          <div className="text-center space-y-4">
            <Mail size={48} className="text-destructive mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">Verification Failed</h2>
            <p className="text-destructive text-sm">{error}</p>
            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
              The link may be expired or invalid. Request a fresh one below.
            </div>
            <form onSubmit={resendEmail} className="space-y-3">
              <input
                type="email"
                className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:border-primary transition-colors"
                placeholder="Enter your email to resend"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={sendState === "sending"}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                {sendState === "sending" ? "Sending..." : "Resend Verification Email"}
              </button>
              {sendState === "sent" && <p className="text-green-500 text-sm">✅ Email sent!</p>}
              {sendState === "failed" && <p className="text-destructive text-sm">❌ Failed, try later.</p>}
            </form>
            <Link href="/signup" className="text-primary hover:text-primary/80 text-sm">
              Create a new account instead
            </Link>
          </div>
        )}

        <Link
          href="/"
          className="text-primary hover:text-primary/80 transition-colors flex justify-center items-center gap-1 mt-6 text-sm"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
