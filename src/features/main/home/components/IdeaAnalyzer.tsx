"use client"

import React from 'react'
import { motion } from "motion/react"
import { AnalyzerInput } from './analyzer/AnalyzerInput'
import { AnalyzerToolbar } from './analyzer/AnalyzerToolbar'
import AnimatedBorder from "@/components/shared/AnimatedBorder"
import { useIdeaAnalyzer } from '@/hooks/useIdeaAnalyzer'
import { useRouter } from '@/i18n/routing'


export const IdeaAnalyzer = () => {
  const router = useRouter()
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
    fileInputRef,
    isLoading,
    executionType,
    setExecutionType,
    analysisType,
    setAnalysisType,
    models,
    selectedModelId,
    setSelectedModelId
  } = useIdeaAnalyzer((data) => {
    console.log("Sending Idea Data:", data)
  })

  const onActionSend = () => {
    if (!ideaText.trim()) return
    router.push(`/ai?q=${encodeURIComponent(ideaText.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onActionSend()
    }
  }

  return (
    <section className="relative z-10 px-4 lg:px-0 mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <div className="flex flex-col gap-4">
          <AnimatedBorder 
            containerClassName="rounded-[28px] md:rounded-[40px] shadow-2xl overflow-hidden w-full mx-auto"
            className="bg-background rounded-[28px] md:rounded-[36px] px-4 py-3 md:px-10 md:py-6 flex flex-col min-h-[65px] md:min-h-[210px] gap-4 md:gap-5"
            borderWidth={1.5}
            duration={10}
          >
            <div className="flex-1 flex w-full">
              <AnalyzerInput 
                value={ideaText} 
                onChange={setIdeaText} 
                attachments={attachments}
                onRemoveAttachment={handleRemoveAttachment}
                compact={false}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <AnalyzerToolbar 
              isRecording={isRecording}
              onToggleRecording={handleToggleRecording}
              triggerFileInput={triggerFileInput}
              onSend={onActionSend}
              fileInputRef={fileInputRef}
              onFilesSelectedDirect={handleFilesSelectedDirect}
              isLoading={isLoading}
              executionType={executionType}
              setExecutionType={setExecutionType}
              analysisType={analysisType}
              setAnalysisType={setAnalysisType}
              models={models}
              selectedModelId={selectedModelId}
              setSelectedModelId={setSelectedModelId}
              className="w-full"
            />
          </AnimatedBorder>

        </div>
      </motion.div>
    </section>
  )
}
