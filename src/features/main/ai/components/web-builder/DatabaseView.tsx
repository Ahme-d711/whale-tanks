"use client"

import React, { useState, useMemo } from 'react'
import { Database as DBIcon, Code2, Share2, ChevronLeft, ChevronRight, LayoutPanelTop } from 'lucide-react'

interface DatabaseViewProps {
  code: string
  blocksCount: number
  activeIndex: number
  onIndexChange: (index: number) => void
}

export default function DatabaseView({ 
  code, 
  blocksCount, 
  activeIndex, 
  onIndexChange 
}: DatabaseViewProps) {
  const [viewMode, setViewMode] = useState<'code' | 'visual'>('visual')

  // Generate Mermaid ERD code from SQL/Prisma if possible
  const mermaidGraph = useMemo(() => {
    if (!code) return ""
    const lower = code.toLowerCase()
    
    // Simple heuristic: if it's already mermaid, return it
    if (lower.startsWith('erdiagram') || lower.startsWith('graph ')) return code

    // If it's Prisma or SQL, we'd ideally have a parser. 
    // For now, let's provide a stylized placeholder or simple mapping if we want to be fancy.
    // However, I can also try to "guess" tables for a simple Mermaid diagram.
    
    const tables: string[] = []
    const relations: { from: string, to: string, label: string }[] = []

    if (lower.includes('model ') || lower.includes('create table')) {
      const lines = code.split('\n')
      let currentTable = ""
      lines.forEach(line => {
        const tableMatch = line.match(/(model|CREATE TABLE)\s+(\w+)/i)
        if (tableMatch) {
          currentTable = tableMatch[2]
          tables.push(currentTable)
        }
        // Try to find foreign keys/relations
        const relMatch = line.match(/(\w+)\s+\w+\s+@relation|FOREIGN KEY\s+\((\w+)\)\s+REFERENCES\s+(\w+)/i)
        if (relMatch && currentTable) {
          relations.push({ from: currentTable, to: relMatch[3] || relMatch[1], label: "relates to" })
        }
      })
    }

    if (tables.length > 0) {
      let graph = "erDiagram\n"
      tables.forEach(t => {
        graph += `  ${t} {\n    string id\n    datetime created_at\n  }\n`
      })
      relations.forEach(r => {
        graph += `  ${r.from} ||--o{ ${r.to} : "${r.label}"\n`
      })
      return graph
    }

    return ""
  }, [code])

  const iframeSrc = useMemo(() => {
    if (!mermaidGraph) return ""
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
          <style>
            body { background: transparent; margin: 0; display: flex; justify-content: center; align-items: flex-start; padding: 20px; font-family: sans-serif; }
            #graph { width: 100%; display: flex; justify-content: center; }
          </style>
        </head>
        <body>
          <div id="graph" class="mermaid">${mermaidGraph}</div>
          <script>
            mermaid.initialize({ 
              startOnLoad: true, 
              theme: 'base',
              themeVariables: {
                primaryColor: '#3b82f6',
                primaryTextColor: '#fff',
                primaryBorderColor: '#2563eb',
                lineColor: '#94a3b8',
                secondaryColor: '#f1f5f9',
                tertiaryColor: '#fff'
              }
            });
          </script>
        </body>
      </html>
    `
  }, [mermaidGraph])

  if (!code) {
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

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white relative">
      {/* Header / Controls */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-zinc-50/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <DBIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-700">Database Schema</span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex p-1 bg-zinc-200/50 rounded-lg mr-2">
            <button 
              onClick={() => setViewMode('visual')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'visual' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700'}`}
              title="Visual Diagram"
            >
              <LayoutPanelTop className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('code')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'code' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700'}`}
              title="Raw Code"
            >
              <Code2 className="w-4 h-4" />
            </button>
          </div>

          {/* Version Arrows */}
          {blocksCount > 1 && (
            <div className="flex items-center gap-2 bg-white border rounded-lg px-2 py-1 shadow-sm">
              <button 
                onClick={() => onIndexChange(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="p-0.5 text-zinc-400 hover:text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-black text-zinc-500 min-w-[30px] text-center">
                {activeIndex + 1} / {blocksCount}
              </span>
              <button 
                onClick={() => onIndexChange(Math.min(blocksCount - 1, activeIndex + 1))}
                disabled={activeIndex === blocksCount - 1}
                className="p-0.5 text-zinc-400 hover:text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'visual' ? (
          mermaidGraph ? (
            <iframe 
              srcDoc={iframeSrc}
              className="w-full h-full border-0"
              title="ER Diagram"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 opacity-30">
               <Share2 className="w-12 h-12 mb-4" />
               <p className="text-lg font-medium">Visualization Unavailable</p>
               <p className="text-sm max-w-[280px]">We couldn't generate a diagram for this snippet. Try switching to Code view.</p>
            </div>
          )
        ) : (
          <div className="h-full bg-[#0d1117] overflow-auto p-6 font-mono text-[13px] leading-relaxed">
            <pre className="text-zinc-300">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
