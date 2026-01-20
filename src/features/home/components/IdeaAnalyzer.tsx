"use client"

import React from 'react'
import { motion } from "motion/react"
import { AnalyzerInput } from './analyzer/AnalyzerInput'
import { AnalyzerToolbar } from './analyzer/AnalyzerToolbar'
import AnimatedBorder from "@/components/shared/AnimatedBorder"


export const IdeaAnalyzer = () => {
  const [ideaText, setIdeaText] = React.useState('')
  const [isRecording, setIsRecording] = React.useState(false)
  const [recordings, setRecordings] = React.useState<Blob[]>([])
  const [attachments, setAttachments] = React.useState<File[]>([])
  const maxChars = 500

  const handleStartRecording = () => {
    setIsRecording(true)
    // Here we would implement MediaRecorder logic to start capturing audio
    // For UI simulation:
    console.log("Started recording")
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    // Here we would stop MediaRecorder and get the blob
    // Simulating a blob:
    const mockBlob = new Blob(["mock audio"], { type: "audio/webm" })
    setRecordings(prev => [...prev, mockBlob])
    console.log("Stopped recording and saved blob")
  }

  const handleFilesSelected = (files: File[]) => {
    setAttachments(prev => [...prev, ...files])
    console.log("Attachments added:", files)
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
        <AnimatedBorder 
          containerClassName="rounded-3xl shadow-lg overflow-hidden"
          className="bg-background rounded-3xl p-6"
          borderWidth={3.5}
          duration={10}
        >
          <AnalyzerInput 
            value={ideaText} 
            onChange={setIdeaText} 
            maxLength={maxChars}
            attachments={attachments}
            onRemoveAttachment={(index) => {
              const newAttachments = [...attachments]
              newAttachments.splice(index, 1)
              setAttachments(newAttachments)
            }}
          />
          <AnalyzerToolbar 
            isRecording={isRecording}
            onToggleRecording={() => isRecording ? handleStopRecording() : handleStartRecording()}
            onFilesSelected={handleFilesSelected}
          />
        </AnimatedBorder>
      </motion.div>
    </section>
  )
}

