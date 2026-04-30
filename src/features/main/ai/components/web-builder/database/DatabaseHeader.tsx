"use client"

import React from 'react'
import { 
  Database as DBIcon, 
  Code2, 
  ChevronLeft, 
  ChevronRight, 
  LayoutPanelTop,
  Maximize2,
  Download,
  FileText
} from 'lucide-react'

interface DatabaseHeaderProps {
  viewMode: 'code' | 'visual'
  setViewMode: (mode: 'code' | 'visual') => void
  onMaximize: () => void
  onDownloadImage: () => void
  onDownloadPDF: () => void
  blocksCount: number
  activeIndex: number
  onIndexChange: (index: number) => void
}

export const DatabaseHeader = ({
  viewMode,
  setViewMode,
  onMaximize,
  onDownloadImage,
  onDownloadPDF,
  blocksCount,
  activeIndex,
  onIndexChange
}: DatabaseHeaderProps) => {
  return (
    <div className="h-11 md:h-14 border-b flex items-center justify-between px-2 md:px-4 bg-zinc-50/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-1 md:gap-2">
        <div className="bg-primary/10 p-1 md:p-1.5 rounded-lg">
          <DBIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
        </div>
        <span className="font-bold text-xs md:text-sm tracking-tight text-zinc-700 hidden sm:inline">Database Schema</span>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {/* Actions: Maximize & Download */}
        <div className="flex items-center gap-0.5 md:gap-1 border-r pr-1 md:pr-2 mr-1 md:mr-2">
          <button 
            onClick={onMaximize}
            className="p-1 md:p-1.5 rounded-md hover:bg-zinc-200 text-zinc-500 transition-colors"
            title="Fullscreen + Interactive View"
          >
            <Maximize2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <div className="h-4 w-px bg-zinc-300 mx-0.5 md:mx-1" />
          <button 
            onClick={onDownloadImage}
            className="p-1 md:p-1.5 rounded-md hover:bg-zinc-200 text-zinc-500 transition-colors flex items-center gap-1 px-1 md:px-2"
            title="Download PNG (Quick Share)"
          >
            <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider opacity-70 hidden xs:inline">PNG</span>
          </button>
          <button 
            onClick={onDownloadPDF}
            className="p-1 md:p-1.5 rounded-md hover:bg-zinc-200 text-zinc-500 transition-colors flex items-center gap-1 px-1 md:px-2"
            title="Download PDF (Documentation)"
          >
            <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider opacity-70 hidden xs:inline">PDF</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex p-0.5 md:p-1 bg-zinc-200/50 rounded-lg mr-1 md:mr-2">
          <button 
            onClick={() => setViewMode('visual')}
            className={`p-1 md:p-1.5 rounded-md transition-all ${viewMode === 'visual' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700'}`}
            title="Visual Diagram"
          >
            <LayoutPanelTop className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button 
            onClick={() => setViewMode('code')}
            className={`p-1 md:p-1.5 rounded-md transition-all ${viewMode === 'code' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700'}`}
            title="Raw Code"
          >
            <Code2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>

        {/* Version Arrows */}
        {blocksCount > 1 && (
          <div className="flex items-center gap-1 md:gap-2 bg-white border rounded-lg px-1 md:px-2 py-0.5 md:py-1 shadow-sm scale-90 md:scale-100 origin-right">
            <button 
              onClick={() => onIndexChange(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="p-0.5 text-zinc-400 hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <span className="text-[9px] md:text-[10px] font-black text-zinc-500 min-w-[25px] md:min-w-[30px] text-center">
              {activeIndex + 1} / {blocksCount}
            </span>
            <button 
              onClick={() => onIndexChange(Math.min(blocksCount - 1, activeIndex + 1))}
              disabled={activeIndex === blocksCount - 1}
              className="p-0.5 text-zinc-400 hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
