"use client"

import React, { useMemo } from 'react'
import { Share2 } from 'lucide-react'

interface DatabaseVisualizerProps {
  code: string
  iframeRef?: React.RefObject<HTMLIFrameElement | null>
}

export const DatabaseVisualizer = ({ code, iframeRef }: DatabaseVisualizerProps) => {
  // Generate Mermaid ERD code from SQL/Prisma if possible
  const mermaidGraph = useMemo(() => {
    if (!code) return ""
    const lower = code.toLowerCase()
    
    if (lower.startsWith('erdiagram') || lower.startsWith('graph ')) return code

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
            body { 
              background: transparent; 
              margin: 0; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh;
              padding: 20px; 
              font-family: sans-serif; 
              overflow: auto;
              box-sizing: border-box;
            }
            #graph { 
              width: 100%; 
              max-width: ${mermaidGraph.split(' {\n').length < 4 ? '500px' : '100%'};
              display: flex; 
              justify-content: center; 
              padding: 20px;
            }
            .mermaid .entityBox { fill: #fff !important; }
            .mermaid .entityLabel { fill: #fff !important; }
            .mermaid .attributeBoxOdd, .mermaid .attributeBoxEven { fill: #f8fafc !important; }
            .mermaid text { fill: #18181b !important; }
            .mermaid .entityHeader text { fill: #ffffff !important; }
            svg { max-width: 100% !important; height: auto !important; }
          </style>
        </head>
        <body>
          <div id="graph" class="mermaid">${mermaidGraph}</div>
          <script>
            mermaid.initialize({ 
              startOnLoad: true, 
              theme: 'base',
              useMaxWidth: true,
              themeVariables: {
                primaryColor: '#3b82f6',
                primaryTextColor: '#fff',
                primaryBorderColor: '#2563eb',
                lineColor: '#64748b',
                secondaryColor: '#f8fafc',
                tertiaryColor: '#f8fafc',
                attributeTextColor: '#18181b', // Dark zinc for readability
                nodeTextColor: '#18181b',
                mainBkg: '#ffffff',
              }
            });
          </script>
        </body>
      </html>
    `
  }, [mermaidGraph])

  if (!mermaidGraph) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 opacity-30">
        <Share2 className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">Visualization Unavailable</p>
        <p className="text-sm max-w-[280px]">We couldn't generate a diagram for this snippet. Try switching to Code view.</p>
      </div>
    )
  }

  return (
    <iframe 
      ref={iframeRef}
      srcDoc={iframeSrc}
      className="w-full h-full border-0"
      title="ER Diagram"
      sandbox="allow-scripts allow-same-origin"
    />
  )
}
