"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Resend Verification UI
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState<null | "sending" | "sent" | "failed">(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      const msg = err.message || "Invalid email or password";

      // Detect "Email not confirmed"
      if (msg.toLowerCase().includes("confirm")) {
        setShowResend(true);
        setError("Your email is not verified yet. Please confirm your email.");
      } else {
        setError(msg);
      }
    }

    setLoading(false);
  };

  const handleResend = async () => {
    setResendStatus("sending");
    try {
      const res = await fetch("/api/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setResendStatus("sent");
      } else {
        setResendStatus("failed");
      }
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
        <div className="backdrop-blur-xl bg-background-900/60 border border-amber-500/20 shadow-2xl rounded-2xl p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <span className="text-amber-400 text-sm font-semibold">NILE TRAVEL</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400 mt-1">Log in to continue your journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-center text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-background text-forground outline-none border border-slate-700 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-background text-forground outline-none border border-slate-700 focus:border-amber-500"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-amber-400 transition"
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-sm">
              <Link href="/forgot-password" className="text-amber-400 hover:text-amber-300 transition">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 disabled:opacity-50 text-slate-900 font-semibold rounded-lg transition flex justify-center items-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Resend Verification Section */}
          {showResend && (
            <div className="mt-6 bg-slate-800 p-4 rounded-lg text-center space-y-3">
              <p className="text-slate-300 text-sm">
                Didn’t receive your verification email? 
              </p>

              <button
                onClick={handleResend}
                disabled={resendStatus === "sending"}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
              >
                {resendStatus === "sending" ? "Sending..." : "Resend Verification Email"}
              </button>

              {resendStatus === "sent" && (
                <p className="text-green-400 text-sm">✅ Verification email sent successfully.</p>
              )}

              {resendStatus === "failed" && (
                <p className="text-red-400 text-sm">❌ Could not send email. Try again later.</p>
              )}
            </div>
          )}

          <p className="text-center text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-semibold">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
