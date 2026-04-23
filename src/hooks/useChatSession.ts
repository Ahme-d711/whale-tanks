import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'
import { usePathname } from '@/i18n/routing'
import { executionService } from '@/features/dashboard/executions/services/execution.service'
import { extractCode } from '@/features/main/ai/utils/code-extraction'
import { useChatStore, Message } from './useChatStore'

export type { Message }

export function useChatSession(onBlocksExtracted: (ui: string[], db: string[]) => void) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

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
      
      // Extract code from history if any
      const lastAssistantMsg = historicalMessages.filter(m => m.role === 'assistant').pop()
      if (lastAssistantMsg) {
        const { ui, db } = extractCode(lastAssistantMsg.content)
        onBlocksExtracted(ui, db)
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
    
    // Logic for loading/syncing sessions
    if (sIdFromUrl && sIdFromUrl !== sessionId) {
      // 1. Initial Load (no messages, ID in URL)
      if (messages.length === 0) {
        setSessionId(sIdFromUrl)
        fetchHistory(sIdFromUrl)
      } 
      // 2. Syncing a live session (messages exist, sessionId was null)
      else if (sessionId === null) {
        setSessionId(sIdFromUrl)
      } 
      // 3. Explicitly switching to another session via URL/Sidebar
      else {
        setSessionId(sIdFromUrl)
        setMessages([])
        fetchHistory(sIdFromUrl)
      }
    }
  }, [searchParams, sessionId, fetchHistory, messages.length, setSessionId, setMessages])

  const syncSessionUrl = useCallback((sId: string) => {
    if (searchParams.get('session_id') === sId) return
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('session_id', sId)
    newParams.delete('q') 
    
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
    resetSession: resetChat // Maintain same API name for easier transition
  }
}
