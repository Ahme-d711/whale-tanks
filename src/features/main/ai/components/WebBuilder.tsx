"use client"

import React, { useMemo } from 'react'
import { Code2, Globe, Database as DBIcon, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface WebBuilderProps {
  code: string
  activeSubAction: 'code' | 'view' | 'database'
}

export default function WebBuilder({ code, activeSubAction }: WebBuilderProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success("Code copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const iframeSrc = useMemo(() => {
    if (!code) return ""

    const template = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body { background: white; min-height: 100vh; margin: 0; }
            /* Custom Scrollbar for iframe */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #f1f1f1; }
            ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #555; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect, useMemo, useCallback, useRef } = React;
            
            // Allow components to be defined in the code
            ${code}

            // Attempt to find the main component to render
            // We look for export default or common names like App/LoginCard/Main
            const MainComponent = typeof App !== 'undefined' ? App : 
                                 typeof LoginCard !== 'undefined' ? LoginCard :
                                 typeof Page !== 'undefined' ? Page :
                                 // If no common names found, try to find the last defined function
                                 (() => {
                                   try {
                                     // This is a bit hacky but works for many AI outputs
                                     const lines = \`${code}\`.split('\\n');
                                     for (let i = lines.length - 1; i >= 0; i--) {
                                       const match = lines[i].match(/(?:const|function)\\s+([a-zA-Z0-9_]+)/);
                                       if (match && typeof window[match[1]] === 'function') return window[match[1]];
                                     }
                                   } catch(e) {}
                                   return null;
                                 })();

            if (MainComponent) {
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(<MainComponent />);
            } else {
              document.getElementById('root').innerHTML = '<div style="padding: 20px; color: #666; font-family: sans-serif;">Wait for code to complete or ensure a component is defined...</div>';
            }
          </script>
          <!-- Load React directly from CDN -->
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        </body>
      </html>
    `
    return template
  }, [code])

  const isRenderable = useMemo(() => {
    if (!code) return false
    const lowerCode = code.toLowerCase()
    return lowerCode.includes('import react') || 
           lowerCode.includes('export default') || 
           lowerCode.includes('return (') || 
           lowerCode.includes('<div') ||
           lowerCode.includes('<!doctype html>') ||
           lowerCode.includes('function') ||
           lowerCode.includes('const')
  }, [code])

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
      {activeSubAction === 'code' && (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0d1117]">
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded bg-primary/20">
                <Code2 className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                Source Code
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy} 
              className="h-7 gap-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/10"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-5 custom-scrollbar">
            <pre className="text-sm font-mono text-zinc-300 whitespace-pre leading-relaxed">
              <code>{code || "// No code generated yet..."}</code>
            </pre>
          </div>
        </div>
      )}

      {activeSubAction === 'view' && (
        <div className="flex-1 flex flex-col min-h-0 bg-zinc-100 p-4">
          <div className="flex-1 bg-white rounded-xl shadow-inner border overflow-hidden relative">
            {code && isRenderable ? (
              <iframe
                srcDoc={iframeSrc}
                title="AI Web Builder Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            ) : code ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-40">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Code2 className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium">Non-Visual Code</p>
                <p className="text-sm max-w-[280px]">This snippet appears to be a configuration, style, or setup file. Use the "Code" tab to view it.</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-40">
                <Globe className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">Preview Area</p>
                <p className="text-sm">The generated web UI will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubAction === 'database' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
          <DBIcon className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium">Database Management</p>
          <p className="text-sm">Schema and data analysis visualization coming soon.</p>
        </div>
      )}
    </div>
  )
}
