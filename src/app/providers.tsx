"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { getQueryClient } from "@/utils/queryClient";
import AuthProvider from "@/providers/AuthProvider";
import { User } from "@/features/auth/types";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import SidebarMenu from "@/components/SidebarMenu";

import { ConfirmationProvider } from "@/providers/ConfirmationProvider";

const queryClient = getQueryClient();

// Core providers that don't need auth data - used globally
export function CoreProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmationProvider>
        {children}
        <Toaster />
      </ConfirmationProvider>
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
  const isLoginPage = pathname.endsWith("/login") || pathname.endsWith("/signup") || pathname.endsWith("/ai");
  const isDashboardPage = pathname.includes("/dashboard");
  
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <AuthProvider user={data?.user ?? null} token={data?.token ?? null}>
      {!isLoginPage && !isDashboardPage ? (
        <div className="flex min-h-screen z-101">
          <div className="flex-1 flex flex-col min-w-0 relative">
            <Navbar onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)} />
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </AuthProvider>
  );
}
