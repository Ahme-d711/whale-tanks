"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { executionService } from '@/features/dashboard/executions/services/execution.service'
import { ExecuteRequest, ExecuteResponse } from '@/features/dashboard/executions/types/execution.types'
import { modelService } from '@/features/dashboard/models/services/model.service'
import { AIModel } from '@/features/dashboard/models/types/model.types'

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface IdeaAnalyzerState {
  ideaText: string
  attachments: File[]
  isRecording: boolean
}

export const useIdeaAnalyzer = (onSendCallback?: (data: any) => void) => {
  const [ideaText, setIdeaText] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ExecuteResponse | null>(null)
  const [executionType, setExecutionType] = useState<ExecuteRequest["execution_type"]>("chat")
  const [analysisType, setAnalysisType] = useState<string>("all")
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedModelId, setSelectedModelId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await modelService.getModels(true)
        setModels(data)
        if (data.length > 0 && !selectedModelId) {
          // Find if there is a default model or just pick the first from images if exists
          const defaultModel = data.find(m => m.model_id === "3fa85f64-5717-4562-b3fc-2c963f66afa6") || data[0]
          setSelectedModelId(defaultModel.model_id)
        }
      } catch (err) {
        console.error("Error fetching models:", err)
      }
    }
    fetchModels()
  }, [])

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
  const handleSend = useCallback(async () => {
    if (!ideaText.trim()) return;

    const currentMessage = ideaText.trim();
    const isChat = executionType === "chat";

    // Always add user message to history
    setMessages(prev => [...prev, { role: 'user', content: currentMessage, timestamp: Date.now() }]);
    
    setIdeaText('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const requestData: ExecuteRequest = {
        prompt: currentMessage,
        execution_type: executionType,
        model_id: selectedModelId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        analysis_type: executionType === "report" ? analysisType : undefined,
        tier: "free",
        extra: {}
      }

      const response = await executionService.execute(requestData)
      setResult(response)
      
      // Always add the response to messages to ensure it shows up in the UI
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.result, 
        timestamp: Date.now() 
      }]);
      
      if (onSendCallback) {
        onSendCallback(response)
      }
    } catch (error) {
      console.error("Execution error:", error)
      if (isChat) {
        toast.error("AI failed to respond. Please try again.")
      } else {
        toast.error("Failed to analyze idea. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }, [ideaText, executionType, selectedModelId, analysisType, onSendCallback])

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
    triggerFileInput,
    isLoading,
    result,
    executionType,
    setExecutionType,
    analysisType,
    setAnalysisType,
    models,
    selectedModelId,
    setSelectedModelId,
    messages,
    setMessages
  }
}
