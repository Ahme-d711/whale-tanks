"use client"

import React from 'react'
import { Database as DBIcon } from 'lucide-react'

export default function DatabaseView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
      <DBIcon className="w-12 h-12 mb-4" />
      <p className="text-lg font-medium">Database Management</p>
      <p className="text-sm">Schema and data analysis visualization coming soon.</p>
    </div>
  )
}
