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

// 🔥 UI Proxy (shadcn fallback)
const UIProxy = new Proxy({}, {
  get: (_, name) => {
    return (props) => React.createElement(
      "div",
      {
        style: {
          border: "1px dashed #ddd",
          padding: "8px",
          margin: "4px",
          borderRadius: "8px"
        }
      },
      props.children || name
    );
  }
});

// 🔥 inject globally (المهم!)
Object.assign(window, UIProxy);

// 🔥 destructure common ones for local scope access
const { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input, Label, Button, Checkbox, Search, Alert, AlertDescription,
  Tabs, TabsList, TabsTrigger, TabsContent, Badge, Progress, Switch, Slider,
  Avatar, AvatarImage, AvatarFallback, Separator, ScrollArea,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} = UIProxy;

// 🔥 lucide fallback
const IconProxy = new Proxy({}, {
  get: (_, name) => {
    return (props) => React.createElement("span", { 
      style: { fontSize: "14px", display: "inline-flex", alignItems: "center", ...props.style } 
    }, "🔹");
  }
});

const { Eye, EyeOff, Loader2, Mail, Lock, User, Search: SearchIcon, Bell, Settings } = IconProxy;

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