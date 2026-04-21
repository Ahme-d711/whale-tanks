import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'
import { usePathname } from '@/i18n/routing'
import { executionService } from '@/features/dashboard/executions/services/execution.service'
import { extractCode } from '@/features/main/ai/utils/code-extraction'

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export function useChatSession(onBlocksExtracted: (ui: string[], db: string[]) => void) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)

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
  }, [onBlocksExtracted])

  useEffect(() => {
    const sId = searchParams.get('session_id')
    if (sId) {
      if (sId !== sessionId) {
        setSessionId(sId)
        setMessages([])
        fetchHistory(sId)
      } else if (messages.length === 0 && !isHistoryLoading) {
        fetchHistory(sId)
      }
    } else if (sessionId && !searchParams.get('q')) {
      setSessionId(null)
      setMessages([])
    }
  }, [searchParams, sessionId, messages.length, isHistoryLoading, fetchHistory])

  const clearQueryParam = useCallback(() => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('q')
    router.replace(`${pathname}?${newParams.toString()}`)
  }, [searchParams, router, pathname])

  return {
    messages,
    setMessages,
    sessionId,
    setSessionId,
    isHistoryLoading,
    fetchHistory,
    clearQueryParam
  }
}
