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
  const containerRef = useRef<HTMLDivElement>(null)

  const getSvgElement = () => {
    if (!containerRef.current) return null;
    return containerRef.current.querySelector('.mermaid-viewer svg');
  }

  const handleDownloadImage = () => {
    const originalSvg = getSvgElement();
    if (!originalSvg) return;

    try {
      const svg = originalSvg.cloneNode(true) as SVGSVGElement;
      const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 800, 600];
      const [vx, vy, vw, vh] = viewBox;
      
      // Crucial: Set explicit width and height for the canvas/image to interpret correctly
      svg.setAttribute('width', vw.toString());
      svg.setAttribute('height', vh.toString());
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const scale = 3;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const padding = 60; // Extra space around diagram
        canvas.width = (vw + padding * 2) * scale;
        canvas.height = (vh + padding * 2) * scale;
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // Scale and translate: move by -vx (to 0,0) then add padding
          ctx.setTransform(scale, 0, 0, scale, (-vx + padding) * scale, (-vy + padding) * scale);
          ctx.drawImage(img, 0, 0);
          
          try {
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `database-schema-${activeIndex + 1}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          } catch (e) {
            console.error("PNG export failed:", e);
          }
        }
      };
      const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
      img.src = `data:image/svg+xml;base64,${svgBase64}`;
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  const handleDownloadPDF = async () => {
    const originalSvg = getSvgElement();
    if (!originalSvg) return;

    try {
      const { jsPDF } = await import('jspdf');
      const svg = originalSvg.cloneNode(true) as SVGSVGElement;
      const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 800, 600];
      const [vx, vy, vw, vh] = viewBox;
      
      svg.setAttribute('width', vw.toString());
      svg.setAttribute('height', vh.toString());

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const padding = 60; // Extra space around diagram
        const scale = 2;
        canvas.width = (vw + padding * 2) * scale;
        canvas.height = (vh + padding * 2) * scale;
        
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.setTransform(scale, 0, 0, scale, (-vx + padding) * scale, (-vy + padding) * scale);
          ctx.drawImage(img, 0, 0);
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: vw > vh ? 'landscape' : 'portrait',
            unit: 'px',
            format: [vw + padding * 2, vh + padding * 2]
          });
          
          pdf.addImage(imgData, 'PNG', 0, 0, vw + padding * 2, vh + padding * 2);
          pdf.save(`database-schema-${activeIndex + 1}.pdf`);
        }
      };
      const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
      img.src = `data:image/svg+xml;base64,${svgBase64}`;
    } catch (error) {
      console.error("Failed to download PDF:", error);
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
        onDownloadImage={handleDownloadImage}
        onDownloadPDF={handleDownloadPDF}
        blocksCount={blocksCount}
        activeIndex={activeIndex}
        onIndexChange={onIndexChange}
      />

      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'visual' ? (
          <DatabaseVisualizer code={code} containerRef={containerRef} />
        ) : (
          <DatabaseCodeView code={code} />
        )}
      </div>

      <DatabaseFullscreenModal 
        isOpen={isMaximized}
        onClose={() => setIsMaximized(false)}
        code={code}
        onDownloadImage={handleDownloadImage}
        onDownloadPDF={handleDownloadPDF}
        containerRef={containerRef}
      />
    </div>
  )
}
