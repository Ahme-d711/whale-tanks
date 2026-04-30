"use client"

import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Search, 
  Menu 
} from "lucide-react"
import { useTranslations } from 'next-intl'

interface BrowserShellProps {
  path?: string
  activeBlockIndex?: number
  renderableIndexes?: number[]
  onIndexChange?: (index: number) => void
}

export default function BrowserShell({ 
  path = "", 
  activeBlockIndex = 0, 
  renderableIndexes = [], 
  onIndexChange 
}: BrowserShellProps) {
  const t = useTranslations('WebBuilder')
  const currentIndexInRenderable = renderableIndexes.indexOf(activeBlockIndex);
  const canGoBack = currentIndexInRenderable > 0;
  const canGoForward = currentIndexInRenderable < renderableIndexes.length - 1;

  const handleBack = () => {
    if (canGoBack && onIndexChange) {
      onIndexChange(renderableIndexes[currentIndexInRenderable - 1]);
    }
  };

  const handleForward = () => {
    if (canGoForward && onIndexChange) {
      onIndexChange(renderableIndexes[currentIndexInRenderable + 1]);
    }
  };

  return (
    <div className="flex items-center gap-2 px-6 py-2.5 bg-zinc-50/50 backdrop-blur-sm border-b border-zinc-200/50 shrink-0">
      <div className="flex gap-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/5 shadow-inner" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/5 shadow-inner" />
        <div className="w-3 h-3 rounded-full bg-[#28c840] border border-black/5 shadow-inner" />
      </div>
      
      <div className="flex items-center gap-1 ml-4 mr-2">
        <button 
          onClick={handleBack}
          disabled={!canGoBack}
          className={`p-1.5 rounded-lg transition-all ${canGoBack ? 'hover:bg-zinc-200/70 text-zinc-600' : 'text-zinc-300 cursor-not-allowed'}`}
          title={t('back') || "Back"}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={handleForward}
          disabled={!canGoForward}
          className={`p-1.5 rounded-lg transition-all ${canGoForward ? 'hover:bg-zinc-200/70 text-zinc-600' : 'text-zinc-300 cursor-not-allowed'}`}
          title={t('forward') || "Forward"}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Fake URL Bar */}
      <div className="flex-1 flex items-center gap-2.5 h-9 px-4 bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all focus-within:ring-2 focus-within:ring-primary/10">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <div className="flex items-center text-[13px] font-medium overflow-hidden tracking-tight">
          <span className="text-zinc-400 mr-0.5 shrink-0">https://</span>
          <span className="text-zinc-700 shrink-0 font-bold">preview.whale-tanks.dev</span>
          {path && <span className="text-zinc-400 shrink-0">{path}</span>}
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-3">
          {renderableIndexes.length > 0 && (
            <span className="text-[10px] text-zinc-500 font-bold bg-zinc-100/80 px-2 py-0.5 rounded-full border border-zinc-200/50 leading-none">
              {currentIndexInRenderable + 1} / {renderableIndexes.length}
            </span>
          )}
          <Search className="w-4 h-4 text-zinc-300" />
        </div>
      </div>

      <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50 rounded-lg transition-all">
        <Menu className="w-4 h-4 shrink-0" />
      </button>
    </div>
  )
}
