import { create } from 'zustand'
import { detectContentType } from '@/features/main/ai/utils/code-detection'

interface AIBuilderState {
  webBuilderBlocks: string[];
  dbBlocks: string[];
  activeBlockIndex: number;
  activeDbBlockIndex: number;
  activeAction: 'consultation' | 'web_builder';
  activeSubAction: 'code' | 'view' | 'database';
  
  // Actions
  setWebBuilderBlocks: (blocks: string[]) => void;
  setDbBlocks: (blocks: string[]) => void;
  setActiveBlockIndex: (index: number) => void;
  setActiveDbBlockIndex: (index: number) => void;
  setActiveAction: (action: 'consultation' | 'web_builder') => void;
  setActiveSubAction: (subAction: 'code' | 'view' | 'database') => void;
  resetBuilder: () => void;
}

export const useAIBuilderStore = create<AIBuilderState>((set, get) => ({
  webBuilderBlocks: [],
  dbBlocks: [],
  activeBlockIndex: 0,
  activeDbBlockIndex: 0,
  activeAction: 'consultation',
  activeSubAction: 'code',

  setWebBuilderBlocks: (blocks) => set({ webBuilderBlocks: blocks }),
  setDbBlocks: (blocks) => set({ dbBlocks: blocks }),
  setActiveBlockIndex: (index) => set({ activeBlockIndex: index }),
  setActiveDbBlockIndex: (index) => set({ activeDbBlockIndex: index }),
  setActiveAction: (action) => set({ activeAction: action }),
  setActiveSubAction: (subAction) => set({ activeSubAction: subAction }),
  
  resetBuilder: () => set({
    webBuilderBlocks: [],
    dbBlocks: [],
    activeBlockIndex: 0,
    activeDbBlockIndex: 0,
    activeAction: 'consultation',
    activeSubAction: 'code'
  }),
}))

// Selector helper for canView
export const useCanView = () => {
  const { webBuilderBlocks, activeBlockIndex } = useAIBuilderStore();
  const activeCode = webBuilderBlocks[activeBlockIndex] || "";
  return detectContentType(activeCode).contentType !== 'none';
}
