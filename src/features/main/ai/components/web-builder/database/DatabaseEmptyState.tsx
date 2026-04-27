"use client"

import React from 'react'
import { Database as DBIcon } from 'lucide-react'

export const DatabaseEmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-zinc-50/50">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
         <DBIcon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-zinc-800 mb-2">No Schema Detected</h3>
      <p className="text-zinc-500 max-w-[320px] leading-relaxed">
        Ask the AI to generate a database schema, Prisma model, or SQL tables to see the architecture here.
      </p>
    </div>
  )
}
