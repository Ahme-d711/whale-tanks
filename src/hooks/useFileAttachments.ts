import { useState, useRef, useCallback } from 'react'

export function useFileAttachments() {
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFilesSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setAttachments(prev => [...prev, ...files])
      e.target.value = '' // Reset input
    }
  }, [])

  const handleFilesSelectedDirect = useCallback((files: File[]) => {
    setAttachments(prev => [...prev, ...files])
  }, [])

  const handleRemoveAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }, [])

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return {
    attachments,
    setAttachments,
    fileInputRef,
    handleFilesSelected,
    handleFilesSelectedDirect,
    handleRemoveAttachment,
    triggerFileInput
  }
}
