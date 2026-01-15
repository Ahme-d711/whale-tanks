"use client"

import { SquarePen, Search } from "lucide-react"

export default function SidebarActions() {
  return (
    <div className="space-y-3 overflow-y-auto px-2">
      {/* New Chat */}
      <div className="flex  items-center gap-2 px-3 py-2 cursor-pointer hover:bg-secondary transition-colors rounded-xl">
        <div className="transition-colors rounded-lg flex items-center justify-center text-foreground">
          <SquarePen className="w-6 h-6" />
        </div>
        <span className="text-base text-foreground">New Chat</span>
      </div>

      {/* Search Row */}
      <div className="flex items-center gap-2 cursor-pointer group px-3 py-2 hover:bg-secondary transition-colors rounded-xl">
        <div className="flex items-center justify-center text-foreground">
          <Search className="w-6 h-6" />
        </div>
        <span className="text-base text-foreground">Search about Chats</span>
      </div>
    </div>
  )
}
