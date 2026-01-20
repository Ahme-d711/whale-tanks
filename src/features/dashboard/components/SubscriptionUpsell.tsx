"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { AnimatedBackground } from '@/components/AnimatedBackground'

export default function SubscriptionUpsell() {
  const t = useTranslations('Dashboard.Subscription')

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-blue-300 w-64 p-5 rounded-[32px] shadow-lg shadow-blue-500/20 group"
    >

      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm shadow-inner overflow-hidden">
          <motion.div
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap className="w-5 h-5 text-white fill-white" />
          </motion.div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-white tracking-tight leading-tight">
            {t('title')}
          </h3>
          <p className="text-[10px] text-blue-50/80 font-medium leading-relaxed px-1">
            {t('subtitle')}
          </p>
        </div>

        <Link href="/dashboard/pricing" className="w-full mt-1">
          <Button 
            className="w-full bg-white text-primary hover:bg-blue-50 font-bold text-[11px] uppercase tracking-widest rounded-2xl h-10 shadow-md group-hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2 fill-primary/20" />
            {t('button')}
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
