"use client"

import React, { useMemo, useEffect, useState } from 'react'
import { Share2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

// We will import mermaid dynamically to avoid SSR and resolution issues
let mermaid: any = null;
if (typeof window !== 'undefined') {
  import('mermaid').then(m => {
    mermaid = m.default;
  });
}

interface DatabaseVisualizerProps {
  code: string
  iframeRef?: React.RefObject<HTMLIFrameElement | null> // Keeping for compatibility but using SVG locally
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export const DatabaseVisualizer = ({ code, containerRef }: DatabaseVisualizerProps) => {
  const [svgContent, setSvgContent] = useState<string>("")
  const [isRendering, setIsRendering] = useState(false)

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      er: {
        useMaxWidth: false, // Moved inside er for Mermaid 10+
      },
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#fff',
        primaryBorderColor: '#2563eb',
        lineColor: '#64748b',
        secondaryColor: '#f8fafc',
        tertiaryColor: '#f8fafc',
        attributeTextColor: '#18181b',
        nodeTextColor: '#18181b',
        mainBkg: '#ffffff',
      }
    })
  }, [])

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

  // Render SVG when graph changes
  useEffect(() => {
    if (!mermaidGraph) {
      setSvgContent("")
      return
    }

    const renderGraph = async () => {
      setIsRendering(true)
      try {
        const m = (await import('mermaid')).default
        m.initialize({
          startOnLoad: false,
          theme: 'base',
          er: { useMaxWidth: false },
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#fff',
            primaryBorderColor: '#2563eb',
            lineColor: '#64748b',
            secondaryColor: '#f8fafc',
            tertiaryColor: '#f8fafc',
            attributeTextColor: '#18181b',
            nodeTextColor: '#18181b',
            mainBkg: '#ffffff',
          }
        })
        
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg } = await m.render(id, mermaidGraph)
        setSvgContent(svg)
      } catch (err) {
        console.error("Mermaid render error:", err)
        setSvgContent("")
      } finally {
        setIsRendering(false)
      }
    }

    renderGraph()
  }, [mermaidGraph])

  if (!mermaidGraph || (!svgContent && !isRendering)) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 opacity-30">
        <Share2 className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">Visualization Unavailable</p>
        <p className="text-sm max-w-[280px]">We couldn't generate a diagram for this snippet.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative bg-zinc-50/50 overflow-hidden" ref={containerRef}>
      {isRendering ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <TransformWrapper
          initialScale={1}
          minScale={0.2}
          maxScale={5}
          centerOnInit
          limitToBounds={false}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Floating Controls */}
              <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
                <button 
                  onClick={() => zoomIn()}
                  className="p-2.5 bg-white border shadow-xl rounded-xl hover:bg-zinc-50 text-zinc-600 transition-all hover:scale-110 active:scale-95"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => zoomOut()}
                  className="p-2.5 bg-white border shadow-xl rounded-xl hover:bg-zinc-50 text-zinc-600 transition-all hover:scale-110 active:scale-95"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => resetTransform()}
                  className="p-2.5 bg-white border shadow-xl rounded-xl hover:bg-zinc-50 text-zinc-600 transition-all hover:scale-110 active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              <TransformComponent
                wrapperStyle={{ width: '100%', height: '100%' }}
                contentStyle={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <div 
                  className="mermaid-viewer p-10 cursor-grab active:cursor-grabbing"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}
    </div>
  )
}
