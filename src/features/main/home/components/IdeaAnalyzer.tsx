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
            containerClassName="rounded-[28px] shadow-lg overflow-hidden"
            className="bg-background rounded-[28px] px-4 py-3 flex items-end min-h-[60px]"
            borderWidth={1.5}
            duration={10}
          >
            <div className="flex-1 flex items-center gap-3">
              <AnalyzerInput 
                value={ideaText} 
                onChange={setIdeaText} 
                attachments={attachments}
                onRemoveAttachment={handleRemoveAttachment}
                compact
              />
            </div>
            
            <AnalyzerToolbar 
              isRecording={isRecording}
              onToggleRecording={handleToggleRecording}
              triggerFileInput={triggerFileInput}
              onSend={handleSend}
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
              onlyActions
            />
          </AnimatedBorder>

          <AnalyzerToolbar 
            executionType={executionType}
            setExecutionType={setExecutionType}
            analysisType={analysisType}
            setAnalysisType={setAnalysisType}
            models={models}
            selectedModelId={selectedModelId}
            setSelectedModelId={setSelectedModelId}
            onlySelects
          />
        </div>
      </motion.div>
    </section>
  )
}
