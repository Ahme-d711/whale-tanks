"use client"
import React from 'react'
import { motion } from "motion/react"
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Info, Mic, ArrowUpRight, CirclePlus } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export const IdeaAnalyzer = () => {
  const t = useTranslations('HomePage.Analyzer')
  const [ideaText, setIdeaText] = React.useState('')
  const maxChars = 500

  return (
    <section className="relative z-10 px-4 pb-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-background rounded-3xl p-8 shadow-lg border border-border border-t-4 border-t-primary"
      >
        <div className="relative mb-6">
          <div className="absolute top-0 right-0 flex items-center gap-1 text-sm font-medium text-foreground select-none">
            <span>{ideaText.length}/{maxChars}</span>
            <div className="w-6 h-6 flex items-center justify-center rounded-full text-foreground">
              <Info className="w-3.5 h-3.5" />
            </div>
          </div>

          <Textarea
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value.slice(0, maxChars))}
            className="w-full min-h-50 placeholder:text-secondary-foreground p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none bg-transparent text-2xl! font-normal text-foreground leading-tight pr-20 shadow-none"
            maxLength={maxChars}
            placeholder={t('title')}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {/* Tank Selection Buttons */}
          <Button
            variant="ghost"
            className="h-12 px-4 gap-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl cursor-pointer"
          >
            <Image src="/startup-logo.svg" alt="Startup" width={20} height={20} className="object-contain" />
            <span className="text-base font-medium">{t('startup')}</span>
          </Button>
          <Button
            variant="ghost"
            className="h-12 px-4 gap-2 bg-border hover:bg-border/80 text-foreground rounded-2xl cursor-pointer"
          >
            <Image src="/tech-logo.svg" alt="Tech" width={20} height={20} className="object-contain" />
            <span className="text-base font-medium">{t('tech')}</span>
          </Button>
          <Button
            variant="ghost"
            className="h-12 px-4 gap-2 bg-border hover:bg-border/80 text-foreground rounded-2xl cursor-pointer"
          >
            <Image src="/logo.svg" alt="Investor" width={20} height={20} className="object-contain" />
            <span className="text-base font-medium">{t('investor')}</span>
          </Button>

          <div className="flex-1" />

          {/* Action Buttons - Grouped */}
          <div className="flex items-center gap-2 bg-border text-foreground rounded-2xl p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-background cursor-pointer"
            >
              <Mic className="w-6! h-6!" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-background cursor-pointer"
            >
              <CirclePlus className="w-6! h-6!" />
            </Button>
          </div>
          
            <Button
              variant="ghost"
              className="h-10 px-5 rounded-xl text-foreground gap-2 cursor-pointer py-6 bg-border hover:bg-border/80"
            >
              <span className="text-base font-medium">{t('send')}</span>
              <div className="w-6 h-6 flex items-center justify-center rounded-md text-foreground bg-foreground/30">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </Button>
        </div>
      </motion.div>
    </section>
  )
}
