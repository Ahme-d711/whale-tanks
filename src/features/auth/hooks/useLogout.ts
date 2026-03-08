"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";

interface UseLogoutReturn {
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useLogout(): UseLogoutReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearAuth } = useAuthStore((state) => state);
  const router = useRouter();

  const logout = async () => {
    setLoading(true);
    setError(null);


      
      // Clear the auth store
      clearAuth();

      // Use router.replace for client-side navigation without page refresh
      router.replace("/login");
  };

  return { logout, loading, error };
}

