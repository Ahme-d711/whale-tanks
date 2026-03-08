"use client"

import React from 'react'
import { motion } from "motion/react"
import { AnalyzerInput } from './analyzer/AnalyzerInput'
import { AnalyzerToolbar } from './analyzer/AnalyzerToolbar'
import AnimatedBorder from "@/components/shared/AnimatedBorder"
import { useIdeaAnalyzer } from '@/hooks/useIdeaAnalyzer'


export const IdeaAnalyzer = () => {
  const {
    ideaText,
    setIdeaText,
    attachments,
    isRecording,
    handleToggleRecording,
    handleFilesSelected,
    handleFilesSelectedDirect,
    handleRemoveAttachment,
    handleSend,
    triggerFileInput,
    fileInputRef
  } = useIdeaAnalyzer((data) => {
    console.log("Sending Idea Data:", data)
  })

  return (
    <section className="relative z-10 px-4 lg:px-0 mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <AnimatedBorder 
          containerClassName="rounded-3xl shadow-lg overflow-hidden"
          className="bg-background rounded-3xl p-6"
          borderWidth={3.5}
          duration={10}
        >
          <AnalyzerInput 
            value={ideaText} 
            onChange={setIdeaText} 
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
          />
          <AnalyzerToolbar 
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
            triggerFileInput={triggerFileInput}
            onSend={handleSend}
            fileInputRef={fileInputRef}
            onFilesSelectedDirect={handleFilesSelectedDirect}
          />
        </AnimatedBorder>
      </motion.div>
    </section>
  )
}
