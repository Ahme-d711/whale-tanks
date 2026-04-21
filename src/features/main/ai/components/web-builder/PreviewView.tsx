"use client"

import React, { useMemo } from 'react'
import { Code2, Globe } from 'lucide-react'

interface PreviewViewProps {
  code: string
}

export default function PreviewView({ code }: PreviewViewProps) {
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

  const iframeSrc = useMemo(() => {
    if (!code || !isRenderable) return ""

    // Clean code by removing ALL import statements (not supported in simple browser-side babel)
    // and removing any export keywords that might break local definition
    const cleanCode = code
      .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+/g, 'const MainExport = ')
      .replace(/export\s+(const|function|class)/g, '$1')

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
            body { background: white; min-height: 100vh; margin: 0; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: start; justify-content: center; }
            #root { width: 100%; height: 100%; }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          </style>

          <script>
            window.next = {
              link: (props) => React.createElement('a', { ...props, href: props.href || '#' }, props.children),
              image: (props) => React.createElement('img', { ...props })
            };
            window.Lucide = new Proxy({}, { 
              get: (target, prop) => (props) => React.createElement('div', { 
                ...props, 
                style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0', color: '#64748b', borderRadius: '4px', padding: '2px', ...(props.style || {}) }
              }, prop[0]) 
            });
          </script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect, useMemo, useCallback, useRef, forwardRef } = React;
            try {
              ${cleanCode}
              const findComponent = () => {
                if (typeof MainExport !== 'undefined') return MainExport;
                const commonNames = ['App', 'SimpleLoginCard', 'LoginCard', 'Page', 'Main', 'Dashboard'];
                for (const name of commonNames) {
                  if (typeof window[name] === 'function') return window[name];
                }
                const globals = Object.keys(window).reverse();
                for (const key of globals) {
                  if (typeof window[key] === 'function' && /^[A-Z]/.test(key) && !['React', 'ReactDOM', 'Babel'].includes(key)) {
                    return window[key];
                  }
                }
                return null;
              };

              const RootComponent = findComponent();
              if (RootComponent) {
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(<RootComponent />);
              } else {
                document.getElementById('root').innerHTML = '<div style="padding: 40px; text-align: center; color: #94a3b8;">Waiting for code completion...</div>';
              }
            } catch (err) {
              document.getElementById('root').innerHTML = \`
                <div style="padding: 24px; color: #ef4444; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; margin: 20px; font-family: monospace;">
                  <h3 style="margin-top:0; font-size: 16px;">Render Error</h3>
                  <pre style="white-space: pre-wrap; font-size: 12px;">\${err.message}</pre>
                </div>
              \`;
            }
          </script>
        </body>
      </html>
    `
    return template
  }, [code, isRenderable])

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
