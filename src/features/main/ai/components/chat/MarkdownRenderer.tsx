"use client"

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CheckCircle2 } from 'lucide-react'
import { CollapsibleCode } from './CollapsibleCode'

interface MarkdownRendererProps {
  content: string
  isArabic: boolean
}

export const MarkdownRenderer = React.memo(({ content, isArabic }: MarkdownRendererProps) => {
  const clean = React.useMemo(() => {
    return content
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
  }, [content]);

  const components = React.useMemo(() => ({
    h1: ({ children }: any) => <h1 className="text-xl font-bold mt-6 mb-4 text-primary">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-lg font-bold mt-5 mb-3 text-primary">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-base font-semibold mt-4 mb-2 text-primary">{children}</h3>,
    p: ({ children }: any) => <p className="text-zinc-700 leading-relaxed mb-4 whitespace-pre-wrap">{children}</p>,
    li: ({ children }: any) => <li className="mb-1">{children}</li>,
    ul: ({ children }: any) => <ul className={`list-disc ${isArabic ? 'pr-6' : 'pl-6'} space-y-1 mb-4`}>{children}</ul>,
    ol: ({ children }: any) => <ol className={`list-decimal ${isArabic ? 'pr-6' : 'pl-6'} space-y-1 mb-4`}>{children}</ol>,
    strong: ({ children }: any) => <strong className="font-bold text-primary">{children}</strong>,
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-4 rounded-xl border border-zinc-200">
        <table className="w-full text-right border-collapse">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: any) => <th className="bg-zinc-50 p-3 text-sm font-bold border-b">{children}</th>,
    td: ({ children }: any) => <td className="p-3 text-sm border-b border-zinc-100">{children}</td>,
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
  }), [isArabic]);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components as any}>
      {clean}
    </ReactMarkdown>
  )
})

MarkdownRenderer.displayName = 'MarkdownRenderer'
