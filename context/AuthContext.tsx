"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  username: string;
  profile?: any;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
  setLoading(true);
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    setLoading(false);
    throw new Error(data?.error?.message || "Login failed");
  }

  // ✅ هنا التعديل المهم
  if (!data.user.confirmed) {
    setLoading(false);
    throw new Error("Please verify your email before logging in.");
  }

  localStorage.setItem("token", data.jwt);
  localStorage.setItem("user", JSON.stringify(data.user));
  setUser(data.user);
  setLoading(false);
};


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
