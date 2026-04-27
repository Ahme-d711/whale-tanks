"use client"

import React from 'react'

interface DatabaseCodeViewProps {
  code: string
}

export const DatabaseCodeView = ({ code }: DatabaseCodeViewProps) => {
  return (
    <div className="h-full bg-[#0d1117] overflow-auto p-6 font-mono text-[13px] leading-relaxed">
      <pre className="text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}
