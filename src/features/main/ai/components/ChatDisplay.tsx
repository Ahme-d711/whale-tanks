"use client"

import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { User, Bot } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Message } from '@/hooks/useIdeaAnalyzer'
import { MessageContent } from './chat/MessageContent'

interface ChatDisplayProps {
  messages: Message[]
  isLoading: boolean
  isHistoryLoading?: boolean
  activeAction?: 'consultation' | 'web_builder'
}

const MessageItem = React.memo(({ msg, idx }: { msg: Message, idx: number }) => {
  if (msg.role === 'assistant' && !msg.content) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex items-start gap-1 lg:gap-3 w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      <Avatar className="w-8 h-8 mt-1 border shrink-0 hidden lg:flex">
        <AvatarFallback>{msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 min-w-0 w-full lg:max-w-[80%]">
        <div className={`px-5 py-4 text-sm shadow-sm transition-all overflow-hidden ${
          msg.role === 'user' 
            ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-none' 
            : 'bg-white text-secondary-foreground rounded-2xl rounded-tl-none border border-zinc-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]'
        }`}>
          <MessageContent content={msg.content} role={msg.role} />
        </div>
      </div>
    </motion.div>
  )
})
MessageItem.displayName = 'MessageItem'

export const ChatDisplay = ({ messages, isLoading, isHistoryLoading }: ChatDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      if (isNearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, isLoading])

  return (
    <div className="bg-transparent lg:bg-white lg:backdrop-blur-md lg:rounded-3xl flex-1 lg:border-2 lg:border-primary lg:shadow-xl lg:shadow-blue-500/5 flex flex-col overflow-hidden relative">
      <div 
        ref={scrollRef}
        className="flex-1 p-0 sm:p-8 overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth bg-transparent lg:bg-zinc-50/50"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-8 w-full pb-70! lg:pb-8">
          {isHistoryLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`flex items-start gap-3 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
                <div className={`h-12 w-2/3 bg-muted animate-pulse rounded-2xl ${i % 2 === 0 ? 'rounded-tl-none' : 'rounded-tr-none'}`} />
              </div>
            ))
          ) : (
            <>
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center text-center p-10 opacity-50 w-full py-40 z-0">
                  <Bot className="w-16 h-16 mb-4 text-primary/60" />
                  <p className="text-xl font-bold text-foreground/70 max-w-xs">Start a conversation to analyze your idea!</p>
                </div>
              )}
            </>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <MessageItem key={msg.timestamp || idx} msg={msg} idx={idx} />
            ))}
            
            {isLoading && (messages.length === 0 || !messages[messages.length - 1]?.content) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <Avatar className="w-8 h-8 mt-1 border animate-pulse shrink-0">
                  <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                </Avatar>
                <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tl-none px-4 py-2 text-sm shadow-sm flex items-center gap-2 italic opacity-70">
                  <span>Thinking...</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
