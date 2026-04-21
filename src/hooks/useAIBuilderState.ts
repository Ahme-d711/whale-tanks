import { useState, useMemo, useEffect } from 'react'
import { detectContentType } from '@/features/main/ai/utils/code-detection'

export function useAIBuilderState() {
  const [webBuilderBlocks, setWebBuilderBlocks] = useState<string[]>([])
  const [dbBlocks, setDbBlocks] = useState<string[]>([])
  const [activeBlockIndex, setActiveBlockIndex] = useState(0)
  const [activeDbBlockIndex, setActiveDbBlockIndex] = useState(0)
  const [activeAction, setActiveAction] = useState<'consultation' | 'web_builder'>('consultation')
  const [activeSubAction, setActiveSubAction] = useState<'code' | 'view' | 'database'>('code')

  const canView = useMemo(() => {
    const activeCode = webBuilderBlocks[activeBlockIndex] || ""
    return detectContentType(activeCode).contentType !== 'none'
  }, [webBuilderBlocks, activeBlockIndex])

  // Auto-switch away from "View" if the active block is not renderable
  useEffect(() => {
    if (activeSubAction === 'view' && !canView) {
      setActiveSubAction('code')
    }
  }, [canView, activeSubAction])

  return {
    webBuilderBlocks,
    setWebBuilderBlocks,
    dbBlocks,
    setDbBlocks,
    activeBlockIndex,
    setActiveBlockIndex,
    activeDbBlockIndex,
    setActiveDbBlockIndex,
    activeAction,
    setActiveAction,
    activeSubAction,
    setActiveSubAction,
    canView
  }
}
