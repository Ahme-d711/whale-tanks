"use client"

import { useState, useRef, useCallback } from 'react'

export interface IdeaAnalyzerState {
  ideaText: string
  attachments: File[]
  isRecording: boolean
}

export const useIdeaAnalyzer = (onSendCallback?: (data: any) => void) => {
  const [ideaText, setIdeaText] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
          setAttachments(prev => [...prev, file])
          stream.getTracks().forEach(track => track.stop())
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (err) {
        console.error("Mic error:", err)
      }
    }
  }, [isRecording])

  const handleFilesSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setAttachments(prev => [...prev, ...files])
      e.target.value = '' // Reset input
    }
  }, [])

  const handleFilesSelectedDirect = useCallback((files: File[]) => {
    setAttachments(prev => [...prev, ...files])
  }, [])

  const handleRemoveAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleSend = useCallback(() => {
    const data = {
      text: ideaText,
      attachments: attachments.map(f => ({ name: f.name, size: f.size, type: f.type })),
      timestamp: new Date().toISOString()
    }
    
    if (onSendCallback) {
      onSendCallback(data)
    }

    setIdeaText('')
    setAttachments([])
  }, [ideaText, attachments, onSendCallback])

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return {
    ideaText,
    setIdeaText,
    attachments,
    isRecording,
    fileInputRef,
    handleToggleRecording,
    handleFilesSelected,
    handleFilesSelectedDirect,
    handleRemoveAttachment,
    handleSend,
    triggerFileInput
  }
}
