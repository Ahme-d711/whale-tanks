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

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecordings(prev => [...prev, audioBlob])
        
        // Add to attachments as well if we want them to show up there
        const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
        setAttachments(prev => [...prev, file])
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      console.log("Actual recording started")
    } catch (err) {
      console.error("Error accessing microphone:", err)
      setIsRecording(false)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      console.log("Actual recording stopped")
    }
  }

  const handleFilesSelected = (files: File[]) => {
    setAttachments(prev => [...prev, ...files])
    console.log("Attachments added:", files)
  }

  const handleSend = () => {
    console.log("Sending Idea Data:", {
      text: ideaText,
      attachments: attachments.map(f => ({ name: f.name, size: f.size, type: f.type })),
      tankId: "startup", // Mock tankId for now as it's not stateful yet in this component
      timestamp: new Date().toISOString()
    })
    // Reset state after sending
    setIdeaText('')
    setAttachments([])
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
            onSend={handleSend}
          />
        </AnimatedBorder>
      </motion.div>
    </section>
  )
}

