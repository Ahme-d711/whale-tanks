import { create } from 'zustand'

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

interface ChatState {
  messages: Message[];
  sessionId: string | null;
  isHistoryLoading: boolean;
  
  // Actions
  setMessages: (messages: Message[]) => void;
  setSessionId: (id: string | null) => void;
  setIsHistoryLoading: (isLoading: boolean) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sessionId: null,
  isHistoryLoading: false,

  setMessages: (messagesOrFn) => 
    set((state) => ({ 
      messages: typeof messagesOrFn === 'function' 
        ? (messagesOrFn as any)(state.messages) 
        : messagesOrFn 
    })),

  setSessionId: (idOrFn) => 
    set((state) => ({ 
      sessionId: typeof idOrFn === 'function' 
        ? (idOrFn as any)(state.sessionId) 
        : idOrFn 
    })),

  setIsHistoryLoading: (isLoadingOrFn) => 
    set((state) => ({ 
      isHistoryLoading: typeof isLoadingOrFn === 'function' 
        ? (isLoadingOrFn as any)(state.isHistoryLoading) 
        : isLoadingOrFn 
    })),

  resetChat: () => set({ messages: [], sessionId: null, isHistoryLoading: false }),
}))
