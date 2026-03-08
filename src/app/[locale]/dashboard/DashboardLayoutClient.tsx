"use client";

import { Sidebar } from "@/components/sidebar";
import { motion } from "motion/react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { Suspense } from "react";
import { useLocale } from "next-intl";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="flex h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <Sidebar />
      <div className="flex flex-1 flex-col bg-background overflow-hidden font-sans">
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            <div className="relative z-40 overflow-visible!">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-visible!"
              >
                <Suspense fallback={null}>
                  <DashboardNavbar />
                </Suspense>
              </motion.div>
            </div>
          <div className="relative z-0">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <main className="mt-8">{children}</main>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
