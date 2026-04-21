"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTypewriterOptions {
  speed?: number // ms per token
  onComplete?: () => void
  enabled?: boolean
}

/**
 * A hook that simulates streaming text word-by-word or token-by-token.
 */
export const useTypewriter = (
  fullText: string,
  { speed = 50, onComplete, enabled = true }: UseTypewriterOptions = {}
) => {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const currentIndexRef = useRef(0)

  // Tokenize text: split by spaces but preserve them as part of the following word or own tokens
  // This regex matches words, emojis, and punctuation as separate tokens
  const tokenize = useCallback((text: string) => {
    // Matches emojis, words, and punctuation separately
    // Based on common AI streaming token patterns
    return text.match(/[\w]+|[^\w\s]|\s+/gu) || []
  }, [])

  const tokens = tokenize(fullText)

  useEffect(() => {
    if (!enabled) return

    // Reset if fullText changes
    setDisplayText('')
    currentIndexRef.current = 0
    setIsTyping(true)

    const typeNextToken = () => {
      if (currentIndexRef.current < tokens.length) {
        const nextToken = tokens[currentIndexRef.current]
        setDisplayText((prev) => prev + nextToken)
        currentIndexRef.current += 1
        
        // Randomize speed slightly for a more "human" feel if desired
        const jitter = Math.random() * (speed * 0.2)
        timerRef.current = setTimeout(typeNextToken, speed + jitter)
      } else {
        setIsTyping(false)
        onComplete?.()
      }
    }

    timerRef.current = setTimeout(typeNextToken, speed)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [fullText, speed, enabled, tokens, onComplete])

  const restart = useCallback(() => {
    setDisplayText('')
    currentIndexRef.current = 0
    setIsTyping(true)
  }, [])

  return { displayText, isTyping, restart }
}
