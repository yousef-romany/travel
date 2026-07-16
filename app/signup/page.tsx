"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { trackAuth } from "@/lib/analytics";

// ✅ AUTH-05: Password strength rules
const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

function getStrength(password: string) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  if (passed === 0) return { level: "none", color: "bg-slate-700", label: "" };
  if (passed === 1) return { level: "weak", color: "bg-red-500", label: "Weak" };
  if (passed === 2) return { level: "fair", color: "bg-amber-500", label: "Fair" };
  return { level: "strong", color: "bg-green-500", label: "Strong" };
}

function SignupForm() {
  const { signup, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showStrength, setShowStrength] = useState(false);

  const strength = getStrength(formData.password);
  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(formData.password));
  const isMatch = formData.password === formData.confirmPassword;
  const isValid =
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    isMatch &&
    allRulesPassed &&
    formData.agreeTerms;

  // ✅ AUTH-10: Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/me");
    }
  }, [user, loading, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return;

    setLoadingBtn(true);
    setErrorMsg("");

    try {
      await signup(formData.email, formData.password, referralCode || undefined);
      trackAuth("signup");
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Signup failed.");
    } finally {
      setLoadingBtn(false);
    }
  }

  if (loading || user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-950 to-muted-950 flex items-center justify-center">
        <Loader className="animate-spin w-8 h-8 text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-950 to-muted-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-background-900/60 border border-amber-500/20 rounded-2xl p-8 shadow-xl animate-slide-up">
        <h1 className="text-3xl font-bold text-white text-center mb-2 animate-fade-in">Create Account</h1>
        <p className="text-slate-400 text-center mb-6 animate-fade-in animate-delay-100">Create your account to continue</p>

        {referralCode && (
          <div className="bg-green-500/10 border border-green-500 text-green-300 p-3 mb-4 rounded animate-slide-down">
            🎁 Referral code applied: <span className="font-bold">{referralCode}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 mb-4 rounded animate-slide-down">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-slide-up animate-delay-200">
            <label className="block mb-1 text-sm text-slate-300">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background border border-slate-700 focus:border-amber-500 transition-smooth"
            />
          </div>

          {/* ✅ AUTH-05: Password with strength indicator */}
          <div className="animate-slide-up animate-delay-300">
            <label className="block mb-1 text-sm text-slate-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setShowStrength(true)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-slate-700 focus:border-amber-500 transition-smooth"
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-slate-400 hover:text-amber-400 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Strength bar */}
            {showStrength && formData.password && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(PASSWORD_RULES.filter((r) => r.test(formData.password)).length / PASSWORD_RULES.length) * 100}%` }}
                    />
                  </div>
                  {strength.label && (
                    <span className="text-xs text-slate-400">{strength.label}</span>
                  )}
                </div>
                <ul className="space-y-1">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(formData.password);
                    return (
                      <li key={rule.label} className="flex items-center gap-1.5 text-xs">
                        {passed ? (
                          <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" />
                        ) : (
                          <XCircle size={12} className="text-slate-500 flex-shrink-0" />
                        )}
                        <span className={passed ? "text-green-400" : "text-slate-500"}>{rule.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="relative animate-slide-up animate-delay-400">
            <label className="block mb-1 text-sm text-slate-300">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-background border transition-smooth ${
                  formData.confirmPassword && !isMatch
                    ? "border-red-500"
                    : "border-slate-700 focus:border-amber-500"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-slate-400 hover:text-amber-400 transition"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.confirmPassword && !isMatch && (
              <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-slate-400 text-sm animate-slide-up animate-delay-500 cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="accent-amber-500"
            />
            I agree to the{" "}
            <Link href="/terms-and-conditions" className="text-amber-400 hover:text-amber-300 underline">
              Terms &amp; Conditions
            </Link>
          </label>

          <button
            type="submit"
            disabled={!isValid || loadingBtn}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg disabled:opacity-50 transition-smooth animate-slide-up animate-delay-600 hover-glow flex justify-center items-center"
          >
            {loadingBtn ? <Loader className="animate-spin" size={20} /> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm animate-fade-in animate-delay-700">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-400 hover:text-amber-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-background-950 to-muted-950 flex items-center justify-center">
          <Loader className="animate-spin w-8 h-8 text-amber-500" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
