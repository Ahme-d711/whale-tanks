"use client";

import { useAuthStore } from "@/features/auth/stores/authStore";
import { User } from "@/features/auth/types";
import { ReactNode, useEffect } from "react";
import { useProfile } from "@/features/auth/hooks/useAuth";

export default function AuthProvider({
  token,
  user,
  children,
}: {
  token: string | null;
  user: User | null;
  children: ReactNode;
}) {
  const { setUser, setToken, token: storeToken, user: storeUser, clearAuth } = useAuthStore((state) => state);

  useEffect(() => {
    if (token) {
      setToken(token);
    }
    if (user) {
      setUser(user);
    }
  }, [token, user, setUser, setToken]);

  const { data: profile, isError } = useProfile(!!storeToken && !storeUser);

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile, setUser]);

  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError, clearAuth]);

  return <>{children}</>;
}
