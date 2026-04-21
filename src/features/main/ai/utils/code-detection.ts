export type ContentType = 'react' | 'html' | 'mermaid' | 'vue' | 'alpine' | 'none';

export function detectContentType(code: string): { contentType: ContentType; isFragment: boolean } {
  if (!code) return { contentType: 'none', isFragment: false }
  
  const trimmed = code.trim()
  const lower = trimmed.toLowerCase()
  
  // 1. Exclude obvious non-visual config files
  if (lower.includes('module.exports') || 
      lower.includes('export const config') || 
      lower.includes('next.config') || 
      lower.includes('tailwind.config') ||
      trimmed.startsWith('{') && trimmed.endsWith('}') // Likely JSON
  ) {
    return { contentType: 'none', isFragment: false }
  }

  // 2. Detect Mermaid (Diagrams)
  if (lower.match(/^(graph|sequenceDiagram|pie|gantt|classDiagram|erDiagram|stateDiagram|journey|gitGraph|pie|quadrantChart|mindmap|timeline)/i)) {
    return { contentType: 'mermaid', isFragment: false }
  }

  // 3. Detect HTML (Full Documents)
  if (lower.startsWith('<!doctype html>') || lower.startsWith('<html') || lower.includes('<head>') || lower.includes('<body>')) {
    return { contentType: 'html', isFragment: false }
  }

  // 4. Detect Vue.js
  if (lower.includes('vue.createapp') || lower.includes('new vue') || (lower.includes('{{') && lower.includes('}}') && !lower.includes('React'))) {
    return { contentType: 'vue', isFragment: false }
  }

  // 5. Detect Alpine.js (via attributes)
  if (lower.includes('x-data') || lower.includes('x-on:') || lower.includes('x-bind:')) {
    return { contentType: 'alpine', isFragment: false }
  }

  // 6. React Detection
  const looksLikeFragment = (trimmed.startsWith('<') || trimmed.startsWith('(')) && 
                            !trimmed.includes('function') && 
                            !trimmed.includes('const') &&
                            !trimmed.includes('class') &&
                            !trimmed.includes('import ')

  // If it has React markers or looks like a fragment, it's React
  if (lower.includes('react') || lower.includes('export ') || lower.includes('return (') || lower.includes('<div') || looksLikeFragment) {
    return { contentType: 'react', isFragment: looksLikeFragment }
  }

  return { contentType: 'none', isFragment: false }
}
