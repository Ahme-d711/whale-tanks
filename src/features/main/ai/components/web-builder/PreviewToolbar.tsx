"use client"

import React from 'react'
import { 
  RotateCw, 
  ExternalLink, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Copy, 
  FlaskConical, 
  Check 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DeviceMode = "desktop" | "tablet" | "mobile"

interface PreviewToolbarProps {
  deviceMode: DeviceMode
  setDeviceMode: (mode: DeviceMode) => void
  testMode: boolean
  setTestMode: (val: boolean) => void
  copied: boolean
  onCopy: () => void
  onRefresh: () => void
  onFullscreen: () => void
  isReloading: boolean
}

const deviceConfigs = {
  desktop: { label: "Desktop", icon: Monitor },
  tablet: { label: "Tablet", icon: Tablet },
  mobile: { label: "Mobile", icon: Smartphone },
}

export default function PreviewToolbar({
  deviceMode,
  setDeviceMode,
  testMode,
  setTestMode,
  copied,
  onCopy,
  onRefresh,
  onFullscreen,
  isReloading
}: PreviewToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-zinc-200 shrink-0">
      <div className="hidden md:flex items-center gap-1.5">
        {Object.entries(deviceConfigs).map(([mode, config]) => {
          const Icon = config.icon
          const isActive = deviceMode === mode
          return (
            <button
              key={mode}
              onClick={() => setDeviceMode(mode as DeviceMode)}
              className={cn(
                "p-2 rounded-lg transition-all duration-200 flex items-center gap-2",
                isActive 
                  ? "bg-zinc-900 text-white shadow-md scale-105" 
                  : "text-zinc-500 hover:bg-zinc-100"
              )}
              title={config.label}
            >
              <Icon className="w-4 h-4" />
              {isActive && <span className="text-xs font-semibold pr-1">{config.label}</span>}
            </button>
          )
        })}
      </div>

      <div className="flex items-center w-full md:w-auto  justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTestMode(!testMode)}
          className={cn(
            "h-8 px-3 gap-2 rounded-full font-medium transition-all",
            testMode && "bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 border border-amber-200"
          )}
        >
          <FlaskConical className={cn("w-3.5 h-3.5", testMode && "animate-pulse")} />
          <span className="text-xs">Test Mode</span>
        </Button> 

        <div className="w-px h-4 bg-zinc-200 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-8 px-3 gap-2 rounded-full font-medium"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span className="text-xs">Copy Code</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isReloading}
          className="h-8 w-8 p-0 rounded-full"
        >
          <RotateCw className={cn("w-3.5 h-3.5", isReloading && "animate-spin")} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="h-8 w-8 p-0 rounded-full"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
