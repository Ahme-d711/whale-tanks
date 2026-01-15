"use client"
import React from 'react'
import { motion } from "motion/react"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Info, Mic, ArrowUpRight, CirclePlus } from 'lucide-react'

export const IdeaAnalyzer = () => {
  const [ideaText, setIdeaText] = React.useState('')
  const maxChars = 500

  return (
    <section className="relative z-10 px-4 pb-32 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-background rounded-3xl p-8 shadow-lg border border-border border-t-4 border-t-primary"
      >
        {/* Title and Counter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-normal text-secondary-foreground">
            Analyze Your Idea Before You Build Anything
          </h2>
          <div className="flex items-center gap-2 text-base font-medium text-foreground">
            <span>{ideaText.length}/{maxChars}</span>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted">
              <Info className="w-5! h-5! cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-6">
          <textarea
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value.slice(0, maxChars))}
            className="w-full h-32 p-0 border-0 focus:outline-none resize-none bg-transparent text-foreground placeholder:text-muted-foreground/50"
            maxLength={maxChars}
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
            <span className="text-base font-medium">Startup</span>
          </Button>
          <Button
            variant="ghost"
            className="h-12 px-4 gap-2 bg-border hover:bg-border/80 text-foreground rounded-2xl cursor-pointer"
          >
            <Image src="/tech-logo.svg" alt="Tech" width={20} height={20} className="object-contain" />
            <span className="text-base font-medium">Tech</span>
          </Button>
          <Button
            variant="ghost"
            className="h-12 px-4 gap-2 bg-border hover:bg-border/80 text-foreground rounded-2xl cursor-pointer"
          >
            <Image src="/logo.svg" alt="Investor" width={20} height={20} className="object-contain" />
            <span className="text-base font-medium">Investor</span>
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
          
          <div className=" bg-border hover:bg-border/80 rounded-2xl p-1">
            <Button
              variant="ghost"
              className="h-10 px-5 rounded-xl text-foreground gap-2 cursor-pointer"
            >
              <span className="text-base font-medium">Send</span>
              <ArrowUpRight className="w-6! h-6! rounded-md" />
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
