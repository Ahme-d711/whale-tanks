"use client"

import { useTranslations, useLocale } from 'next-intl'
import { useIdeaAnalyzer } from '@/hooks/useIdeaAnalyzer'
import { useQuery } from '@tanstack/react-query'
import { executionService } from '@/features/dashboard/executions/services/execution.service'
import { MessageSquare, Clock, MessageCircle, Trash2, Search } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/i18n/routing'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useConfirm } from '@/providers/ConfirmationProvider'

interface LastChatsSectionProps {
  isCollapsed?: boolean
}

export default function LastChatsSection({ isCollapsed }: LastChatsSectionProps) {
  const t = useTranslations('Sidebar')
  const locale = useLocale()
  const router = useRouter()
  const confirm = useConfirm()
  const [searchQuery, setSearchQuery] = React.useState('')

  const queryClient = useQueryClient()

  const { data: sessions, isLoading, isError } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: () => executionService.getSessions(),
    refetchInterval: 30000, 
  })

  const filteredSessions = React.useMemo(() => {
    if (!sessions) return []
    if (!searchQuery.trim()) return sessions
    return sessions.filter(session => 
      (session.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [sessions, searchQuery])

  const analyzer = useIdeaAnalyzer() // We need this for resetting
  const { mutate: deleteMutation } = useMutation({
    mutationFn: (id: string) => executionService.deleteSession(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
      toast.success(t('chat_deleted'))

      // If the deleted session is the one being viewed, clear state and go home
      const currentSearchParams = new URLSearchParams(window.location.search)
      if (currentSearchParams.get('session_id') === deletedId) {
        analyzer.resetSession()
        router.push('/ai')
      }
    },
    onError: () => {
      toast.error(t('delete_failed'))
    }
  })

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const ok = await confirm({
      title: t('confirm_delete_title') || "Delete Chat?",
      description: t('confirm_delete_desc') || "Are you sure you want to delete this conversation? This action cannot be undone.",
      confirmText: t('delete') || "Delete",
      variant: "destructive"
    })

    if (ok) {
      deleteMutation(id)
    }
  }

  if (isCollapsed) return null

  return (
    <div className="space-y-4 pt-4 px-4">
      <div className="relative px-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
        <input 
          type="text"
          placeholder={t('search') || "Search about Chats"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-primary/10 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-primary/40"
        />
      </div>

      <h3 className="text-xs px-3 md:text-sm text-secondary-foreground font-medium">{t('last_chats')}</h3>
      
      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2 opacity-50" />
            </div>
          ))
        ) : isError ? (
          <p className="text-sm text-destructive px-2 italic opacity-70">Failed to load chats</p>
        ) : filteredSessions.length === 0 ? (
          <p className="text-sm text-muted-foreground px-2 italic opacity-70">
            {searchQuery ? t('no_search_results') || "No matches found" : (t('no_chats') || "No recent chats")}
          </p>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.session_id}
              onClick={() => router.push(`/ai?session_id=${session.session_id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  router.push(`/ai?session_id=${session.session_id}`)
                }
              }}
              role="button"
              tabIndex={0}
              className={cn(
                "w-full text-start p-3 rounded-xl transition-all hover:bg-muted/50 group flex flex-col gap-1 active:scale-[0.98] relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MessageCircle className="w-4 h-4 text-primary opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
                  <span className="text-sm font-medium text-foreground line-clamp-1">
                    {session.title || "New Conversation"}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDelete(e, session.session_id)}
                  className="opacity-0 group-hover:opacity-40 hover:opacity-100! p-1 rounded-md hover:bg-destructive/10 text-destructive transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" />
                  {new Date(session.updated_at).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 shrink-0" />
                  {session.message_count}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
