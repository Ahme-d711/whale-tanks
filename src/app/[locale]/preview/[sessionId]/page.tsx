"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { executionService } from "@/features/dashboard/executions/services/execution.service"
import { extractCode } from "@/features/main/ai/utils/code-extraction"
import LivePreview from "@/features/main/ai/components/web-builder/LivePreview"
import { Loader, AlertCircle } from "lucide-react"

export default function FullscreenPreviewPage() {
  const { sessionId } = useParams() as { sessionId: string }
  const searchParams = useSearchParams()
  const activeIndex = parseInt(searchParams.get("index") || "0")
  const [codeBlocks, setCodeBlocks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return

    const fetchSessionData = async () => {
      try {
        setIsLoading(true)
        const response = await executionService.getSessionMessages(sessionId)
        
        const allUi: string[] = []
        response.pairs.forEach(pair => {
          if (pair.answer?.content) {
            const { ui } = extractCode(pair.answer.content)
            allUi.push(...ui)
          }
        })

        if (allUi.length === 0) {
          setError("No previewable code found in this session.")
        } else {
          setCodeBlocks(allUi)
        }
      } catch (err) {
        console.error("Failed to fetch session messages:", err)
        setError("Failed to load preview. Please make sure the session ID is valid.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessionData()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-50">
        <Loader className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Loading Live Preview...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-50 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 mb-2">Preview Error</h1>
        <p className="text-zinc-500 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  const activeCode = codeBlocks[activeIndex] || codeBlocks[codeBlocks.length - 1]

  return (
    <div className="fixed inset-0 z-60 bg-white flex flex-col">
      <div className="flex-1">
        <LivePreview 
          code={activeCode} 
          allBlocks={codeBlocks} 
          activeBlockIndex={activeIndex}
        />
      </div>
    </div>
  )
}
