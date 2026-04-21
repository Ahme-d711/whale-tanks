"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { executionService } from '@/features/dashboard/executions/services/execution.service'
import { ExecuteRequest, ExecuteResponse } from '@/features/dashboard/executions/types/execution.types'
import { modelService } from '@/features/dashboard/models/services/model.service'
import { AIModel } from '@/features/dashboard/models/types/model.types'
import { useSearchParams, useRouter } from 'next/navigation'
import { usePathname } from '@/i18n/routing'

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
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [ideaText, setIdeaText] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ExecuteResponse | null>(null)
  const [executionType, setExecutionType] = useState<ExecuteRequest["execution_type"]>("chat")
  const [analysisType, setAnalysisType] = useState<string>("all")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
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

  const fetchHistory = useCallback(async (sId: string) => {
    setIsHistoryLoading(true)
    try {
      const data = await executionService.getSessionMessages(sId)
      const historicalMessages: Message[] = []
      
      data.pairs.forEach(pair => {
        historicalMessages.push({
          role: 'user',
          content: pair.question.content,
          timestamp: new Date(pair.question.created_at).getTime()
        })
        historicalMessages.push({
          role: 'assistant',
          content: pair.answer.content,
          timestamp: new Date(pair.answer.created_at).getTime()
        })
      })
      
      setMessages(historicalMessages)
    } catch (error) {
      console.error("Failed to fetch chat history:", error)
      toast.error("Failed to load chat history.")
    } finally {
      setIsHistoryLoading(false)
    }
  }, [])

  const handleSend = useCallback(async (explicitPrompt?: string) => {
    const currentMessage = (explicitPrompt || ideaText).trim();
    if (!currentMessage) return;

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
        session_id: sessionId || undefined,
        tier: "free",
        extra: {}
      }

      // 1. Add empty assistant message with a slightly different timestamp to avoid duplicate keys
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '', 
        timestamp: Date.now() + 1 
      }]);

      let fullContent = "";
      
      await executionService.streamExecute(requestData, (update) => {
        if (update.session_id) {
          setSessionId(update.session_id);
        }
        
        if (update.text) {
          fullContent += update.text;
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = fullContent;
            }
            return newMessages;
          });
        }
      });
      
      if (onSendCallback) {
        onSendCallback({ result: fullContent })
      }
    } catch (error) {
      console.error("Execution error:", error)
      toast.error(isChat ? "AI failed to respond." : "Failed to analyze idea.")
      
      // Remove empty assistant message on error
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].role === 'assistant' && !prev[prev.length - 1].content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false)
    }
  }, [ideaText, executionType, selectedModelId, analysisType, onSendCallback, sessionId])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && messages.length === 0 && !isLoading && selectedModelId) {
      handleSend(q)
      // Clear the query param to avoid re-sending on refresh or navigation
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete('q')
      router.replace(`${pathname}?${newParams.toString()}`)
    }
  }, [searchParams, messages.length, isLoading, selectedModelId, handleSend, router, pathname])

  useEffect(() => {
    const sId = searchParams.get('session_id')
    if (sId) {
      if (sId !== sessionId) {
        setSessionId(sId)
        fetchHistory(sId)
      } else if (messages.length === 0 && !isHistoryLoading) {
        // Fallback for direct reload with sessionId
        fetchHistory(sId)
      }
    } else if (sessionId && !searchParams.get('q')) {
      // If we are on /ai without session_id or prompt, it's a new chat
      setSessionId(null)
      setMessages([])
    }
  }, [searchParams, sessionId, messages.length, isHistoryLoading, fetchHistory])

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
    setMessages,
    sessionId,
    setSessionId,
    isHistoryLoading
  }
}
