"use client"

import React, { useState, useRef } from 'react'
import { DatabaseHeader } from './database/DatabaseHeader'
import { DatabaseVisualizer } from './database/DatabaseVisualizer'
import { DatabaseCodeView } from './database/DatabaseCodeView'
import { DatabaseEmptyState } from './database/DatabaseEmptyState'
import { DatabaseFullscreenModal } from './database/DatabaseFullscreenModal'

interface DatabaseViewProps {
  code: string
  blocksCount: number
  activeIndex: number
  onIndexChange: (index: number) => void
}

export default function DatabaseView({ 
  code, 
  blocksCount, 
  activeIndex, 
  onIndexChange 
}: DatabaseViewProps) {
  const [viewMode, setViewMode] = useState<'code' | 'visual'>('visual')
  const [isMaximized, setIsMaximized] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleDownload = () => {
    if (!iframeRef.current) return;
    try {
      const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!iframeDocument) return;
      
      const svg = iframeDocument.querySelector('svg');
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          try {
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `database-schema-${activeIndex + 1}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          } catch (e) {
            console.error("Canvas export failed, falling back to SVG:", e);
            // Fallback to direct SVG download if PNG fails
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);
            const link = document.createElement('a');
            link.href = svgUrl;
            link.download = `database-schema-${activeIndex + 1}.svg`;
            link.click();
          }
        }
      };
      
      const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
      img.src = `data:image/svg+xml;base64,${svgBase64}`;
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  if (!code) {
    return <DatabaseEmptyState />
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white relative">
      <DatabaseHeader 
        viewMode={viewMode}
        setViewMode={setViewMode}
        onMaximize={() => setIsMaximized(true)}
        onDownload={handleDownload}
        blocksCount={blocksCount}
        activeIndex={activeIndex}
        onIndexChange={onIndexChange}
      />

      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'visual' ? (
          <DatabaseVisualizer code={code} iframeRef={iframeRef} />
        ) : (
          <DatabaseCodeView code={code} />
        )}
      </div>

      <DatabaseFullscreenModal 
        isOpen={isMaximized}
        onClose={() => setIsMaximized(false)}
        code={code}
        onDownload={handleDownload}
        iframeRef={iframeRef}
      />
    </div>
  )
}
