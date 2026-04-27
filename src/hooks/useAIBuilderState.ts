import { useEffect } from 'react'
import { useAIBuilderStore, useCanView } from './useAIBuilderStore'

export function useAIBuilderState() {
  const store = useAIBuilderStore()
  const canView = useCanView()

  // Auto-switch away from "View" if the active block is not renderable
  useEffect(() => {
    if (store.activeSubAction === 'view' && !canView) {
      store.setActiveSubAction('code')
    }
  }, [canView, store.activeSubAction, store.setActiveSubAction])

  return {
    ...store,
    canView,
    reset: store.resetBuilder
  }
}
