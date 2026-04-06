"use client"

import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { User, Bot } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Message } from '@/hooks/useIdeaAnalyzer'

interface ChatDisplayProps {
  messages: Message[]
  isLoading: boolean
}

const MessageContent = ({ content, role }: { content: string, role: string }) => {
  const isArabic = /[\u0600-\u06FF]/.test(content);
  
  if (role === 'user') return (
    <p dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'text-right' : 'text-left'}>
      {content}
    </p>
  )

  // Helper function to format AI text based on user rules
  const formatAIText = (text: string) => {
    // 1. Remove markdown symbols like ##, **, --, etc.
    let clean = text
      .replace(/[#*_-]/g, '')
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
    
    // 2. Identify and tag sections with emojis if they match certain patterns
    const sections = [
      { pattern: /الهدف|Goal/i, emoji: "🎯" },
      { pattern: /الخطوات|Key Steps/i, emoji: "🧠" },
      { pattern: /الخطة|Execution Plan/i, emoji: "🛠️" },
      { pattern: /نصائح|Tips/i, emoji: "💡" },
      { pattern: /أخطاء|Mistakes/i, emoji: "⚠️" }
    ]

    // Split into lines to process headings
    let lines = clean.split('\n')
    let formattedLines = lines.map(line => {
      let trimmed = line.trim()
      if (!trimmed) return "";
      
      // Check if this line is a heading (usually short and at start of paragraph)
      for (const section of sections) {
        if (section.pattern.test(trimmed) && trimmed.length < 30) {
          return `\n${section.emoji} ${trimmed}\n`
        }
      }
      
      // Convert list indicators to proper bullets
      if (/^\s*[0-9]+\.|\u2022|\-/.test(trimmed)) {
        return `\u2022 ${trimmed.replace(/^[0-9]+\.|\-/, '').trim()}`
      }
      
      return trimmed
    })

    return formattedLines.join('\n').trim()
  }

  const formatted = formatAIText(content)

  return (
    <div 
      dir={isArabic ? 'rtl' : 'ltr'} 
      className={`whitespace-pre-wrap leading-relaxed space-y-2 ${isArabic ? 'text-right' : 'text-left'}`}
    >
      {formatted.split('\n\n').map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  )
}

export const ChatDisplay = ({ messages, isLoading }: ChatDisplayProps) => {
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
          {messages.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-50 my-auto">
              <Bot className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium text-foreground/70">Start a conversation to analyze your idea!</p>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
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
                  <MessageContent content={msg.content} role={msg.role} />
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
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
