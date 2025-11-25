"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle, ArrowLeft, Loader } from "lucide-react";

export default function EmailConfirmationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("confirmation");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [error, setError] = useState("");

  const [emailInput, setEmailInput] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  useEffect(() => {
    if (!token) {
      setError("Invalid confirmation link.");
      setLoading(false);
      return;
    }

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
    <div className="min-h-screen bg-background flex justify-center items-center px-4">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-2xl shadow-lg">

        <h1 className="text-2xl font-bold text-center mb-6">Confirm Email</h1>

        {loading && (
          <div className="text-center">
            <Loader className="animate-spin mx-auto" size={32} />
            <p className="text-muted-foreground mt-2">Checking confirmation...</p>
          </div>
        )}

        {!loading && verified && (
          <div className="text-center space-y-4">
            <CheckCircle size={40} className="text-green-500 mx-auto" />
            <p>Email verified successfully ✅</p>
            <Link href="/login" className="block bg-primary text-primary-foreground py-2 rounded-md font-medium">
              Go to Login
            </Link>
          </div>
        )}

        {!loading && alreadyVerified && (
          <div className="text-center space-y-4">
            <CheckCircle size={40} className="text-blue-500 mx-auto" />
            <p>Your email is already verified.</p>
            <Link href="/login" className="block bg-primary text-primary-foreground py-2 rounded-md font-medium">
              Go to Login
            </Link>
          </div>
        )}

        {!loading && !verified && !alreadyVerified && (
          <div className="text-center space-y-4">
            <Mail size={40} className="text-red-500 mx-auto" />
            <p className="text-red-400">{error}</p>

            <form onSubmit={resendEmail} className="space-y-3">
              <input
                type="email"
                className="w-full px-4 py-2 border border-border rounded-md bg-input"
                placeholder="Enter your email to resend confirmation"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={sendState === "sending"}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md"
              >
                {sendState === "sending" ? "Sending..." : "Resend Email"}
              </button>

              {sendState === "sent" && <p className="text-green-400 text-sm">✔ Email sent successfully.</p>}
              {sendState === "failed" && <p className="text-red-400 text-sm">✖ Failed to send. Try later.</p>}
            </form>

            <Link href="/signup" className="text-primary hover:underline text-sm">
              Create a new account
            </Link>
          </div>
        )}

        <Link href="/" className="text-primary hover:underline flex justify-center mt-6 text-sm">
          <ArrowLeft size={16} className="mr-1" /> Back to Home
        </Link>

      </div>
    </div>
  );
}
