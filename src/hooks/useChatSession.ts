import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'
import { usePathname } from '@/i18n/routing'
import { executionService } from '@/features/dashboard/executions/services/execution.service'
import { extractCode } from '@/features/main/ai/utils/code-extraction'
import { useChatStore, Message } from './useChatStore'

export type { Message }

export function useChatSession(
  onBlocksExtracted: (ui: string[], db: string[]) => void,
  onReset?: () => void
) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const lastUrlIdRef = useRef<string | null>(null)

  // Use Global Store
  const { 
    messages, 
    setMessages, 
    sessionId, 
    setSessionId, 
    isHistoryLoading, 
    setIsHistoryLoading,
    resetChat 
  } = useChatStore()

  const fetchHistory = useCallback(async (sId: string) => {
    setIsHistoryLoading(true)
    try {
      const data = await executionService.getSessionMessages(sId)
      const historicalMessages: Message[] = []
      
      data.pairs.forEach((pair, idx) => {
        const qTime = new Date(pair.question.created_at).getTime()
        const uniqueQ = qTime + (idx * 2)
        
        historicalMessages.push({
          role: 'user',
          content: pair.question.content,
          timestamp: uniqueQ
        })

        const aTime = new Date(pair.answer.created_at).getTime()
        historicalMessages.push({
          role: 'assistant',
          content: pair.answer.content,
          timestamp: (aTime <= qTime) ? uniqueQ + 1 : aTime + (idx * 2)
        })
      })
      
      setMessages(historicalMessages)
      
      // Extract code from ALL assistant messages in history
      const allUiBlocks: string[] = []
      const allDbBlocks: string[] = []
      
      historicalMessages.forEach(m => {
        if (m.role === 'assistant') {
          const { ui, db } = extractCode(m.content)
          allUiBlocks.push(...ui)
          allDbBlocks.push(...db)
        }
      })

      onBlocksExtracted(
        Array.from(new Set(allUiBlocks)), 
        Array.from(new Set(allDbBlocks))
      )
    } catch (error) {
      console.error("Failed to fetch chat history:", error)
      toast.error("Failed to load chat history.")
    } finally {
      setIsHistoryLoading(false)
    }
  }, [onBlocksExtracted, setMessages, setIsHistoryLoading])

  useEffect(() => {
    const sIdFromUrl = searchParams.get('session_id')
    
    // 1. If this URL update was already handled or matches current state, skip
    if (sIdFromUrl === lastUrlIdRef.current) return;
    
    // 2. Clear state if the URL lost its session ID (User navigated away or clicked New Chat)
    if (!sIdFromUrl) {
      if (sessionId && !lastUrlIdRef.current) {
        resetChat()
        if (onReset) onReset()
      }
      return
    }

    // 3. New session ID detected from outside (e.g. forward/back button or sidebar click)
    if (sIdFromUrl !== sessionId) {
      // Clear current messages to show skeletons/loading state immediately
      setMessages([])
      
      lastUrlIdRef.current = sIdFromUrl;
      setSessionId(sIdFromUrl)
      fetchHistory(sIdFromUrl)
    }
  }, [searchParams, sessionId, fetchHistory, setSessionId, resetChat, onReset])

  const syncSessionUrl = useCallback((sId: string) => {
    if (searchParams.get('session_id') === sId) return
    const newParams = new URLSearchParams(window.location.search)
    newParams.set('session_id', sId)
    newParams.delete('q') 
    
    lastUrlIdRef.current = sId // Mark as already handled to prevent re-fetch loop
    window.history.replaceState(null, '', `${window.location.pathname}?${newParams.toString()}`)
  }, [searchParams])

  const clearQueryParam = useCallback(() => {
    if (!window.location.search.includes('q=')) return
    const newParams = new URLSearchParams(window.location.search)
    newParams.delete('q')
    window.history.replaceState(null, '', `${window.location.pathname}?${newParams.toString()}`)
  }, [])

  return {
    messages,
    setMessages,
    sessionId,
    setSessionId,
    isHistoryLoading,
    fetchHistory,
    clearQueryParam,
    syncSessionUrl,
    resetSession: () => {
      resetChat()
      if (onReset) onReset()
    }
  }
}
