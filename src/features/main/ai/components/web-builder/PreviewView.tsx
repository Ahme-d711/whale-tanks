"use client"

import React, { useMemo } from 'react'
import { Code2, Globe } from 'lucide-react'

interface PreviewViewProps {
  code: string
}

export default function PreviewView({ code }: PreviewViewProps) {
  const { contentType, isFragment } = useMemo(() => {
    if (!code) return { contentType: 'none', isFragment: false }
    const trimmed = code.trim()
    const lower = trimmed.toLowerCase()
    
    if (lower.startsWith('<!doctype html>') || lower.startsWith('<html') || lower.includes('<head>') || lower.includes('<body>')) {
      return { contentType: 'html', isFragment: false }
    }

    const looksLikeFragment = (trimmed.startsWith('<') || trimmed.startsWith('(')) && 
                              !trimmed.includes('function') && 
                              !trimmed.includes('const') &&
                              !trimmed.includes('class') &&
                              !trimmed.includes('import ')

    return { contentType: 'react', isFragment: looksLikeFragment }
  }, [code])

  const isRenderable = useMemo(() => {
    return contentType !== 'none'
  }, [contentType])

  const iframeSrc = useMemo(() => {
    if (!code || !isRenderable) return ""

    if (contentType === 'html') {
      // If it's HTML, we just ensure Tailwind is there if they might want it
      if (!code.toLowerCase().includes('tailwindcss.com')) {
        return code.replace('</head>', '<script src="https://cdn.tailwindcss.com"></script></head>')
      }
      return code
    }

    // For React/Next.js
    let processedCode = code
      .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+/g, 'const MainExport = ')
      .replace(/export\s+(const|function|class)/g, '$1')

    if (isFragment) {
      processedCode = `const GeneratedFragment = () => (${processedCode});\nconst MainExport = GeneratedFragment;`
    }

    const template = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body { background: white; min-height: 100vh; margin: 0; font-family: system-ui, -apple-system, sans-serif; }
            #root { width: 100%; height: 100%; }
          </style>
          <script>
            window.next = {
              link: (p) => React.createElement('a', { ...p, href: p.href || '#' }, p.children),
              image: (p) => React.createElement('img', { ...p })
            };
            window.Lucide = new Proxy({}, { 
              get: (t, prop) => (p) => React.createElement('div', { 
                ...p, 
                style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '4px', padding: '2px', ...(p.style || {}) }
              }, prop[0]) 
            });
          </script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect, useMemo, useCallback, useRef, forwardRef } = React;
            try {
              ${processedCode}
              const findComp = () => {
                if (typeof MainExport !== 'undefined') return MainExport;
                const names = ['App', 'SimpleLoginCard', 'LoginCard', 'Page', 'Main', 'Dashboard'];
                for (const n of names) if (typeof window[n] === 'function') return window[n];
                const ks = Object.keys(window).reverse();
                for (const k of ks) if (typeof window[k] === 'function' && /^[A-Z]/.test(k) && !['React', 'ReactDOM', 'Babel'].includes(k)) return window[k];
                return null;
              };
              const Root = findComp();
              if (Root) {
                ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
              } else {
                document.getElementById('root').innerHTML = '<div style="padding: 40px; text-align: center; color: #94a3b8;">Defining component...</div>';
              }
            } catch (err) {
              document.getElementById('root').innerHTML = \`
                <div style="padding: 20px; color: #ef4444; background: #fff1f2; border: 1px solid #fecaca; border-radius: 8px; margin: 20px; font-family: monospace; font-size: 13px;">
                  <strong>Render Error:</strong><br/>\${err.message}
                </div>\`;
            }
          </script>
        </body>
      </html>
    `
    return template
  }, [code, contentType, isFragment, isRenderable])

  return (
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
  )
}
