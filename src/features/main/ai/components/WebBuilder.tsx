"use client"

import CodeView from './web-builder/CodeView'
import PreviewView from './web-builder/PreviewView'
import DatabaseView from './web-builder/DatabaseView'

interface WebBuilderProps {
  code: string
  activeSubAction: 'code' | 'view' | 'database'
}

export default function WebBuilder({ code, activeSubAction }: WebBuilderProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
      {activeSubAction === 'code' && <CodeView code={code} />}
      {activeSubAction === 'view' && <PreviewView code={code} />}
      {activeSubAction === 'database' && <DatabaseView />}
    </div>
  )
}
