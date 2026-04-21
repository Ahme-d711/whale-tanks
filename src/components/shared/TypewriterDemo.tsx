"use client"

import React, { useState } from 'react'
import { useTypewriter } from '@/hooks/useTypewriter'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, RotateCcw, Zap } from 'lucide-react'

export const TypewriterDemo = () => {
  const [speed, setSpeed] = useState(70)
  const fullText = "Hello! 👋 Welcome to Blue Whale Tanks. 🐋 Whether you're starting a business or scaling one, we bring your ideas to life with AI-powered analysis and premium solutions. Let's build something amazing together! 🚀"
  
  const { displayText, isTyping, restart } = useTypewriter(fullText, { speed })

  return (
    <Card className="p-6 max-w-2xl mx-auto bg-background/50 backdrop-blur-md border-border shadow-2xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-current" />
            AI Streaming Simulator
          </h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={restart}
              disabled={isTyping}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </Button>
          </div>
        </div>

        {/* Typing Output Area */}
        <div className="min-h-[150px] p-4 rounded-xl bg-secondary/30 border border-border shadow-inner relative">
          <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
            {displayText}
            {isTyping && (
              <span className="inline-block w-2 h-5 ml-1 bg-primary animate-pulse align-middle" />
            )}
          </p>
        </div>

        {/* Speed Controls */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Speed: {speed}ms</span>
            <span className="text-xs text-muted-foreground italic">Lower is faster</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="200" 
            value={speed} 
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
          <strong>How it works:</strong> The text is tokenized into words and symbols (respecting emojis ✨). A recursive timer appends each token based on the <code>speed</code> setting, mimicking a real-time LLM stream.
        </div>
      </div>
    </Card>
  )
}
