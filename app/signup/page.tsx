"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
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

  function handleChange(e: any) {
    const { name, type, value, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e: any) {
  e.preventDefault();
  setLoading(true);
  setErrorMsg("");

  const result = await signup(formData.email, formData.password);

  if (!result.success) {
    setErrorMsg(result.message || "Signup failed.");
    setLoading(false);
    return;
  }

  router.push("/email-confirmation");
  setLoading(false);
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-background-950 to-muted-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-background-900/60 border border-amber-500/20 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Create Account</h1>
        <p className="text-slate-400 text-center mb-6">Create your account to continue</p>

        {errorMsg && <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 mb-4 rounded">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label>Email</label>
            <input name="email" type="email" required placeholder="your@email"
              value={formData.email} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background border border-slate-700 focus:border-amber-500" />
          </div>

          <div className="relative">
            <label>Password</label>
            <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
              required value={formData.password} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background border border-slate-700 focus:border-amber-500" />
            <button type="button" className="absolute right-3 top-[38px]" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <label>Confirm Password</label>
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="••••••••"
              required value={formData.confirmPassword} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background border border-slate-700 focus:border-amber-500" />
            <button type="button" className="absolute right-3 top-[38px]" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <label className="flex items-center gap-2 text-slate-400 text-sm">
            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} />
            I agree to the Terms & Conditions
          </label>

          <button disabled={!isValid || loading} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg disabled:opacity-50">
            {loading ? <Loader className="animate-spin mx-auto" /> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account? <Link href="/login" className="text-amber-400 hover:text-amber-300">Login</Link>
        </p>
      </div>
    </div>
  );
}
