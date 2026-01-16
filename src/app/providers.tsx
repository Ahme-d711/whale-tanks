"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { getQueryClient } from "@/utils/queryClient";
import AuthProvider from "@/providers/AuthProvider";
import { User } from "@/features/auth/types";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const queryClient = getQueryClient();

// Core providers that don't need auth data - used globally
export function CoreProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
    </QueryClientProvider>
  );
}

export function Providers({
  children,
  data,
}: {
  children: React.ReactNode;
  data: { token?: string | null; user: User | null };
}) {
  const pathname = usePathname();
  // Check if pathname ends with /login or /signup (works with locale prefixes)
  const isLoginPage = pathname.endsWith("/login") || pathname.endsWith("/signup") || pathname.endsWith("/ai");
  return (
    <AuthProvider user={data?.user ?? null} token={data?.token ?? null}>
      {!isLoginPage && <Navbar />}
      {children}
    </AuthProvider>
  );
}
