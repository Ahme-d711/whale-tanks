"use client"

import React from 'react'
import { SquarePen, Trash2, LayoutGrid, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface MobileNavbarProps {
  onOpenSidebar: () => void
  onNewChat: () => void
  onDeleteChat: () => void
  currentView: 'chat' | 'builder'
  onToggleView: () => void
}

export default function MobileNavbar({ 
  onOpenSidebar, 
  onNewChat, 
  onDeleteChat,
  currentView,
  onToggleView
}: MobileNavbarProps) {
  return (
    <div className="flex md:hidden items-center justify-between px-4 py-3 w-full h-14 z-40 fixed top-0 left-0 right-0 shadow-sm bg-background/80 backdrop-blur-md border-b border-zinc-100">
      <div className="flex items-center gap-1">
        <button 
          onClick={onOpenSidebar}
          className="p-2 focus:outline-none"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <line x1="4" y1="8" x2="20" y2="8" />
            <line x1="4" y1="16" x2="14" y2="16" />
          </svg>
        </button>
        <Link href="/">
          <span className="font-bold text-lg tracking-tight text-primary">Whale Tanks</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onToggleView}
          className="p-2 text-primary hover:text-primary/80 focus:outline-none transition-colors"
          title={currentView === 'chat' ? 'Consultation & Builder' : 'Chat'}
        >
          {currentView === 'chat' ? (
            <LayoutGrid className="w-5 h-5 animate-in zoom-in-50 duration-200" />
          ) : (
            <MessageSquare className="w-5 h-5 animate-in zoom-in-50 duration-200" />
          )}
        </button>
        <button 
          onClick={onNewChat}
          className="p-2 text-primary hover:text-primary/80 focus:outline-none transition-colors"
        >
          <SquarePen className="w-5 h-5" />
        </button>
        <button 
          onClick={onDeleteChat}
          className="p-2 text-red-500 hover:text-red-400 focus:outline-none transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
