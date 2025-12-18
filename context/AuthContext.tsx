"use client";

import { createContext, useContext, useEffect, useState } from "react";

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
  avatar?: {
    url: string;
  } | string;
};

type User = {
  id: number;
  documentId?: string;
  email: string;
  username: string;
  profile?: UserProfile;
  createdAt?: string;
  token: string; // ✅ مهم
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, referralCode?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (code: string, password: string, passwordConfirmation: string) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user on refresh
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();

        const rawUser = await res.json();
        setUser({ ...rawUser, token });
      } catch (err) {
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ✅ LOGIN
  const login = async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Login failed");

    localStorage.setItem("authToken", data.jwt);

    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=profile`,
      { headers: { Authorization: `Bearer ${data.jwt}` } }
    );
    const rawUser = await userRes.json();

    setUser({ ...rawUser, token: data.jwt });

    // ✅ Redirect
    if (rawUser.profile?.isProfileCompleted) {
      window.location.href = "/";
    } else {
      window.location.href = "/complete-profile";
    }
  };

  // ✅ SIGNUP
  const signup = async (email: string, password: string, referralCode?: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Signup failed");

    localStorage.setItem("authToken", data.jwt);

    // Create profile
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.jwt}`,
      },
      body: JSON.stringify({
        data: { user: data.user.id, isProfileCompleted: false },
      }),
    });

    // If referral code provided, process it
    if (referralCode) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/referrals/use-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.jwt}`,
          },
          body: JSON.stringify({
            referralCode: referralCode,
            newUserId: data.user.documentId,
          }),
        });
      } catch (error) {
        // Don't fail signup if referral code fails
        // Silently continue - referral code is optional
      }
    }

    setUser({ ...data.user, token: data.jwt });
    window.location.href = "/email-confirmation";
  };

  // ✅ Forgot Password
  const forgotPassword = async (email: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  };

  // ✅ Reset Password
  const resetPassword = async (code: string, password: string, passwordConfirmation: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, password, passwordConfirmation }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Reset failed");

    localStorage.setItem("authToken", data.jwt);

    setUser({ ...data.user, token: data.jwt });
    window.location.href = "/";
  };

  // ✅ Resend Confirmation
  const resendConfirmation = async (email: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/send-email-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.href = "/login";
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
