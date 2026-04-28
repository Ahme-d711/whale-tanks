"use client"

import React from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Search, 
  Menu 
} from "lucide-react"

interface BrowserShellProps {
  path?: string
  activeBlockIndex?: number
  totalBlocks?: number
  onIndexChange?: (index: number) => void
}

export default function BrowserShell({ 
  path = "", 
  activeBlockIndex = 0, 
  totalBlocks = 0, 
  onIndexChange 
}: BrowserShellProps) {
  const canGoBack = activeBlockIndex > 0;
  const canGoForward = activeBlockIndex < totalBlocks - 1;

  const handleBack = () => {
    if (canGoBack && onIndexChange) {
      onIndexChange(activeBlockIndex - 1);
    }
  };

  const handleForward = () => {
    if (canGoForward && onIndexChange) {
      onIndexChange(activeBlockIndex + 1);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-zinc-50 border-b border-zinc-200 shrink-0">
      <div className="flex gap-1.5 shrink-0">
        <div className="w-3 h-3 rounded-full bg-zinc-300" />
        <div className="w-3 h-3 rounded-full bg-zinc-300" />
        <div className="w-3 h-3 rounded-full bg-zinc-300" />
      </div>
      
      <div className="flex items-center gap-1 px-1 ml-2">
        <button 
          onClick={handleBack}
          disabled={!canGoBack}
          className={`p-1 rounded-md transition-colors ${canGoBack ? 'hover:bg-zinc-200 text-zinc-600' : 'text-zinc-300 cursor-not-allowed'}`}
          title="Back"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={handleForward}
          disabled={!canGoForward}
          className={`p-1 rounded-md transition-colors ${canGoForward ? 'hover:bg-zinc-200 text-zinc-600' : 'text-zinc-300 cursor-not-allowed'}`}
          title="Forward"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Fake URL Bar */}
      <div className="flex-1 flex items-center gap-2 h-8 px-3 bg-white border border-zinc-200 rounded-lg shadow-sm">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
        <div className="flex items-center text-xs font-medium overflow-hidden">
          <span className="text-zinc-400 italic mr-0.5 shrink-0">https://</span>
          <span className="text-zinc-600 shrink-0">preview.whale-tanks.dev</span>
          {path && <span className="text-zinc-400 shrink-0">{path}</span>}
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 font-mono bg-zinc-100 px-1.5 py-0.5 rounded leading-none">
            PAGE {activeBlockIndex + 1} / {totalBlocks}
          </span>
          <Search className="w-3.5 h-3.5 text-zinc-300" />
        </div>
      </div>

      <Menu className="w-4 h-4 text-zinc-400 shrink-0" />
    </div>
  )
}
