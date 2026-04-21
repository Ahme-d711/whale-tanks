"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmOptions {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
}

interface ConfirmationContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined)

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "",
    description: "",
  })
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((options: ConfirmOptions) => {
    setOptions(options)
    setIsOpen(true)
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve)
    })
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    if (resolvePromise) resolvePromise(false)
  }, [resolvePromise])

  const handleConfirm = useCallback(() => {
    setIsOpen(false)
    if (resolvePromise) resolvePromise(true)
  }, [resolvePromise])

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[440px] rounded-[32px] border-primary/20 pb-8 pt-10 px-8 shadow-2xl">
          <DialogHeader className="flex flex-col items-center text-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${options.variant === 'destructive' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                {options.title}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                {options.description}
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-row items-center justify-center gap-3 mt-6 sm:justify-center">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 rounded-2xl font-bold uppercase tracking-wider text-xs border-primary/20 hover:bg-secondary/50 hover:text-foreground transition-all"
            >
              {options.cancelText || "Cancel"}
            </Button>
            <Button
              variant={options.variant === "destructive" ? "destructive" : "default"}
              onClick={handleConfirm}
              className={`flex-1 h-12 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 ${options.variant !== 'destructive' ? 'bg-primary hover:bg-primary/90' : ''}`}
            >
              {options.confirmText || "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmationContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmationContext)
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmationProvider")
  }
  return context.confirm
}
