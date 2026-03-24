"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel,
  cancelLabel,
  variant = "destructive",
  isLoading = false,
}: ConfirmDialogProps) {
  const t = useTranslations("Auth");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent 
            forceMount
            className="sm:max-w-[425px] rounded-[24px] overflow-hidden p-0" 
            showCloseButton={false}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full h-full p-6"
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                <DialogDescription className="pt-2 text-content-secondary">
                  {description}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4 flex flex-row! gap-3">
                <Button
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 rounded-xl"
                  disabled={isLoading}
                >
                  {cancelLabel || "Cancel"}
                </Button>
                <Button
                  variant={variant}
                  onClick={() => {
                    onConfirm();
                  }}
                  className="flex-1 rounded-xl"
                  disabled={isLoading}
                >
                  {confirmLabel || "Confirm"}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
