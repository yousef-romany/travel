"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { trackAuth } from "@/lib/analytics";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login, resendConfirmation } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState("");

  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState<null | "sending" | "sent" | "failed">(null);

  // ✅ لو المستخدم مسجّل → حوله على الصفحة المطلوبة أو /me
  useEffect(() => {
    if (!loading && user) {
      const redirectUrl = searchParams.get("redirect") || "/me";
      router.push(redirectUrl);
    }
  }, [user, loading, router, searchParams]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBtn(true);
    setError("");

    try {
      await login(email, password);
      trackAuth("login");
      // 🚀 AuthContext بالفعل بيعمل redirect
    } catch (err: any) {
      const msg = err.message || "Invalid email or password";

      if (msg.toLowerCase().includes("confirm")) {
        setShowResend(true);
        setError("Your email is not verified yet. Please confirm your email.");
      } else {
        setError(msg);
      }
    }

    setLoadingBtn(false);
  };

  const handleResend = async () => {
    setResendStatus("sending");
    try {
      await resendConfirmation(email);
      setResendStatus("sent");
    } catch {
      setResendStatus("failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-950 to-muted-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Glow background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-background-900/60 border border-amber-500/20 shadow-2xl rounded-2xl p-8 animate-slide-up">

          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-block mb-4 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <span className="text-amber-400 text-sm font-semibold">NILE TRAVEL</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400 mt-1">Log in to continue your journey</p>
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-center text-sm mb-4 animate-slide-down">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="animate-slide-up animate-delay-200">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-background text-forground outline-none border border-slate-700 focus:border-amber-500 transition-smooth"
                required
              />
            </div>

            <div className="animate-slide-up animate-delay-300">
              <label className="block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-background text-forground outline-none border border-slate-700 focus:border-amber-500 transition-smooth"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-amber-400 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-sm animate-slide-up animate-delay-400">
              <Link href="/forgot-password" className="text-amber-400 hover:text-amber-300 transition">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 disabled:opacity-50 text-slate-900 font-semibold rounded-lg transition-smooth flex justify-center items-center gap-2 animate-slide-up animate-delay-500 hover-glow"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Resend verification */}
          {showResend && (
            <div className="mt-6 bg-slate-800 p-4 rounded-lg text-center space-y-3 animate-slide-down">
              <p className="text-slate-300 text-sm">
                Didn't receive the verification email?
              </p>

              <button
                onClick={handleResend}
                disabled={resendStatus === "sending"}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
              >
                {resendStatus === "sending" ? "Sending..." : "Resend Verification Email"}
              </button>

              {resendStatus === "sent" && <p className="text-green-400 text-sm">✅ Email sent.</p>}
              {resendStatus === "failed" && <p className="text-red-400 text-sm">❌ Failed, try later.</p>}
            </div>
          )}

          <p className="text-center text-slate-400 mt-6 animate-fade-in animate-delay-600">
            Don't have an account?
            <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-semibold"> Create one</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="animate-spin" size={28} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
