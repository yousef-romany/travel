"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle, ArrowLeft, Loader } from "lucide-react";

export default function EmailConfirmationPage() {
  const searchParams = useSearchParams();
  const confirmationToken = searchParams.get("confirmation");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [error, setError] = useState("");
  const [showResendInput, setShowResendInput] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<null | "idle" | "sending" | "sent" | "failed">(null);

  useEffect(() => {
    if (!confirmationToken) {
      setError("Invalid or missing verification link.");
      setLoading(false);
      return;
    }

    async function confirmEmail() {
      try {
        // Call your Next.js proxy route
        const res = await fetch(`/api/confirm-email?confirmation=${confirmationToken}`);
        // If the proxy performed a redirect (to a page), fetch() won't change the browser
        // but the proxy can send JSON indicating redirect. We handle JSON here:
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          // If proxy returned HTML (rare), treat as success and send user to login
          setVerified(true);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (res.ok && data?.jwt && data?.user) {
          // Successful confirm + auto-login
          localStorage.setItem("authToken", data.jwt);
          localStorage.setItem("user", JSON.stringify(data.user));
          setVerified(true);
        } else {
          // Handle known messages
          const msg = data?.error?.message || data?.message || "";
          if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("confirmed")) {
            setAlreadyVerified(true);
          } else if (res.status === 410) {
            // 410 could indicate expired
            setError("This verification link has expired.");
          } else {
            setError(msg || "We couldn't verify your email. Please try again.");
          }
        }
      } catch (e) {
        setError("We were unable to verify your email. Please try again shortly.");
      } finally {
        setLoading(false);
      }
    }

    confirmEmail();
  }, [confirmationToken]);

  async function handleResend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!resendEmail) {
      setResendStatus("failed");
      return;
    }
    setResendStatus("sending");
    try {
      const res = await fetch("/api/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      if (res.ok) {
        setResendStatus("sent");
      } else {
        setResendStatus("failed");
      }
    } catch {
      setResendStatus("failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4 relative">
      {/* Glow Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-amber-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md bg-background-900 border border-amber-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Confirm Email</h1>
          <p className="text-slate-400">Just a moment while we verify your account.</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center space-y-4">
            <Loader className="animate-spin text-amber-400 mx-auto" size={32} />
            <p className="text-slate-400">Verifying your email...</p>
          </div>
        )}

        {/* Verified now (and auto-logged) */}
        {!loading && verified && (
          <div className="text-center space-y-6">
            <CheckCircle size={48} className="text-green-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Email Verified ✅</h2>
            <p className="text-slate-400">Your account is active. You can now log in.</p>

            <Link href="/login" className="block bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 rounded-lg transition">
              Go to Login
            </Link>
          </div>
        )}

        {/* Already verified previously */}
        {!loading && alreadyVerified && (
          <div className="text-center space-y-6">
            <CheckCircle size={48} className="text-blue-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Email Already Verified</h2>
            <p className="text-slate-400">This email address was already verified. Please log in.</p>

            <Link href="/login" className="block bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 rounded-lg transition">
              Go to Login
            </Link>
          </div>
        )}

        {/* Failed / expired */}
        {!loading && !verified && !alreadyVerified && (
          <div className="text-center space-y-6">
            <Mail size={48} className="text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Verification Failed</h2>
            <p className="text-slate-400">{error || "Please check your email and try again."}</p>

            <div className="mt-4 space-y-3">
              <button
                onClick={() => setShowResendInput((s) => !s)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 rounded-lg transition"
              >
                Resend Verification Email
              </button>

              {showResendInput && (
                <form onSubmit={handleResend} className="mt-3 space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-amber-300/10 text-white"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg"
                    disabled={resendStatus === "sending"}
                  >
                    {resendStatus === "sending" ? "Sending..." : "Send Link"}
                  </button>

                  {resendStatus === "sent" && <p className="text-green-400 mt-2">Verification email sent — check your inbox.</p>}
                  {resendStatus === "failed" && <p className="text-red-400 mt-2">Couldn’t send. Try again later.</p>}
                </form>
              )}

              <Link
                href="/signup"
                className="block bg-slate-700 hover:bg-slate-700/90 text-amber-400 border border-amber-400/10 font-semibold py-3 rounded-lg transition"
              >
                Create a New Account
              </Link>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <Link href="/" className="flex justify-center mt-6 text-amber-400 hover:text-amber-300">
          <ArrowLeft size={16} className="mr-1" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
