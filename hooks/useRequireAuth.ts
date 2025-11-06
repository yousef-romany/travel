"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const useRequireAuth = () => {
  const { user } = useAuth();
  const router = useRouter();

  const requireAuth = () => {
    if (!user) {
      router.push("/login"); // أو /auth
      return false;
    }
    return true;
  };

  return requireAuth;
};
