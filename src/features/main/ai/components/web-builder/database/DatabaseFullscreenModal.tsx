"use client"

import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Database as DBIcon, Download, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DatabaseVisualizer } from './DatabaseVisualizer'

interface DatabaseFullscreenModalProps {
  isOpen: boolean
  onClose: () => void
  code: string
  onDownloadImage: () => void
  onDownloadPDF: () => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

export const DatabaseFullscreenModal = ({
  isOpen,
  onClose,
  code,
  onDownloadImage,
  onDownloadPDF,
  containerRef
}: DatabaseFullscreenModalProps) => {
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-9999 bg-white flex flex-col"
        >
          <div className="h-16 border-b flex items-center justify-between px-6 bg-zinc-50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl">
                <DBIcon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg text-zinc-800">Full Database Schema Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onDownloadImage} className="gap-2 border-primary/20 hover:bg-primary/5">
                <Download className="w-4 h-4" />
                PNG
              </Button>
              <Button variant="outline" size="sm" onClick={onDownloadPDF} className="gap-2 border-primary/20 hover:bg-primary/5">
                <FileText className="w-4 h-4" />
                PDF
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-4 sm:p-10 bg-zinc-100/30">
            <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden relative">
              <DatabaseVisualizer code={code} containerRef={containerRef} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
