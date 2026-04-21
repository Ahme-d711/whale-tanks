"use client"

import React from 'react'
import { Code2, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface CodeViewProps {
  code: string
  blocksCount: number
  activeIndex: number
  onIndexChange: (index: number) => void
}

export default function CodeView({ 
  code, 
  blocksCount, 
  activeIndex, 
  onIndexChange 
}: CodeViewProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success(`Version ${activeIndex + 1} copied to clipboard`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded bg-primary/20">
            <Code2 className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
            Source Code
          </span>
        </div>

        <div className="flex items-center gap-3">
          {blocksCount > 1 && (
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1 border border-white/5">
              <button 
                onClick={() => onIndexChange(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                title="Previous Version"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono text-zinc-500 min-w-[30px] text-center">
                {activeIndex + 1} / {blocksCount}
              </span>
              <button 
                onClick={() => onIndexChange(Math.min(blocksCount - 1, activeIndex + 1))}
                disabled={activeIndex === blocksCount - 1}
                className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                title="Next Version"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopy} 
            className="h-7 gap-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/10"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5 custom-scrollbar">
        <pre className="text-sm font-mono text-zinc-300 whitespace-pre leading-relaxed">
          <code>{code || "// No code generated yet..."}</code>
        </pre>
      </div>
    </div>
  )
}
