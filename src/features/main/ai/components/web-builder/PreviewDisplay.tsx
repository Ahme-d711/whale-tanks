"use client"

import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from 'next-intl'

type DeviceMode = "desktop" | "tablet" | "mobile"

interface PreviewDisplayProps {
  deviceMode: DeviceMode
  iframeSrc: string
  isReloading: boolean
  iframeKey: number
}

const deviceConfigs = {
  desktop: { width: "100%" },
  tablet: { width: "768px" },
  mobile: { width: "375px" },
}

export default function PreviewDisplay({
  deviceMode,
  iframeSrc,
  isReloading,
  iframeKey
}: PreviewDisplayProps) {
  const t = useTranslations('WebBuilder')
  return (
    <div className={cn(
      "flex-1 overflow-auto flex justify-center relative transition-colors duration-700",
      deviceMode === "desktop" ? "bg-white p-0" : "bg-zinc-100 p-4 md:p-8"
    )}>
      <AnimatePresence mode="wait">
        {isReloading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-600 uppercase">{t('updating_preview')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={deviceMode}
        initial={false}
        animate={{ 
          width: deviceConfigs[deviceMode].width,
          height: deviceMode === "desktop" ? "100%" : "calc(100% - 40px)"
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "bg-white relative overflow-hidden transition-all duration-500",
          deviceMode !== "desktop" ? "shadow-2xl rounded-[2rem] border-12px border-zinc-900 m-auto" : "shadow-none"
        )}
      >
        {deviceMode !== "desktop" && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-xl z-20 flex items-center justify-center">
            <div className="w-12 h-1 bg-zinc-800 rounded-full" />
          </div>
        )}

        <iframe
          key={iframeKey}
          srcDoc={iframeSrc}
          title="Preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
        />

        {deviceMode !== "desktop" && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-zinc-900 rounded-full z-20 opacity-20" />
        )}
      </motion.div>
    </div>
  )
}
