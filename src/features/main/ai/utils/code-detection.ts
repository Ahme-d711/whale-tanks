export type ContentType = 'react' | 'html' | 'mermaid' | 'vue' | 'alpine' | 'flutter' | 'swift' | 'kotlin' | 'none';

export function detectContentType(code: string): { contentType: ContentType; isFragment: boolean } {
  if (!code) return { contentType: 'none', isFragment: false };
  
  const trimmed = code.trim();
  const lower = trimmed.toLowerCase();

  // 1. Identify Fragments (JSX snippets without boilerplate)
  // Heuristic: Starts with < or ( tags but doesn't have imports or function/const declarations at the start
  const isFragment = (trimmed.startsWith('<') || (trimmed.startsWith('(') && trimmed.includes('<'))) && 
                     !trimmed.includes('import ') && 
                     !/^(function|const|class)\s+[A-Z]/.test(trimmed);

  // 2. Specialized Mobile Frameworks
  if (lower.includes("package:flutter") || lower.includes("statelesswidget") || lower.includes("statefulwidget")) {
    return { contentType: 'flutter', isFragment: false };
  }
  if (lower.includes("import swiftui") || (lower.includes("struct") && lower.includes(": view") && lower.includes("body: some view"))) {
    return { contentType: 'swift', isFragment: false };
  }
  if (lower.includes("@composable") || (lower.includes("import androidx.compose") && lower.includes("fun "))) {
    return { contentType: 'kotlin', isFragment: false };
  }

  // 3. Diagram & Specialized Tools
  if (/^(graph|sequenceDiagram|pie|gantt|classDiagram|erDiagram|stateDiagram|journey|gitGraph|pie|mindmap|timeline)/i.test(trimmed)) {
    return { contentType: 'mermaid', isFragment: false };
  }

  // 4. Basic Web Technologies (Non-React)
  if (lower.startsWith('<!doctype html>') || lower.startsWith('<html') || lower.includes('<head>') || lower.includes('<body>')) {
    return { contentType: 'html', isFragment: false };
  }
  if (lower.includes('vue.createapp') || lower.includes('new vue') || (lower.includes('{{') && lower.includes('}}') && !lower.includes('react'))) {
    return { contentType: 'vue', isFragment: false };
  }
  if (lower.includes('x-data') || lower.includes('x-on:') || lower.includes('x-bind:')) {
    return { contentType: 'alpine', isFragment: false };
  }

  // 5. Advanced React Detection
  // Check for specialized React syntax and hooks
  const hasJSX = /<[A-Z][A-Za-z0-9]*|<\/[A-Z][A-Za-z0-9]*>|<[a-z]+.*?>.*?<\/[a-z]+>/.test(trimmed);
  const hasHooks = /use(State|Effect|Memo|Callback|Ref|Context|Reducer|LayoutEffect)/.test(trimmed);
  const hasComponentBoilerplate = /export\s+(?:default\s+)?(?:function|const|class)\s+[A-Z]/.test(trimmed) || 
                                  /^(?:function|const|class)\s+[A-Z]/.test(trimmed) ||
                                  /return\s+\(|return\s+<[A-Z]|[a-z]/.test(trimmed);
  
  // Heuristic: If it has JSX, hooks, react keyword, or structural boilerplate, it's React
  if (lower.includes('react') || hasHooks || hasComponentBoilerplate || hasJSX || isFragment) {
    return { contentType: 'react', isFragment: isFragment };
  }

  return { contentType: 'none', isFragment: false };
}
