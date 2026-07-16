"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserProfile = {
  id: number;
  documentId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  city?: string;
  country?: string;
  isProfileCompleted?: boolean;
  role?: string;
  avatar?: { url: string } | string;
};

type User = {
  id: number;
  documentId?: string;
  email: string;
  username: string;
  profile?: UserProfile;
  createdAt?: string;
  /** JWT kept in-memory only — never written to localStorage */
  token: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, redirectUrl?: string) => Promise<void>;
  signup: (email: string, password: string, referralCode?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (code: string, password: string, passwordConfirmation: string) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Hydrate session on mount via httpOnly cookie (no localStorage)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUser(data.user);
        }
      } catch {
        // Network error — treat as logged out
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // ✅ LOGIN — calls server route that sets httpOnly cookie
  const login = async (email: string, password: string, redirectUrl = "/") => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Login failed");

    setUser(data.user);

    // ✅ Respect the ?redirect= param; fall through to profile check
    if (!data.user.profile?.isProfileCompleted) {
      router.push("/complete-profile");
    } else {
      router.push(redirectUrl);
    }
  };

  // ✅ SIGNUP — auto-confirms, no email verification step
  const signup = async (email: string, password: string, referralCode?: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, referralCode }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Signup failed");

    // Cookie already set server-side — hydrate client state
    setUser(data.user);
    // Send to profile setup wizard (can be skipped)
    router.push("/complete-profile");
  };

  // ✅ FORGOT PASSWORD — now properly surfaces errors
  const forgotPassword = async (email: string) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.error || "Failed to send reset email");
    }
  };

  // ✅ RESET PASSWORD — sets new session cookie via server route
  const resetPassword = async (
    code: string,
    password: string,
    passwordConfirmation: string
  ) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code, password, passwordConfirmation }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Reset failed");

    setUser(data.user);
    router.push("/");
  };

  // ✅ RESEND CONFIRMATION — now surfaces errors
  const resendConfirmation = async (email: string) => {
    const res = await fetch("/api/auth/send-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.error || "Failed to resend confirmation");
    }
  };

  // ✅ LOGOUT — clears httpOnly cookie server-side
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, forgotPassword, resetPassword, resendConfirmation, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
