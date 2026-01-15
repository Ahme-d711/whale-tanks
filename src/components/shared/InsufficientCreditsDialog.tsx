"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { CreditCard, TriangleAlert, X, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface InsufficientCreditsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function InsufficientCreditsDialog({
  isOpen,
  onOpenChange,
}: InsufficientCreditsDialogProps) {
  const t = useTranslations("Billing.insufficient_credits")

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[400px] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl"
        showCloseButton={false}
      >
        <DialogHeader className="relative p-6 pt-12 flex flex-col items-center">
          {/* Icon Circle */}
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-8 border border-border">
            <CreditCard className="w-10 h-10 text-[#253250]" />
          </div>

          {/* Title */}
          <DialogTitle className="text-2xl font-bold text-foreground mb-6 text-center">
            {t("title")}
          </DialogTitle>

          {/* Description */}
          <DialogDescription className="text-secondary-foreground text-center text-[15px] leading-relaxed mb-8 px-4">
            {t("description")}
          </DialogDescription>

          {/* Warning Box */}
          <div className="w-full bg-[#FFFCEB] p-4 rounded-2xl flex items-center justify-between mb-8 border border-[#FEF3C7]">
            <p className="text-[#F2BD00] text-sm font-medium">
              {t("warning")}
            </p>
            <TriangleAlert className="w-5 h-5 text-[#D97706]" />
          </div>

          {/* Action Button */}
          <Button
            className="w-full h-14 bg-[#2D66FF] hover:bg-[#2D66FF]/90 text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            onClick={() => {
              // Handle upgrade logic
              onOpenChange(false)
            }}
          >
            <span>{t("upgrade_button")}</span>
            <Sparkles className="w-5 h-5" />
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
