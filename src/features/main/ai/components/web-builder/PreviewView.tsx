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
        componentMocks += `if (typeof ${name} === 'undefined' && typeof window.${name} === 'undefined') {
          if (window.Lucide && window.Lucide['${name}']) {
            window.${name} = window.Lucide['${name}'];
          } else {
            window.${name} = (props) => React.createElement('div', { className: 'p-2 border border-dashed border-zinc-300 rounded text-[10px] text-zinc-400 font-mono' }, 'Missing: <' + name + ' />');
          }
        }\n`;
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
<script src="https://unpkg.com/lucide@latest"></script>
<script src="https://unpkg.com/framer-motion@11.0.8/dist/framer-motion.js" crossorigin></script>

<style>
  html, body { margin:0; padding:0; height:100%; width:100%; font-family:system-ui; background:white; overflow-x: hidden; }
  #root { width:100%; min-height:100%; display: flex; flex-direction: column; background: #fafafa; }
  .error-box { 
    margin: 20px; padding: 24px; background: #fff; border-left: 4px solid #ef4444; 
    border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); font-family: 'JetBrains Mono', monospace;
  }
  .error-title { color: #ef4444; font-weight: 700; font-size: 16px; margin-bottom: 8px; display: flex; items-center gap: 2; }
  .error-msg { color: #4b5563; font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
  
  .loading-container {
    display: flex; flex-direction: column; items-center; justify-content: center; height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); gap: 24px;
  }
  .loader-ring {
    width: 48px; height: 48px; border: 3px solid #e2e8f0; border-top-color: #3b82f6;
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }
  .loading-text { font-family: system-ui; font-weight: 600; color: #64748b; font-size: 14px; letter-spacing: -0.01em; }
  @keyframes spin { to { transform: rotate(360deg); } }
  ${libraryStyles}
</style>
</head>

<body>
<div id="root"></div>

<script id="bootstrapper">
  window.onerror = function(msg, url, line, col, error) {
    console.error("Runtime Error:", msg, error);
    document.getElementById("root").innerHTML = \`
      <div class="error-box">
        <div class="error-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Runtime Error
        </div>
        <div class="error-msg">\${msg}</div>
      </div>
    \`;
    return false;
  };

  (function() {
    try {
      window.React = React;
      window.ReactDOM = ReactDOM;
      const { useState, useEffect, useMemo, useRef, useCallback } = React;
      const motion = window.Motion ? window.Motion.motion : (window.framerMotion ? window.framerMotion.motion : null);
      
      const UI = {
        Card: ({ children, className = "", ...p }) => React.createElement('div', { className: "bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden " + className, ...p }, children),
        CardHeader: ({ children, className = "" }) => React.createElement('div', { className: "p-6 flex flex-col space-y-1.5 " + className }, children),
        CardTitle: ({ children, className = "" }) => React.createElement('div', { className: "text-2xl font-bold leading-none tracking-tight text-zinc-900 " + className }, children),
        CardDescription: ({ children, className = "" }) => React.createElement('div', { className: "text-sm text-zinc-500 " + className }, children),
        CardContent: ({ children, className = "" }) => React.createElement('div', { className: "p-6 pt-0 " + className }, children),
        CardFooter: ({ children, className = "" }) => React.createElement('div', { className: "p-6 pt-0 flex items-center " + className }, children),
        Label: ({ children, className = "", ...p }) => React.createElement('label', { className: "text-sm font-semibold leading-none text-zinc-700 " + className, ...p }, children),
        Input: ({ className = "", ...p }) => React.createElement('input', { className: "flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all " + className, ...p }),
        Button: ({ children, variant = "default", className = "", ...p }) => {
          const v = {
            default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-sm",
            outline: "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 shadow-sm",
            ghost: "hover:bg-zinc-100 text-zinc-600",
            secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
          };
          return React.createElement('button', { className: "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all h-11 px-6 active:scale-95 disabled:opacity-50 disabled:pointer-events-none " + (v[variant] || v.default) + " " + className, ...p }, children);
        },
        Checkbox: ({ className = "", ...p }) => React.createElement('input', { type: "checkbox", className: "h-4 w-4 rounded-md border-zinc-300 text-zinc-900 focus:ring-zinc-900 " + className, ...p }),
        Separator: ({ className = "" }) => React.createElement('div', { className: "shrink-0 bg-zinc-100 h-px w-full " + className }),
        Badge: ({ children, className = "" }) => React.createElement('div', { className: "inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold bg-zinc-50 text-zinc-900 " + className }, children),
        Avatar: ({ className = "", ...p }) => React.createElement('div', { className: "h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200 " + className, ...p }, React.createElement('span', { className: "text-zinc-500 text-sm font-medium" }, "U")),
        Skeleton: ({ className = "", ...p }) => React.createElement('div', { className: "animate-pulse rounded-md bg-zinc-100 " + className, ...p }),
        Tabs: ({ children, className = "" }) => React.createElement('div', { className: "w-full " + className }, children),
        TabsList: ({ children, className = "" }) => React.createElement('div', { className: "inline-flex h-11 items-center justify-center rounded-xl bg-zinc-100 p-1 text-zinc-500 " + className }, children),
        TabsTrigger: ({ children, className = "" }) => React.createElement('div', { className: "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm " + className }, children),
        Link: ({ children, href, className, ...p }) => React.createElement('a', { href, className: "text-blue-600 hover:underline " + className, ...p }, children),
      };

      const toast = (props) => console.log("Toast:", props);
      const useToast = () => ({ toast, toasts: [], dismiss: () => {} });

      // Zod Mock
      const z = {
        object: (schema) => ({ 
          parse: (data) => data, 
          safeParse: (data) => ({ success: true, data }),
          shape: schema 
        }),
        string: () => ({ email: () => z.string(), min: () => z.string(), max: () => z.string(), optional: () => z.string() }),
        boolean: () => ({ default: () => z.boolean() }),
        number: () => ({ min: () => z.number(), max: () => z.number() }),
        infer: (schema) => ({}),
      };
      const zodResolver = (schema) => (values) => ({ values, errors: {} });
      const useForm = (args) => ({
        register: (name) => ({ name, onChange: () => {}, onBlur: () => {}, ref: () => {} }),
        handleSubmit: (cb) => (e) => { e?.preventDefault?.(); cb(args?.defaultValues || {}); },
        watch: (name) => args?.defaultValues?.[name],
        setValue: (name, val) => {},
        formState: { errors: {} },
        reset: () => {},
        control: {},
      });

      const UIProxy = new Proxy(UI, {
        get: (target, name) => {
          if (name === '$$isProxy') return true;
          if (name in target) return target[name];
          if (typeof name === 'string' && /^[A-Z]/.test(name)) {
            return (props) => React.createElement('div', { className: 'p-3 border border-dashed border-zinc-200 bg-zinc-50/50 text-[10px] text-zinc-400 font-mono rounded-lg flex items-center justify-center italic' }, '<' + name + ' />');
          }
          return target[name];
        }
      });

      Object.assign(window, UIProxy, { toast, useToast, z, zodResolver, useForm });

      const LucideProxy = new Proxy({ $$isProxy: true }, {
        get: (target, name) => {
          if (name === '$$isProxy') return true;
          if (name === 'icons') return target; 
          
          // Find REAL lucide data, avoiding this proxy
          const lib = [window.lucide, window.Lucide, window.LucideReact].find(l => l && l !== LucideProxy && !l.$$isProxy);
          const camelName = name.charAt(0).toLowerCase() + name.slice(1);
          const kebabName = name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z0-9])/g, '$1-$2').toLowerCase().replace(/^-/, '');
          const iconData = lib?.icons?.[name] || lib?.[name] || 
                           lib?.icons?.[camelName] || lib?.[camelName] || 
                           lib?.icons?.[kebabName] || lib?.[kebabName];
          
          const iconComponent = (p) => {
            if (iconData && Array.isArray(iconData)) {
              const render = (data, props) => {
                const [tag, attrs, children] = data;
                const mergedAttrs = { ...attrs, ...props };
                if (attrs.class && props.className) mergedAttrs.className = attrs.class + " " + props.className;
                return React.createElement(tag, { ...mergedAttrs, key: mergedAttrs.key }, (children || []).map((c, i) => render(c, { key: i })));
              };
              return render(iconData, { 
                width: 24, height: 24, fill: "none", stroke: "currentColor", 
                strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...p 
              });
            }
            // Fallback circle
            return React.createElement('svg', { 
              width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', 
              stroke: 'currentColor', strokeWidth: 1.5, className: "opacity-30 " + (p.className||""), ...p 
            }, React.createElement('circle', { cx: 12, cy: 12, r: 10 }));
          };

          return iconComponent;
        }
      });

      // Keep the real library hidden in a private-ish variable
      window.__REAL_LUCIDE__ = window.lucide || window.Lucide || window.LucideReact;
      window.Lucide = LucideProxy;
      window.lucide = LucideProxy;
      window.LucideReact = LucideProxy;

      const { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Label, Button, Checkbox, Separator, Badge, Avatar, Skeleton, Tabs, TabsList, TabsTrigger } = UI;
      const { Eye, EyeOff, Loader2, Mail, Lock, User, Search, Bell, Settings } = LucideProxy;
      
      // Only assign proxy if the real library hasn't claimed these globals
      window.Lucide = window.Lucide || window.lucide || LucideProxy;
      window.LucideReact = window.LucideReact || window.lucideReact || LucideProxy;
      window.lucide = window.lucide || window.Lucide;

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
              document.getElementById("root").innerHTML = \`
                <div class="loading-container">
                  <div class="loader-ring"></div>
                  <div class="loading-text">Finalizing your UI...</div>
                </div>
              \`;
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
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-50/50 overflow-hidden">
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