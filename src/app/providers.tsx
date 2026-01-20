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
  const isLoginPage = pathname.endsWith("/login") || pathname.endsWith("/signup") || pathname.endsWith("/ai");
  const isDashboardPage = pathname.includes("/dashboard");
  
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <AuthProvider user={data?.user ?? null} token={data?.token ?? null}>
      {!isLoginPage ? (
        <div className="flex min-h-screen z-101">
          {isDashboardPage && (
            <SidebarMenu 
              isOpen={isSidebarOpen} 
              onOpenChange={setIsSidebarOpen}
              trigger={<></>}
              isPersistent={true}
            />
          )}
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
