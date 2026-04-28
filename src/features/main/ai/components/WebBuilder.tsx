"use client"

import CodeView from './web-builder/CodeView'
import PreviewView from './web-builder/PreviewView'
import DatabaseView from './web-builder/DatabaseView'

interface WebBuilderProps {
  blocks: string[]
  activeIndex: number
  onIndexChange: (index: number) => void
  dbBlocks: string[]
  activeDbIndex: number
  onDbIndexChange: (index: number) => void
  activeSubAction: 'code' | 'view' | 'database'
  sessionId?: string | null
}

export default function WebBuilder({ 
  blocks, 
  activeIndex, 
  onIndexChange,
  dbBlocks,
  activeDbIndex,
  onDbIndexChange,
  activeSubAction,
  sessionId
}: WebBuilderProps) {
  const currentCode = blocks[activeIndex] || ""
  const currentDbCode = dbBlocks[activeDbIndex] || ""

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
          allBlocks={blocks}
          activeBlockIndex={activeIndex}
          sessionId={sessionId}
        />
      )}
      {activeSubAction === 'database' && (
        <DatabaseView 
          code={currentDbCode}
          blocksCount={dbBlocks.length}
          activeIndex={activeDbIndex}
          onIndexChange={onDbIndexChange}
        />
      )}
    </div>
  )
}
