"use client"

import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { User, Bot, ChevronDown, ChevronUp, Terminal } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Message } from '@/hooks/useIdeaAnalyzer'

interface ChatDisplayProps {
  messages: Message[]
  isLoading: boolean
  isHistoryLoading?: boolean
  activeAction?: 'consultation' | 'web_builder'
}

const CollapsibleCode = ({ code, lang, initiallyCollapsed }: { code: string, lang: string, initiallyCollapsed?: boolean }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(initiallyCollapsed ?? false);

  return (
    <div className="my-3 bg-zinc-950 rounded-xl overflow-hidden border border-white/10 shadow-sm transition-all duration-300">
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 transition-colors border-b border-white/10 text-left"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-primary/20">
            <Terminal className="w-3 h-3 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-none">
              {lang}
            </span>
            {isCollapsed && (
              <span className="text-[9px] text-zinc-500 italic mt-0.5">Click to view snippet</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isCollapsed && <span className="text-[9px] text-zinc-600 italic">Full code in Web Builder</span>}
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />}
        </div>
      </button>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <pre className="p-3 overflow-auto custom-scrollbar max-h-[300px] border-t border-white/5 bg-black/20">
              <code className="text-xs font-mono text-zinc-300 whitespace-pre">
                {code}
              </code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MessageContent = ({ content = "", role, activeAction }: { content?: string, role: string, activeAction?: string }) => {
  const safeContent = content || "";
  const isArabic = /[\u0600-\u06FF]/.test(safeContent);
  
  if (role === 'user') return (
    <p dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'text-right' : 'text-left'}>
      {safeContent}
    </p>
  )

  // Separates code blocks from normal text
  const parts = safeContent.split(/(```[\s\S]*?```)/g);

  const formatAIText = (text: string = "") => {
    let clean = text
      .replace(/[#*_-]/g, '')
      .replace(/\n{3,}/g, '\n\n')
    
    const sections = [
      { pattern: /الهدف|Goal/i, emoji: "🎯" },
      { pattern: /الخطوات|Key Steps/i, emoji: "🧠" },
      { pattern: /الخطة|Execution Plan/i, emoji: "🛠️" },
      { pattern: /نصائح|Tips/i, emoji: "💡" },
      { pattern: /أخطاء|Mistakes/i, emoji: "⚠️" }
    ]

    let lines = clean.split('\n')
    let formattedLines = lines.map(line => {
      let trimmed = line.trim()
      if (!trimmed) return "";
      for (const section of sections) {
        if (section.pattern.test(trimmed) && trimmed.length < 30) {
          return `\n${section.emoji} ${trimmed}\n`
        }
      }
      if (/^\s*[0-9]+\.|\u2022|\-/.test(trimmed)) {
        return `\u2022 ${trimmed.replace(/^[0-9]+\.|\-/, '').trim()}`
      }
      return trimmed
    })

    return formattedLines.join('\n').trim()
  }

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={`leading-relaxed space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const code = part.replace(/```(?:\w+)?\n?|```$/g, '').trim();
          return (
            <CollapsibleCode 
              key={index} 
              code={code} 
              lang={part.match(/```(\w+)/)?.[1] || 'code'} 
              initiallyCollapsed={activeAction === 'web_builder'}
            />
          )
        }

        const formatted = formatAIText(part)
        if (!formatted) return null;

        return (
          <div key={index} className="space-y-2">
            {formatted.split('\n\n').map((paragraph, i) => (
              <p key={i} className="whitespace-pre-wrap">{paragraph}</p>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export const ChatDisplay = ({ messages, isLoading, isHistoryLoading, activeAction }: ChatDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <div className="bg-white backdrop-blur-md rounded-3xl flex-1 border-2 border-primary shadow-xl shadow-blue-500/5 flex flex-col overflow-hidden relative">
      <div 
        ref={scrollRef}
        className="flex-1 p-5 overflow-y-auto custom-scrollbar scroll-smooth"
      >
        <div className="flex flex-col gap-4">
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
                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-50 my-auto">
                  <Bot className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium text-foreground/70">Start a conversation to analyze your idea!</p>
                </div>
              )}
            </>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              if (msg.role === 'assistant' && !msg.content) return null;
              
              return (
                <motion.div
                  key={msg.timestamp || idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-8 h-8 mt-1 border">
                    <AvatarFallback>{msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}</AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-secondary text-secondary-foreground rounded-tl-none'
                  }`}>
                    <MessageContent content={msg.content} role={msg.role} activeAction={activeAction} />
                  </div>
                </motion.div>
              )
            })}
            
            {isLoading && (messages.length === 0 || !messages[messages.length - 1]?.content) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <Avatar className="w-8 h-8 mt-1 border animate-pulse">
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
