"use client"

import React, { useMemo, useState, useEffect } from "react"
import { toast } from "sonner"
import { useLocale } from 'next-intl'
import { detectContentType } from "../../utils/code-detection"
import PreviewToolbar from "./PreviewToolbar"
import BrowserShell from "./BrowserShell"
import PreviewDisplay from "./PreviewDisplay"

interface PreviewViewProps {
  code: string
  allBlocks?: string[]
  activeBlockIndex?: number
  totalBlocks?: number
  onIndexChange?: (index: number) => void
  sessionId?: string | null
}

type DeviceMode = "desktop" | "tablet" | "mobile"

export default function PreviewView({ 
  code, 
  allBlocks = [], 
  activeBlockIndex = 0,
  totalBlocks = 0,
  onIndexChange,
  sessionId 
}: PreviewViewProps) {
  const locale = useLocale()
  const [debouncedCode, setDebouncedCode] = useState(code)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop")
  const [isReloading, setIsReloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [key, setKey] = useState(0)
  
  const [snapshot, setSnapshot] = useState<{ code: string, blocks: string[], index: number } | null>(null)
  
  useEffect(() => {
    if (testMode && !snapshot) {
      setSnapshot({ code: debouncedCode, blocks: allBlocks, index: activeBlockIndex })
    } else if (!testMode) {
      setSnapshot(null)
    }
  }, [testMode, debouncedCode, allBlocks, activeBlockIndex])

  useEffect(() => {
    // When switching between pages (blocks), force a clean iframe reload
    setKey(prev => prev + 1)
  }, [activeBlockIndex])

  useEffect(() => {
    if (testMode) return;
    const timer = setTimeout(() => {
      if (code !== debouncedCode) {
        setIsReloading(true)
        setDebouncedCode(code)
        setTimeout(() => setIsReloading(false), 600)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [code, debouncedCode, testMode])

  const handleRefresh = () => {
    setIsReloading(true)
    setKey(prev => prev + 1)
    setTimeout(() => setIsReloading(false), 800)
  }

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success("Code copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenFullscreen = () => {
    if (sessionId) {
      window.open(`/${locale}/preview/${sessionId}?index=${activeBlockIndex}`, "_blank")
    } else {
      const win = window.open("", "_blank")
      if (win) {
        win.document.write(iframeSrc)
        win.document.close()
      }
    }
  }

  const iframeSrc = useMemo(() => {
    const effectiveCode = testMode && snapshot ? snapshot.code : debouncedCode
    const effectiveBlocks = testMode && snapshot ? snapshot.blocks : allBlocks
    const effectiveIndex = testMode && snapshot ? snapshot.index : activeBlockIndex

    if (!effectiveCode) return ""

    const escapeForTemplate = (str: string) => {
      return str
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\${/g, "\\${")
    }

    const prepareBlock = (c: string, isActive: boolean) => {
      let clean = c
        .replace(/import[\s\S]*?from\s+['"].*?['"];?/g, "")
        .replace(/export\s+default\s+/g, "const __DefaultExport__ = ")
        .replace(/export\s+/g, "");

      const names = [...c.matchAll(/export\s+(?:function|const|class|let|var)\s+(\w+)/g)].map(m => m[1]);
      let exportsWrapper = "";
      names.forEach(n => { exportsWrapper += `\n  window.${n} = ${n};`; });

      const usedComponents = [...new Set([...c.matchAll(/<([A-Z]\w+)/g)].map(m => m[1]))];
      let componentMocks = "";
      usedComponents.forEach(name => {
        componentMocks += `if (typeof ${name} === 'undefined' && typeof window.${name} === 'undefined') window.${name} = (props) => React.createElement('div', { className: 'p-2 border border-dashed border-zinc-300 rounded text-[10px] text-zinc-400 font-mono' }, 'Missing: <' + name + ' />');\n`;
      });

      const fullBlock = `{
        const exports = {};
        const module = { exports };
        ${componentMocks}
        ${clean}
        ${exportsWrapper}
        if (${isActive}) {
          if (typeof __DefaultExport__ !== 'undefined') {
            window.__DefaultExport__ = __DefaultExport__;
            window.__ActiveExport__ = __DefaultExport__;
          }
          ${names.map(n => `if (typeof ${n} !== 'undefined') window.__ActiveExport__ = ${n};`).join('\n          ')}
        }
      }`;

      return escapeForTemplate(fullBlock);
    }

    let libraryStyles = "";
    let historicalBlocks: string[] = [];
    let activeBlockStr = "";
    
    effectiveBlocks.forEach((block, idx) => {
      const isCSS = block.includes("@tailwind") || block.includes("@import") || (block.trim().startsWith(".") || block.trim().startsWith("#") || block.trim().startsWith("body") || block.trim().startsWith(":root"));
      if (isCSS) {
        const cssClean = block.replace(/import[\s\S]*?from\s+['"].*?['"];?/g, "").replace(/@tailwind\s+.*?;/g, "");
        libraryStyles += `\n/* Block ${idx} */\n${cssClean}\n`;
        return;
      }
      const isActive = idx === effectiveIndex;
      const prepared = prepareBlock(block, isActive);
      if (isActive) {
        activeBlockStr = `\`${prepared}\``;
      } else {
        historicalBlocks.push(`\`${prepared}\``);
      }
    });

    // Active block MUST be last to ensure its 'window' assignments win
    const escapedBlocks = [...historicalBlocks];
    if (activeBlockStr) escapedBlocks.push(activeBlockStr);

    const blocksArrayString = `[${escapedBlocks.join(",")}]`.replace(/<\/script>/gi, "<\\/script>");

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js" crossorigin></script>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/zod@3.23.8/lib/index.umd.js" crossorigin></script>
<script src="https://unpkg.com/react-hook-form@7.51.5/dist/index.umd.js" crossorigin></script>
<script src="https://unpkg.com/@hookform/resolvers@3.3.4/dist/zod.umd.js" crossorigin></script>
<script src="https://unpkg.com/lucide-react/dist/umd/lucide-react.js" crossorigin></script>
<script src="https://unpkg.com/framer-motion@11.0.8/dist/framer-motion.js" crossorigin></script>

<style>
  html, body { margin:0; padding:0; height:100%; width:100%; font-family:system-ui; background:white; overflow-x: hidden; }
  #root { width:100%; min-height:100%; display: flex; flex-direction: column; }
  .error-box { padding:20px; background:#fff1f2; color:#b91c1c; font-family:monospace; border: 1px solid #fecaca; border-radius: 8px; margin: 20px; font-size: 13px; }
  body { animation: fadeIn 0.3s ease-out; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  ${libraryStyles}
</style>
</head>

<body>
<div id="root"></div>

<script id="bootstrapper">
  window.onerror = function(msg, url, line, col, error) {
    console.error("Runtime Error:", msg, error);
    document.getElementById("root").innerHTML = "<div class='error-box'><b>Runtime Error:</b><br/>" + msg + "</div>";
    return false;
  };

  (function() {
    try {
      const { useState, useEffect, useMemo, useRef, useCallback } = React;
      const motion = window.Motion ? window.Motion.motion : (window.framerMotion ? window.framerMotion.motion : null);
      
      const UI = {
        Card: ({ children, className = "", ...p }) => React.createElement('div', { className: "bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden " + className, ...p }, children),
        CardHeader: ({ children, className = "" }) => React.createElement('div', { className: "p-6 flex flex-col space-y-1.5 " + className }, children),
        CardTitle: ({ children, className = "" }) => React.createElement('div', { className: "text-2xl font-bold leading-none tracking-tight " + className }, children),
        CardDescription: ({ children, className = "" }) => React.createElement('div', { className: "text-sm text-zinc-500 " + className }, children),
        CardContent: ({ children, className = "" }) => React.createElement('div', { className: "p-6 pt-0 " + className }, children),
        CardFooter: ({ children, className = "" }) => React.createElement('div', { className: "p-6 pt-0 flex items-center " + className }, children),
        Label: ({ children, className = "", ...p }) => React.createElement('label', { className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 " + className, ...p }, children),
        Input: ({ className = "", ...p }) => React.createElement('input', { className: "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 " + className, ...p }),
        Button: ({ children, variant = "default", className = "", ...p }) => {
          const v = {
            default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90",
            outline: "border border-zinc-200 bg-white hover:bg-zinc-100",
            ghost: "hover:bg-zinc-100",
          };
          return React.createElement('button', { className: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 " + (v[variant] || v.default) + " " + className, ...p }, children);
        },
        Checkbox: ({ className = "", ...p }) => React.createElement('input', { type: "checkbox", className: "h-4 w-4 rounded border-zinc-300 " + className, ...p }),
        Separator: ({ className = "" }) => React.createElement('div', { className: "shrink-0 bg-zinc-200 h-px w-full " + className }),
        Badge: ({ children, className = "" }) => React.createElement('div', { className: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold " + className }, children),
      };

      const toast = (props) => console.log("Toast:", props);
      const useToast = () => ({ toast, toasts: [], dismiss: () => {} });

      Object.assign(window, UI, { toast, useToast });

      const LucideProxy = new Proxy({}, {
        get: (_, name) => {
          if (window.LucideReact && window.LucideReact[name]) return window.LucideReact[name];
          const icons = { Eye: "👁️", EyeOff: "🙈", Loader2: "⏳", Mail: "✉️", Lock: "🔒", User: "👤", Search: "🔍", Bell: "🔔", Settings: "⚙️" };
          return (props) => React.createElement('span', { className: "inline-flex items-center justify-center opacity-70 " + (props.className||""), ...props }, icons[name] || "🔹");
        }
      });

      const { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Label, Button, Checkbox, Separator, Badge } = UI;
      const { Eye, EyeOff, Loader2, Mail, Lock, User, Search, Bell, Settings } = LucideProxy;
      window.Lucide = LucideProxy;
      window.LucideReact = window.LucideReact || LucideProxy;

      const blocks = ${blocksArrayString};
      blocks.forEach((block, idx) => {
        try {
          const transformed = Babel.transform(block, {
            presets: ['react', 'typescript'],
            filename: 'block_' + idx + '.tsx'
          }).code;
          eval(transformed);
        } catch (e) {
          console.error("Failed to transform block " + idx + ":", e);
          if (idx === blocks.length - 1) {
            const msg = e.message || "";
            const isPartial = msg.includes("Unterminated JSX") || 
                            msg.includes("Unexpected token") || 
                            msg.includes("Missing semicolon");
            
            if (isPartial) {
              document.getElementById("root").innerHTML = ' \
                <div class="flex flex-col items-center justify-center h-full p-20 text-zinc-400 gap-4"> \
                  <div class="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-400 animate-spin"></div> \
                  <p class="text-sm font-medium animate-pulse italic">Refining UI and finishing up...</p> \
                </div> \
              ';
              return;
            }
            throw e;
          }
        }
      });
      
      function find() {
        if (typeof window.__ActiveExport__ === "function") return window.__ActiveExport__;
        if (typeof window.__DefaultExport__ === "function") return window.__DefaultExport__;
        for (let k of Object.keys(window)) if (typeof window[k] === "function" && /^[A-Z]/.test(k) && !["React","ReactDOM"].includes(k)) return window[k];
        return null;
      }

      const Root = find();
      if (Root) {
        ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Root));
      } else {
        document.getElementById("root").innerHTML = "<div class='p-10 text-center opacity-50'><p>Component ready but not found on top-level.</p></div>";
      }
    } catch (err) {
      console.error("Preview Error:", err);
      document.getElementById("root").innerHTML = "<div class='error-box'><b>Preview Error:</b><br/>" + err.message + "</div>";
    }
  })();
</script>
</body>
</html>
`
  }, [debouncedCode, allBlocks, activeBlockIndex, testMode, snapshot])

  const renderableIndexes = useMemo(() => {
    return allBlocks
      .map((block, idx) => ({ block, idx }))
      .filter(({ block }) => detectContentType(block).contentType !== 'none')
      .map(({ idx }) => idx);
  }, [allBlocks]);

  const viewIndex = renderableIndexes.indexOf(activeBlockIndex);

  return (
    <div className="flex flex-col h-full bg-zinc-50/50 rounded-2xl border border-zinc-200 overflow-hidden shadow-2xl">
      <PreviewToolbar 
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        testMode={testMode}
        setTestMode={setTestMode}
        copied={copied}
        onCopy={handleCopyHTML}
        onRefresh={handleRefresh}
        onFullscreen={handleOpenFullscreen}
        isReloading={isReloading}
      />
      
      <BrowserShell 
        path={viewIndex > 0 ? `/page-${viewIndex + 1}` : ""} 
        onIndexChange={onIndexChange}
        activeBlockIndex={activeBlockIndex}
        renderableIndexes={renderableIndexes}
      />

      <PreviewDisplay 
        deviceMode={deviceMode}
        iframeSrc={iframeSrc}
        isReloading={isReloading}
        iframeKey={key}
      />
    </div>
  )
}