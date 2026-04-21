"use client"

import React from 'react'
import CodeView from './web-builder/CodeView'
import PreviewView from './web-builder/PreviewView'
import DatabaseView from './web-builder/DatabaseView'

interface WebBuilderProps {
  blocks: string[]
  activeIndex: number
  onIndexChange: (index: number) => void
  activeSubAction: 'code' | 'view' | 'database'
}

export default function WebBuilder({ 
  blocks, 
  activeIndex, 
  onIndexChange, 
  activeSubAction 
}: WebBuilderProps) {
  const currentCode = blocks[activeIndex] || ""

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
      {activeSubAction === 'code' && (
        <CodeView 
          code={currentCode} 
          blocksCount={blocks.length}
          activeIndex={activeIndex}
          onIndexChange={onIndexChange}
        />
      )}
      {activeSubAction === 'view' && (
        <PreviewView 
          code={currentCode} 
          blocksCount={blocks.length}
          activeIndex={activeIndex}
          onIndexChange={onIndexChange}
        />
      )}
      {activeSubAction === 'database' && <DatabaseView />}
    </div>
  )
}
