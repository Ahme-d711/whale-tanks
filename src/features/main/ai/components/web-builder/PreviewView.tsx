"use client"

import React, { useMemo } from "react"

interface PreviewViewProps {
  code: string
}

export default function PreviewView({ code }: PreviewViewProps) {

  const iframeSrc = useMemo(() => {
    if (!code) return ""

    // 🔥 تنظيف الكود
    let processedCode = code
      .replace(/import[\s\S]*?from\s+['"].*?['"];?/g, "")
      .replace(/export\s+default\s+/g, "const __DefaultExport__ = ")
      .replace(/export\s+/g, "");

    const exportedNames = [...code.matchAll(/export\s+(?:function|const|class)\s+(\w+)/g)].map(m => m[1]);
    exportedNames.forEach(name => {
      processedCode += `\nwindow.${name} = ${name};`;
    });

    // 🔍 استخراج أسماء components
    const detectedNames = [
      ...new Set([
        ...Array.from(code.matchAll(/function\s+([A-Z]\w*)/g)).map(m => m[1]),
        ...Array.from(code.matchAll(/const\s+([A-Z]\w*)\s*=\s*\(/g)).map(m => m[1])
      ])
    ]

    // 🔍 Detect if it's a fragment (no function/class declaration)
    const isFragment = !/function|class|export\s+default|const\s+[A-Z]/.test(code) && (code.trim().startsWith('<') || code.trim().startsWith('('));
    
    if (isFragment) {
      processedCode = `const __Fragment__ = () => (<React.Fragment>${processedCode}</React.Fragment>);\nconst __DefaultExport__ = __Fragment__;`;
    }

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js" crossorigin></script>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/zod@3.23.8/lib/index.umd.js" crossorigin></script>
<script src="https://unpkg.com/react-hook-form@7.51.5/dist/index.umd.js" crossorigin></script>
<script src="https://unpkg.com/@hookform/resolvers@3.3.4/dist/zod.umd.js" crossorigin></script>
<script src="https://unpkg.com/framer-motion@11.0.8/dist/framer-motion.js" crossorigin></script>

<style>
  html, body { margin:0; padding:0; height:100%; width:100%; font-family:system-ui; background:white; overflow-x: hidden; }
  #root { width:100%; min-height:100%; display: flex; flex-direction: column; }

  .error-box {
    padding:20px;
    background:#fff1f2;
    color:#b91c1c;
    font-family:monospace;
    white-space:pre-wrap;
    border: 1px solid #fecaca;
    border-radius: 8px;
    margin: 20px;
  }
</style>
<script>
  window.onerror = function(msg, url, line, col, error) {
    const isScriptError = msg.toLowerCase().includes('script error');
    const displayMsg = isScriptError ? 'External Script Load/Execution Error. Check console.' : msg;
    document.getElementById("root").innerHTML = 
      "<div class='error-box'><b>" + (isScriptError ? 'Security/Load Error:' : 'Runtime Error:') + "</b><br/>" + 
      displayMsg + "<br/><small>Line: " + line + "</small></div>";
    return false;
  };
</script>
</head>

<body>
<div id="root"></div>

<script type="text/babel">

const { useState, useEffect, useMemo, useRef, useCallback } = React;
const z = window.z || window.zod || window.Zod;
const { useForm, Controller } = window.ReactHookForm || {};
const { zodResolver } = window.ZodResolver || {};
const motion = window.Motion ? window.Motion.motion : (window.framerMotion ? window.framerMotion.motion : null);

// 🔥 Premium Shadcn Mocks
const UI = {
  Card: ({ children, className = "", ...p }) => (
    <div className={"bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden " + className} {...p}>{children}</div>
  ),
  CardHeader: ({ children, className = "" }) => <div className={"p-6 flex flex-col space-y-1.5 " + className}>{children}</div>,
  CardTitle: ({ children, className = "" }) => <div className={"text-2xl font-semibold leading-none tracking-tight " + className}>{children}</div>,
  CardDescription: ({ children, className = "" }) => <div className={"text-sm text-zinc-500 " + className}>{children}</div>,
  CardContent: ({ children, className = "" }) => <div className={"p-6 pt-0 " + className}>{children}</div>,
  CardFooter: ({ children, className = "" }) => <div className={"p-6 pt-0 flex items-center " + className}>{children}</div>,
  
  Label: ({ children, className = "", ...p }) => (
    <label className={"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 " + className} {...p}>{children}</label>
  ),
  Input: ({ className = "", ...p }) => (
    <input className={"flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 " + className} {...p} />
  ),
  Button: ({ children, variant = "default", className = "", ...p }) => {
    const variants = {
      default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90",
      outline: "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900",
      ghost: "hover:bg-zinc-100 hover:text-zinc-900",
      link: "text-zinc-900 underline-offset-4 hover:underline",
    };
    return (
      <button className={"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 " + (variants[variant] || variants.default) + " " + className} {...p}>
        {children}
      </button>
    );
  },
  Checkbox: ({ className = "", ...p }) => (
    <input type="checkbox" className={"h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 " + className} {...p} />
  ),
  Alert: ({ children, className = "" }) => (
    <div className={"relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-zinc-950 b-zinc-200 text-zinc-950 " + className}>{children}</div>
  ),
  AlertDescription: ({ children, className = "" }) => <div className={"text-sm [&_p]:leading-relaxed " + className}>{children}</div>,
  Badge: ({ children, className = "" }) => (
    <div className={"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80 " + className}>{children}</div>
  ),
  Separator: ({ className = "" }) => <div className={"shrink-0 bg-zinc-200 h-px w-full " + className} />,
};

// 🔥 Inject UI components globally
Object.assign(window, UI);

// 🔥 Lucide Icons Mock fallback
const Lucide = new Proxy({}, {
  get: (_, name) => (props) => (
    <div className={"inline-flex items-center justify-center text-zinc-500 " + (props.className || "")} {...props}>
      <span className="text-[10px] font-mono opacity-50">{name}</span>
    </div>
  )
});

// 🔥 Common exports for local scope
const { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input, Label, Button, Checkbox, Badge, Alert, AlertDescription, Separator 
} = UI;

const { Eye, EyeOff, Loader2, Mail, Lock, User, Search, Bell, Settings, ArrowRight } = Lucide;
window.Lucide = Lucide;
window.LucideReact = Lucide;

try {

${processedCode}

// 🧠 Smart Component Finder
function findComponent() {

  // 1. default export
  if (typeof __DefaultExport__ === "function") return __DefaultExport__;

  // 2. priority names
  const priority = ["App","LoginPage","LoginCard","Main","Page"];
  for (let name of priority) {
    if (typeof window[name] === "function") return window[name];
  }

  // 3. detected from code
  const detected = ${JSON.stringify(detectedNames)};
  for (let name of detected) {
    if (typeof window[name] === "function") return window[name];
  }

  // 4. أي component capital
  for (let key of Object.keys(window)) {
    if (
      typeof window[key] === "function" &&
      /^[A-Z]/.test(key) &&
      !["React","ReactDOM"].includes(key)
    ) {
      return window[key];
    }
  }

  return null;
}

const Root = findComponent();

if (Root) {
  ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
} else {
  document.getElementById("root").innerHTML =
    "<div class='error-box'>❌ No component found</div>";
}

} catch (err) {
  document.getElementById("root").innerHTML =
    "<div class='error-box'><b>Render Error:</b><br/>" + err.message + "</div>";
}

</script>
</body>
</html>
`
  }, [code])

  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="w-full h-full bg-white relative flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-zinc-500 animate-pulse">Initializing Sandbox...</span>
          </div>
        </div>
      )}
      <iframe
        srcDoc={iframeSrc}
        title="Preview"
        className="w-full h-full border-0 flex-1"
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}