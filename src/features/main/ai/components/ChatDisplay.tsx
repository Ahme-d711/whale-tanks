"use client"

import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { User, Bot, ChevronDown, ChevronUp, Terminal, Code, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Message } from '@/hooks/useIdeaAnalyzer'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'

interface ChatDisplayProps {
  messages: Message[]
  isLoading: boolean
  isHistoryLoading?: boolean
  activeAction?: 'consultation' | 'web_builder'
}

const CollapsibleCode = ({ code, lang, initiallyCollapsed }: { code: string, lang: string, initiallyCollapsed?: boolean }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(initiallyCollapsed ?? false);
  const [activeFileIndex, setActiveFileIndex] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  // Parse code into multiple files if separators exist (e.g., // filename.jsx)
  const files = React.useMemo(() => {
    const fileMarkers = code.match(/\/\/\s+([a-zA-Z0-9._-]+\.[a-z0-9]+)/g) || [];
    if (fileMarkers.length <= 1) return [{ name: lang.toUpperCase(), content: code }];

    const parts = code.split(/\/\/\s+(?=[a-zA-Z0-9._-]+\.[a-z0-9]+)/g).filter(Boolean);
    return parts.map((part, idx) => {
      const nameMatch = part.match(/^([a-zA-Z0-9._-]+\.[a-z0-9]+)/);
      return {
        name: nameMatch ? nameMatch[1] : `File ${idx + 1}`,
        content: part.trim()
      };
    });
  }, [code, lang]);

  const currentFile = files[activeFileIndex] || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const nextFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveFileIndex((prev) => (prev + 1) % files.length);
  };

  const prevFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveFileIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  return (
    <div className="my-4 bg-[#0d1117] rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300">
      {/* Header */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 transition-colors border-b border-white/10 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-blue-500/20">
            <Code className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
              SOURCE CODE
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 font-mono">
              {currentFile.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Pagination Controls */}
          {files.length > 1 && (
            <div className="flex items-center gap-2 bg-black/30 rounded-lg px-2 py-1 border border-white/5">
              <button 
                onClick={prevFile}
                className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-400"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-zinc-500 min-w-[60px] text-center">
                {activeFileIndex + 1} / {files.length}
              </span>
              <button 
                onClick={nextFile}
                className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-400"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); handleCopy(); }}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 group"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 group-hover:text-white" />}
            </button>
            {isCollapsed ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronUp className="w-4 h-4 text-zinc-500" />}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <pre className="p-4 overflow-auto custom-scrollbar max-h-[450px] border-t border-white/5 bg-black/40">
              <code className="text-[12px] font-mono text-zinc-300 whitespace-pre">
                {currentFile.content}
              </code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MarkdownRenderer = ({ content, isArabic }: { content: string, isArabic: boolean }) => {
  const clean = content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split('\n')
    .map(line => {
      const trimmed = line.trim()
      if (/^نقاط القوة|^Strengths/i.test(trimmed)) return `### ✅ نقاط القوة`
      if (/^نقاط الضعف|^Weaknesses/i.test(trimmed)) return `### ❌ نقاط الضعف`
      if (/^الفرص|^Opportunities/i.test(trimmed)) return `### 🚀 الفرص`
      if (/^التهديدات|^Threats/i.test(trimmed)) return `### ⚠️ التهديدات`
      return line
    })
    .join('\n')

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-xl font-bold mt-6 mb-4 text-primary">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold mt-5 mb-3 text-primary">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold mt-4 mb-2 text-primary">{children}</h3>,
        p: ({ children }) => <p className="text-zinc-700 leading-relaxed mb-4 whitespace-pre-wrap">{children}</p>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        ul: ({ children }) => <ul className={`list-disc ${isArabic ? 'pr-6' : 'pl-6'} space-y-1 mb-4`}>{children}</ul>,
        ol: ({ children }) => <ol className={`list-decimal ${isArabic ? 'pr-6' : 'pl-6'} space-y-1 mb-4`}>{children}</ol>,
        strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
        table: ({ children }) => (
          <div className="overflow-x-auto my-4 rounded-xl border border-zinc-200">
            <table className="w-full text-right border-collapse">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => <th className="bg-zinc-50 p-3 text-sm font-bold border-b">{children}</th>,
        td: ({ children }) => <td className="p-3 text-sm border-b border-zinc-100">{children}</td>,
        code: ({ node, inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '')
          const codeString = String(children).replace(/\n$/, '')
          
          if (!inline && match) {
            return (
              <CollapsibleCode 
                code={codeString} 
                lang={match[1]} 
                initiallyCollapsed={false}
              />
            )
          }
          return (
            <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
              {children}
            </code>
          )
        },
        hr: () => null
      }}
    >
      {clean}
    </ReactMarkdown>
  )
}

const MessageContent = ({ content = "", role }: { content?: string, role: string }) => {
  const safeContent = content || "";
  const isArabic = /[\u0600-\u06FF]/.test(safeContent);
  
  if (role === 'user') return (
    <p dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'text-right' : 'text-left'}>
      {safeContent}
    </p>
  )

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={`text-sm ${isArabic ? 'text-right' : 'text-left'}`}>
      <MarkdownRenderer content={safeContent} isArabic={isArabic} />
    </div>
  )
}

export const ChatDisplay = ({ messages, isLoading, isHistoryLoading, activeAction }: ChatDisplayProps) => {
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
    <div className="bg-white backdrop-blur-md rounded-3xl flex-1 border-2 border-primary shadow-xl shadow-blue-500/5 flex flex-col overflow-hidden relative">
      <div 
        ref={scrollRef}
        className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar scroll-smooth bg-zinc-50/50"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
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
                  <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'max-w-[85%]' : 'w-full'}`}>
                    <div className={`px-5 py-4 text-sm shadow-sm transition-all ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-none' 
                        : 'bg-white text-secondary-foreground rounded-2xl border border-zinc-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] w-full'
                    }`}>
                      <MessageContent content={msg.content} role={msg.role} />
                    </div>
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
