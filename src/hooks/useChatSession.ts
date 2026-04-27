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

      if (allUiBlocks.length > 0 || allDbBlocks.length > 0) {
        onBlocksExtracted(
          Array.from(new Set(allUiBlocks)), 
          Array.from(new Set(allDbBlocks))
        )
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error)
      toast.error("Failed to load chat history.")
    } finally {
      setIsHistoryLoading(false)
    }
  }, [onBlocksExtracted, setMessages, setIsHistoryLoading])

  useEffect(() => {
    const sIdFromUrl = searchParams.get('session_id')
    
    // 🔥 Check if the URL ID actually changed compared to what we last processed
    if (sIdFromUrl === lastUrlIdRef.current) return;
    
    lastUrlIdRef.current = sIdFromUrl;

    // 1. Session cleared (New Chat)
    if (!sIdFromUrl) {
      resetChat()
      if (onReset) onReset()
      return
    }

    // 2. New session ID detected in URL
    if (sIdFromUrl !== sessionId) {
      // Clear current messages to show skeletons
      if (messages.length > 0) setMessages([])
      
      setSessionId(sIdFromUrl)
      fetchHistory(sIdFromUrl)
    }
  }, [searchParams, sessionId, fetchHistory, messages.length, setSessionId, setMessages, resetChat, onReset])

  const syncSessionUrl = useCallback((sId: string) => {
    if (searchParams.get('session_id') === sId) return
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('session_id', sId)
    newParams.delete('q') 
    
    lastUrlIdRef.current = sId // Mark as already handled to prevent re-fetch loop
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
  }, [searchParams, router, pathname])

  const clearQueryParam = useCallback(() => {
    if (!searchParams.get('q')) return
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('q')
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
  }, [searchParams, router, pathname])

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
