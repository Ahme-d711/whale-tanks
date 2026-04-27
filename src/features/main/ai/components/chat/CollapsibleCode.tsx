"use client"

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, ChevronUp, Code, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface CollapsibleCodeProps {
  code: string
  lang: string
  initiallyCollapsed?: boolean
}

export const CollapsibleCode = ({ code, lang, initiallyCollapsed }: CollapsibleCodeProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(initiallyCollapsed ?? false);
  const [activeFileIndex, setActiveFileIndex] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

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
