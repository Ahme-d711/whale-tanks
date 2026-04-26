"use client"

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { executionService } from '@/features/dashboard/executions/services/execution.service'
import { ExecuteRequest } from '@/features/dashboard/executions/types/execution.types'
import { useSearchParams } from 'next/navigation'

import { detectContentType } from '@/features/main/ai/utils/code-detection'
import { extractCode } from '@/features/main/ai/utils/code-extraction'

// Sub-hooks
import { useAudioRecorder } from './useAudioRecorder'
import { useFileAttachments } from './useFileAttachments'
import { useAIBuilderState } from './useAIBuilderState'
import { useChatSession, Message } from './useChatSession'
import { useAIModels } from './useAIModels'

export type { Message }

export const useIdeaAnalyzer = (onSendCallback?: (data: any) => void) => {
  const searchParams = useSearchParams()
  
  // 1. Initialise Specialized Hooks
  const builder = useAIBuilderState()
  const files = useFileAttachments()
  const models = useAIModels()
  
  // Chat session needs to update builder state when history loads
  const chat = useChatSession(useCallback((ui, db) => {
    if (ui.length > 0) {
      builder.setWebBuilderBlocks(ui)
      builder.setActiveBlockIndex(0)
    }
    if (db.length > 0) {
      builder.setDbBlocks(db)
      builder.setActiveDbBlockIndex(0)
    }
  }, [builder]))

  const record = useAudioRecorder(useCallback((file) => {
    files.setAttachments(prev => [...prev, file])
  }, [files]))

  // 2. Local UI State
  const [ideaText, setIdeaText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [executionType, setExecutionType] = useState<ExecuteRequest["execution_type"]>("chat")
  const [analysisType, setAnalysisType] = useState<string>("all")

  // 3. Core Logic (Sending)
  const handleSend = useCallback(async (explicitPrompt?: string) => {
    const currentMessage = (explicitPrompt || ideaText).trim();
    if (!currentMessage) return;

    const isChat = executionType === "chat";
    const userTimestamp = Date.now();
    
    // Add user message to history
    chat.setMessages(prev => [...prev, { role: 'user', content: currentMessage, timestamp: userTimestamp }]);
    
    setIdeaText('');
    files.setAttachments([]);
    setIsLoading(true);

    try {
      const requestData: ExecuteRequest = {
        prompt: currentMessage,
        execution_type: executionType,
        model_id: models.selectedModelId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        analysis_type: executionType === "report" ? analysisType : undefined,
        session_id: chat.sessionId || undefined,
        tier: "free",
        extra: {}
      }

      // Add empty assistant message
      chat.setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '', 
        timestamp: userTimestamp + 1 
      }]);

      let fullContent = "";
      
      await executionService.streamExecute(requestData, (update) => {
        if (update.session_id) {
          chat.setSessionId(update.session_id);
          chat.syncSessionUrl(update.session_id);
        }
        
        if (update.text) {
          fullContent += update.text;
          chat.setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = fullContent;
            }
            return newMessages;
          });

          // Check for code in the stream
          const { ui, db } = extractCode(fullContent);
          
          if (ui.length > 0) {
            builder.setWebBuilderBlocks(ui);
            builder.setActiveBlockIndex(0);
            
            // Switch to Web Builder if UI code appears
            if (ui[0].length > 50 && builder.activeAction !== 'web_builder') {
              builder.setActiveAction('web_builder');
              const canViewFirst = detectContentType(ui[0]).contentType !== 'none';
              builder.setActiveSubAction(canViewFirst ? 'view' : 'code');
            }
          }

          if (db.length > 0) {
            builder.setDbBlocks(db);
            builder.setActiveDbBlockIndex(0);
          }
        }
      });
      
      if (onSendCallback) onSendCallback({ result: fullContent })
    } catch (error) {
      console.error("Execution error:", error)
      toast.error(isChat ? "AI failed to respond." : "Failed to analyze idea.")
      
      // Cleanup assistant message on error
      chat.setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].role === 'assistant' && !prev[prev.length - 1].content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false)
    }
  }, [ideaText, executionType, models.selectedModelId, analysisType, onSendCallback, chat, files, builder])

  // 4. URL & Initialisation Sync
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && chat.messages.length === 0 && !isLoading && models.selectedModelId) {
      handleSend(q)
      chat.clearQueryParam()
    }
  }, [searchParams, chat, isLoading, models.selectedModelId, handleSend])

  // 5. Final Export (Preserve API compatibility)
  return {
    ideaText,
    setIdeaText,
    attachments: files.attachments,
    isRecording: record.isRecording,
    fileInputRef: files.fileInputRef,
    handleToggleRecording: record.handleToggleRecording,
    handleFilesSelected: files.handleFilesSelected,
    handleFilesSelectedDirect: files.handleFilesSelectedDirect,
    handleRemoveAttachment: files.handleRemoveAttachment,
    handleSend,
    triggerFileInput: files.triggerFileInput,
    isLoading,
    executionType,
    setExecutionType,
    analysisType,
    setAnalysisType,
    models: models.models,
    selectedModelId: models.selectedModelId,
    setSelectedModelId: models.setSelectedModelId,
    messages: chat.messages,
    setMessages: chat.setMessages,
    webBuilderBlocks: builder.webBuilderBlocks,
    setWebBuilderBlocks: builder.setWebBuilderBlocks,
    dbBlocks: builder.dbBlocks,
    setDbBlocks: builder.setDbBlocks,
    activeBlockIndex: builder.activeBlockIndex,
    setActiveBlockIndex: builder.setActiveBlockIndex,
    activeDbBlockIndex: builder.activeDbBlockIndex,
    setActiveDbBlockIndex: builder.setActiveDbBlockIndex,
    canView: builder.canView,
    activeAction: builder.activeAction,
    setActiveAction: builder.setActiveAction,
    activeSubAction: builder.activeSubAction,
    setActiveSubAction: builder.setActiveSubAction,
    sessionId: chat.sessionId,
    setSessionId: chat.setSessionId,
    resetSession: chat.resetSession,
    isHistoryLoading: chat.isHistoryLoading
  }
}
