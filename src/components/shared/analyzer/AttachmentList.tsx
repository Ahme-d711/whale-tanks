"use client"

import React from 'react'
import Image from 'next/image'
import { FileIcon, X } from 'lucide-react'

interface AttachmentListProps {
  attachments: File[]
  onRemove: (index: number) => void
  size?: 'sm' | 'md'
}

export const AttachmentList = ({ attachments, onRemove, size = 'md' }: AttachmentListProps) => {
  if (attachments.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {attachments.map((file, index) => {
        const isImage = file.type.startsWith('image/')
        return (
          <div key={index} className="relative group bg-border/50 rounded-lg p-1 flex items-center gap-2 pr-1.5">
            <div className={`relative rounded overflow-hidden bg-background shrink-0 flex items-center justify-center ${size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'}`}>
              {isImage ? (
                <Image 
                  src={URL.createObjectURL(file)} 
                  alt="preview" 
                  fill 
                  className="object-cover"
                  onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                />
              ) : (
                <FileIcon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
              )}
            </div>
            <span className={`truncate text-foreground/80 font-medium ${size === 'sm' ? 'text-[10px] max-w-[80px]' : 'text-xs max-w-[100px]'}`}>
              {file.name}
            </span>
            <button 
              onClick={() => onRemove(index)}
              className="p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
              type="button"
            >
              <X className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
