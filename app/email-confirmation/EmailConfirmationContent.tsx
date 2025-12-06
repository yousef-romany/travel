"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle, ArrowLeft, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function EmailConfirmationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("confirmation");
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [error, setError] = useState("");

  const [emailInput, setEmailInput] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  useEffect(() => {
    // If there's no token, this is just the "check your email" page
    if (!token) {
      setLoading(false);
      return;
    }

    // If there's a token, verify it
    async function confirmEmail() {
      try {
        const res = await fetch(`/api/confirm-email?confirmation=${token}`);
        const data = await res.json();

        if (res.ok) {
          setVerified(true);
        } else {
          const msg = data?.error?.message?.toLowerCase() || "";
          if (msg.includes("already")) setAlreadyVerified(true);
          else setError(data?.error || "Verification failed.");
        }
      } catch {
        setError("Network error. Try again later.");
      } finally {
        setLoading(false);
      }
    }

    confirmEmail();
  }, [token]);

  const resendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendState("sending");

    try {
      const res = await fetch("/api/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput })
      });

      if (res.ok) {
        setSendState("sent");
      } else {
        setSendState("failed");
      }
    } catch {
      setSendState("failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex justify-center items-center px-4 relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/60 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md p-8 bg-card border border-primary/20 rounded-2xl shadow-2xl relative">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          {token ? "Confirm Email" : "Check Your Email"}
        </h1>

        {loading && (
          <div className="text-center">
            <Loader className="animate-spin mx-auto text-primary" size={32} />
            <p className="text-muted-foreground mt-2">Checking confirmation...</p>
          </div>
        )}

        {!loading && verified && (
          <div className="text-center space-y-4">
            <CheckCircle size={48} className="text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">Email Verified Successfully!</h2>
            <p className="text-muted-foreground">Your account is now active.</p>
            <Link href="/login" className="block bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Go to Login
            </Link>
          </div>
        )}

        {!loading && alreadyVerified && (
          <div className="text-center space-y-4">
            <CheckCircle size={48} className="text-blue-500 mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">Already Verified</h2>
            <p className="text-muted-foreground">Your email is already verified.</p>
            <Link href="/login" className="block bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Go to Login
            </Link>
          </div>
        )}

        {/* If no token and not loading - show "check your email" message */}
        {!loading && !token && !verified && (
          <div className="text-center space-y-4">
            <Mail size={48} className="text-primary mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">Verification Email Sent!</h2>
            <p className="text-muted-foreground">
              We've sent a confirmation email to <span className="font-semibold text-foreground">{user?.email || "your email"}</span>.
              Please check your inbox and click the verification link to activate your account.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
              <p className="mb-2">Can't find the email?</p>
              <ul className="list-disc list-inside text-left space-y-1">
                <li>Check your spam/junk folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait a few minutes for the email to arrive</li>
              </ul>
            </div>

            <form onSubmit={resendEmail} className="space-y-3 pt-4">
              <input
                type="email"
                className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
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

              {sendState === "sent" && (
                <p className="text-green-500 text-sm flex items-center justify-center gap-1">
                  <CheckCircle size={16} /> Email sent successfully!
                </p>
              )}
              {sendState === "failed" && (
                <p className="text-destructive text-sm">Failed to send. Please try again later.</p>
              )}
            </form>
          </div>
        )}

        {/* If token exists but verification failed */}
        {!loading && token && !verified && !alreadyVerified && error && (
          <div className="text-center space-y-4">
            <Mail size={48} className="text-destructive mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">Verification Failed</h2>
            <p className="text-destructive">{error}</p>

            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
              The verification link may be invalid or expired. Please request a new one below.
            </div>

            <form onSubmit={resendEmail} className="space-y-3">
              <input
                type="email"
                className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Enter your email to resend confirmation"
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

              {sendState === "sent" && (
                <p className="text-green-500 text-sm flex items-center justify-center gap-1">
                  <CheckCircle size={16} /> Email sent successfully!
                </p>
              )}
              {sendState === "failed" && (
                <p className="text-destructive text-sm">Failed to send. Please try again later.</p>
              )}
            </form>

            <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors text-sm inline-block">
              Create a new account
            </Link>
          </div>
        )}

        <Link href="/" className="text-primary hover:text-primary/80 transition-colors flex justify-center items-center gap-1 mt-6 text-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
