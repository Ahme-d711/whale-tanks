export function extractCode(text: string) {
  const regex = /```(jsx|tsx|html|javascript|js|typescript|ts|css|bash|sh|json|sql|prisma|flutter|dart|swift|kotlin)?\n?([\s\S]*?)(?:```|$)/g
  const matches = Array.from(text.matchAll(regex))
  
  const uiBlocks: string[] = []
  const dbBlocks: string[] = []

  matches.forEach(m => {
    const lang = m[1]?.toLowerCase() || ''
    const content = m[2].trim()
    
    if (content.length < 20) return

    // Ignore installation commands
    if (content.toLowerCase().startsWith('npm ') || content.toLowerCase().startsWith('bun ') || content.toLowerCase().startsWith('yarn ') || content.toLowerCase().startsWith('npx ')) return

    // Determine Category
    const isDb = lang === 'sql' || lang === 'prisma' || 
                 (lang === 'json' && content.includes('"type": "object"')) ||
                 ((lang === 'ts' || lang === 'typescript') && (content.includes('interface') || content.includes('type')) && !content.includes('React') && !content.includes('Widget'))

    if (isDb) {
      dbBlocks.push(content)
    } else {
      uiBlocks.push(content)
    }
  })

  return {
    ui: Array.from(new Set(uiBlocks)),
    db: Array.from(new Set(dbBlocks))
  }
}
