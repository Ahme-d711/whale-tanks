"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "motion/react";
import { Home, AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 text-center relative z-10">
      <head>
        <title>{t("title")}</title>
        <meta name="description" content={t("description")} />
      </head>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-background/40 backdrop-blur-xl border border-border/50 p-8 rounded-2xl shadow-2xl ring-1 ring-white/10"
      >
        {/* 404 Icon/Text */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        >
          <AlertCircle className="w-12 h-12 text-primary" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl font-poppins mb-4 bg-linear-to-r from-slate-900 via-blue-900 to-blue-700 dark:from-white dark:via-blue-100 dark:to-blue-300 bg-clip-text text-transparent"
        >
          {t("title")}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-base text-muted-foreground mb-8 leading-relaxed"
        >
          {t("description")}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            {t("back_home")}
          </Link>
        </motion.div>
      </motion.div>

      {/* Giant background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 opacity-[0.03] dark:opacity-[0.02] font-black text-[20vw] select-none text-slate-900 dark:text-white">
        404
      </div>
    </div>
  );
}
