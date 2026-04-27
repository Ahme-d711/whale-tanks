"use client"

import React from 'react'
import { 
  Database as DBIcon, 
  Code2, 
  ChevronLeft, 
  ChevronRight, 
  LayoutPanelTop,
  Maximize2,
  Download
} from 'lucide-react'

interface DatabaseHeaderProps {
  viewMode: 'code' | 'visual'
  setViewMode: (mode: 'code' | 'visual') => void
  onMaximize: () => void
  onDownload: () => void
  blocksCount: number
  activeIndex: number
  onIndexChange: (index: number) => void
}

export const DatabaseHeader = ({
  viewMode,
  setViewMode,
  onMaximize,
  onDownload,
  blocksCount,
  activeIndex,
  onIndexChange
}: DatabaseHeaderProps) => {
  return (
    <div className="h-14 border-b flex items-center justify-between px-4 bg-zinc-50/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-lg">
          <DBIcon className="w-4 h-4 text-primary" />
        </div>
        <span className="font-bold text-sm tracking-tight text-zinc-700">Database Schema</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Actions: Maximize & Download */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <button 
            onClick={onMaximize}
            className="p-1.5 rounded-md hover:bg-zinc-200 text-zinc-500 transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onDownload}
            className="p-1.5 rounded-md hover:bg-zinc-200 text-zinc-500 transition-colors"
            title="Download Schema"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex p-1 bg-zinc-200/50 rounded-lg mr-2">
          <button 
            onClick={() => setViewMode('visual')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'visual' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700'}`}
            title="Visual Diagram"
          >
            <LayoutPanelTop className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('code')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'code' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700'}`}
            title="Raw Code"
          >
            <Code2 className="w-4 h-4" />
          </button>
        </div>

        {/* Version Arrows */}
        {blocksCount > 1 && (
          <div className="flex items-center gap-2 bg-white border rounded-lg px-2 py-1 shadow-sm">
            <button 
              onClick={() => onIndexChange(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="p-0.5 text-zinc-400 hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-black text-zinc-500 min-w-[30px] text-center">
              {activeIndex + 1} / {blocksCount}
            </span>
            <button 
              onClick={() => onIndexChange(Math.min(blocksCount - 1, activeIndex + 1))}
              disabled={activeIndex === blocksCount - 1}
              className="p-0.5 text-zinc-400 hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
