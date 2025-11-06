"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.password !== "";

  const isFormValid =
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    passwordsMatch &&
    formData.agreeTerms;

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/local/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.email, // ممكن تغيرها لو عندك اسم
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data?.error?.message || "Signup failed.");
        setLoading(false);
        return;
      }

      // ✅ Redirect to "Check Email"
      router.push("/email-confirmation");

    } catch (err: any) {
      setErrorMsg("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
        <div className="min-h-screen bg-gradient-to-br from-background-950  to-muted-950 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Glow background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
      </div>
      <div className="w-full max-w-md bg-background-900/60 border border-amber-500/20 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Create Account</h1>
        <p className="text-slate-400 text-center mb-6">
          Create your account to continue
        </p>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 mb-4 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              placeholder="zoeholidays@gmail.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background text-forground outline-none border border-slate-700 focus:border-amber-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="mb-1 block">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background text-forground outline-none border border-slate-700 focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="mb-1 block">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background text-forground outline-none border border-slate-700 focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-[38px] text-slate-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Terms */}
          <label className="flex items-center text-slate-400 gap-2 text-sm">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            I agree to the Terms & Conditions
          </label>

          {/* Submit */}
          <button
            disabled={!isFormValid || loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin mx-auto" /> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-400 hover:text-amber-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
