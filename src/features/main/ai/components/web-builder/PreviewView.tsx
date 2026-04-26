"use client"

import React, { useMemo } from 'react'
import { Code2, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
import { detectContentType } from '../../utils/code-detection'

interface PreviewViewProps {
  code: string
  blocksCount: number
  activeIndex: number
  onIndexChange: (index: number) => void
}

export default function PreviewView({ 
  code, 
  blocksCount, 
  activeIndex, 
  onIndexChange 
}: PreviewViewProps) {
  const { contentType, isFragment } = useMemo(() => detectContentType(code), [code])

  const isRenderable = useMemo(() => contentType !== 'none', [contentType])
  const isMobile = useMemo(() => ['flutter', 'swift', 'kotlin'].includes(contentType), [contentType])

  const iframeSrc = useMemo(() => {
    if (!code || !isRenderable) return ""

    const baseStyle = `
      body { background: white; min-height: 100vh; margin: 0; font-family: system-ui, -apple-system, sans-serif; }
      #root { width: 100%; height: 100%; }
      .mermaid { display: flex; justify-content: center; padding: 20px; }
      pre[run-dartpad] { margin: 0; height: 100vh; width: 100vw; }
    `

    // --- FLUTTER MODE ---
    if (contentType === 'flutter') {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <script type="text/javascript" src="https://dartpad.dev/inject_embed.dart.js" defer></script>
            <style>${baseStyle}</style>
          </head>
          <body style="overflow: hidden;">
            <pre run-dartpad="true" mode-flutter="true" theme-light="true" style="border:none;">
${code}
            </pre>
          </body>
        </html>
      `
    }

    // --- NATIVE MOBILE VISUALIZATIONS (SWIFT/KOTLIN) ---
    if (contentType === 'swift' || contentType === 'kotlin') {
      const langName = contentType === 'swift' ? 'SwiftUI' : 'Jetpack Compose'
      const icon = contentType === 'swift' ? '🍎' : '🤖'
      return `
        <!DOCTYPE html>
        <html>
          <head><style>${baseStyle}</style></head>
          <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px; background:#f8fafc;">
            <div style="font-size:60px; margin-bottom:20px;">${icon}</div>
            <h2 style="color:#1e293b; margin-bottom:10px;">${langName} Native Code</h2>
            <p style="color:#64748b; max-width:280px; font-size:14px; line-height:1.6;">
              This is a native mobile component. While true execution requires a native environment, you can view the structure in the <strong>Code</strong> tab.
            </p>
            <div style="margin-top:20px; padding:10px 20px; background:#e2e8f0; border-radius:30px; font-size:12px; font-weight:bold; color:#475569;">
              BLUE WHALE MOBILE BLUEPRINT
            </div>
          </body>
        </html>
      `
    }

    // --- MERMAID MODE ---
    if (contentType === 'mermaid') {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
            <style>${baseStyle}</style>
          </head>
          <body>
            <div class="mermaid">${code}</div>
            <script>
              mermaid.initialize({ startOnLoad: true, theme: 'forest' });
            </script>
          </body>
        </html>
      `
    }

    // --- HTML / ALPINE MODE ---
    if (contentType === 'html' || contentType === 'alpine') {
      let html = code
      if (!html.toLowerCase().includes('tailwindcss.com')) {
        html = html.replace('</head>', '<script src="https://cdn.tailwindcss.com"></script></head>')
      }
      if (contentType === 'alpine' && !html.toLowerCase().includes('alpinejs')) {
        html = html.replace('</head>', '<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script></head>')
      }
      return html
    }

    // --- VUE MODE ---
    if (contentType === 'vue') {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>${baseStyle}</style>
          </head>
          <body>
            <div id="root">${code.includes('{{') ? code : ''}</div>
            <script>
              const { createApp } = Vue;
              try {
                ${code.includes('createApp') ? code : `createApp({}).mount('#root')`}
              } catch (e) {
                document.getElementById('root').innerHTML = '<div style="color: red">Vue Render Error: ' + e.message + '</div>';
              }
            </script>
          </body>
        </html>
      `
    }

    // --- REACT MODE (Default) ---
    let processedCode = code
      .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+/g, 'const MainExport = ')
      .replace(/export\s+(const|function|class)/g, '$1')

    if (isFragment) {
      processedCode = `const GeneratedFragment = () => (${processedCode});\nconst MainExport = GeneratedFragment;`
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/zod@3.23.8/lib/index.umd.js"></script>
          <script src="https://unpkg.com/react-hook-form@7.51.5/dist/index.umd.js"></script>
          <script src="https://unpkg.com/@hookform/resolvers@3.3.4/dist/zod.umd.js"></script>
          <script src="https://unpkg.com/framer-motion@11.0.8/dist/framer-motion.js"></script>
          <script src="https://unpkg.com/lucide-react@0.363.0/dist/umd/lucide-react.js"></script>
          <script src="https://unpkg.com/recharts@2.12.2/umd/Recharts.js"></script>
          <script src="https://unpkg.com/clsx@2.1.0/dist/clsx.min.js"></script>
          <style>${baseStyle}</style>
          <script>
            window.next={link:p=>React.createElement('a',{...p,href:p.href||'#'},p.children),image:p=>React.createElement('img',{...p})};
            window.cn=(...args)=>window.clsx?(window.clsx(...args)):args.filter(Boolean).join(' ');
            // Mapping for common imports
            window.framerMotion = window.Motion;
            window.Recharts = window.Recharts || {};
          </script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect, useMemo, useCallback, useRef, forwardRef } = React;
            const z = window.z || window.zod;
            const { useForm, Controller, useFieldArray, useWatch } = window.ReactHookForm || {};
            const { zodResolver } = window.ZodResolver || {};
            const motion = window.Motion ? window.Motion.motion : (window.framerMotion ? window.framerMotion.motion : null);
            const AnimatePresence = window.Motion ? window.Motion.AnimatePresence : (window.framerMotion ? window.framerMotion.AnimatePresence : null);
            const Lucide = window.LucideReact || {};
            const { 
              LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
              CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area
            } = window.Recharts || {};
            const cn = window.cn;
            try {
              ${processedCode}
              const findComp = () => {
                if (typeof MainExport !== 'undefined') return MainExport;
                const names = ['App','SimpleLoginCard','LoginCard','Page','Main','Dashboard'];
                for (const n of names) if (typeof window[n] === 'function') return window[n];
                const ks = Object.keys(window).reverse();
                for (const k of ks) if (typeof window[k] === 'function' && /^[A-Z]/.test(k) && !['React','ReactDOM','Babel'].includes(k)) return window[k];
                return null;
              };
              const Root = findComp();
              if (Root) ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
              else document.getElementById('root').innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8;">Defining component...</div>';
            } catch (err) {
              document.getElementById('root').innerHTML = '<div style="padding:20px;color:#ef4444;background:#fff1f2;border:1px solid #fecaca;border-radius:8px;margin:20px;font-family:monospace;font-size:13px;"><strong>Render Error:</strong><br/>'+err.message+'</div>';
            }
          </script>
        </body>
      </html>
    `
  }, [code, contentType, isFragment, isRenderable])

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-100 p-4 relative group">
      <div className={`flex-1 flex items-center justify-center relative ${isMobile ? 'py-4' : ''}`}>
        {/* Mobile Frame (Conditional) */}
        <div className={`relative transition-all duration-500 ${
          isMobile 
            ? 'w-[320px] h-[640px] bg-zinc-900 rounded-[3rem] p-3 shadow-2xl border-[6px] border-zinc-800' 
            : 'w-full h-full bg-white rounded-xl shadow-inner border overflow-hidden'
        }`}>
          {isMobile && (
            <>
              {/* Speaker */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-zinc-800 rounded-b-2xl z-20"></div>
              {/* Home Indicator */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/20 rounded-full z-20"></div>
            </>
          )}

          <div className={`w-full h-full overflow-hidden ${isMobile ? 'rounded-[2.2rem] bg-white' : ''}`}>
            {code && isRenderable ? (
              <iframe
                srcDoc={iframeSrc}
                title="AI Web Builder Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
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
      </div>
    </div>
  )
}
