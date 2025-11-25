"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) {
      setError("Invalid or missing reset code. Please request a new password reset.");
    }
  }, [code]);

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isValid = passwordsMatch && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !code) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          password,
          passwordConfirmation: confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error?.message || "Something went wrong. Try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!code) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-amber-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/20 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Link</h1>
          <p className="text-slate-400 mb-6">This reset link is invalid or expired.</p>
          <Link href="/forgot-password" className="px-6 py-3 bg-amber-500 text-slate-900 rounded-lg">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted  flex items-center justify-center px-4 relative">
      {/* Decorations */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-amber-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md bg-background-900 border border-amber-500/20 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Password</h1>
          <p className="text-slate-400">Enter your new password below</p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="text-slate-200 text-sm">New Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full px-4 py-3 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  placeholder="Min 8 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="text-slate-200 text-sm">Confirm Password</label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="w-full px-4 py-3 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  placeholder="Repeat password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <p className={`text-xs mt-2 ${passwordsMatch ? "text-green-400" : "text-red-400"}`}>
                  {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
                </p>
              )}
            </div>

            <button
              disabled={loading || !isValid}
              className="w-full py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>

            <Link href="/login" className="flex justify-center mt-4 text-amber-400">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircle size={48} className="text-green-400 mx-auto" />
            <h2 className="text-white text-xl font-bold">Password Updated!</h2>
            <Link href="/login" className="block w-full py-3 bg-amber-500 text-slate-900 rounded-lg">
              Login Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
