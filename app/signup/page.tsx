"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { trackAuth } from "@/lib/analytics";

export default function SignupPage() {
  const { signup } = useAuth();

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

  const isMatch = formData.password === formData.confirmPassword;
  const isValid = formData.email && formData.password && formData.confirmPassword && isMatch && formData.agreeTerms;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await signup(formData.email, formData.password);
      trackAuth("signup");
      // Signup function handles redirect internally
      setLoading(false);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Signup failed.");
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background-950 to-muted-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-background-900/60 border border-amber-500/20 rounded-2xl p-8 shadow-xl animate-slide-up">
        <h1 className="text-3xl font-bold text-white text-center mb-2 animate-fade-in">Create Account</h1>
        <p className="text-slate-400 text-center mb-6 animate-fade-in animate-delay-100">Create your account to continue</p>

        {errorMsg && <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 mb-4 rounded animate-slide-down">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-slide-up animate-delay-200">
            <label>Email</label>
            <input name="email" type="email" required placeholder="your@email"
              value={formData.email} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background border border-slate-700 focus:border-amber-500 transition-smooth" />
          </div>

          <div className="relative animate-slide-up animate-delay-300">
            <label>Password</label>
            <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
              required value={formData.password} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background border border-slate-700 focus:border-amber-500 transition-smooth" />
            <button type="button" className="absolute right-3 top-[38px]" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative animate-slide-up animate-delay-400">
            <label>Confirm Password</label>
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="••••••••"
              required value={formData.confirmPassword} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background border border-slate-700 focus:border-amber-500 transition-smooth" />
            <button type="button" className="absolute right-3 top-[38px]" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <label className="flex items-center gap-2 text-slate-400 text-sm animate-slide-up animate-delay-500">
            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} />
            I agree to the Terms & Conditions
          </label>

          <button disabled={!isValid || loading} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg disabled:opacity-50 transition-smooth animate-slide-up animate-delay-600 hover-glow">
            {loading ? <Loader className="animate-spin mx-auto" /> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm animate-fade-in animate-delay-700">
          Already have an account? <Link href="/login" className="text-amber-400 hover:text-amber-300">Login</Link>
        </p>
      </div>
    </div>
  );
}
