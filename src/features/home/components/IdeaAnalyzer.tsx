"use client"

import React from 'react'
import { motion } from "motion/react"
import { AnalyzerInput } from './analyzer/AnalyzerInput'
import { AnalyzerToolbar } from './analyzer/AnalyzerToolbar'

export const IdeaAnalyzer = () => {
  const [ideaText, setIdeaText] = React.useState('')
  const maxChars = 500

  return (
    <section className="relative z-10 px-4 pb-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-background rounded-3xl p-6 shadow-lg border border-border border-t-4 border-t-primary"
      >
        <AnalyzerInput 
          value={ideaText} 
          onChange={setIdeaText} 
          maxLength={maxChars} 
        />
        <AnalyzerToolbar />
      </motion.div>
    </section>
  )
}

