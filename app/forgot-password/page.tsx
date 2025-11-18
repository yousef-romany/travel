"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { useAuth } from "@/context/AuthContext" // ✅ important

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth() // ✅ call from context
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await forgotPassword(email) // ✅ Replace fetch with context method
      setSubmitted(true)
    } catch (err: any) {
      alert(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-amber-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-background border border-amber-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

          <div className="mb-8 text-center">
            <div className="inline-block mb-4 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <span className="text-amber-400 text-sm font-semibold">NILE TRAVEL</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-slate-400">Enter your email to receive reset instructions</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-900 font-semibold rounded-lg transition-all duration-300 mt-6"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-amber-400 hover:text-amber-300 font-medium mt-4"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-full">
                  <Mail size={32} className="text-amber-400" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
              <p className="text-slate-400">
                We've sent password reset instructions to <span className="text-amber-400 font-semibold">{email}</span>
              </p>

              <div className="space-y-3 mt-6">
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold rounded-lg transition-all duration-300"
                >
                  Try Another Email
                </button>

                <Link
                  href="/login"
                  className="block py-3 border border-slate-700/50 text-white font-semibold rounded-lg hover:bg-slate-800/50 transition-all duration-300 text-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
