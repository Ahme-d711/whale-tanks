"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePackages } from "../hooks/usePackages";
import { motion, AnimatePresence } from "motion/react";
import { PackageForm, PackageFormValues } from "./PackageForm";

interface AddPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPackageDialog({ open, onOpenChange }: AddPackageDialogProps) {
  const t = useTranslations("Packages");
  const { createPackage, isCreating } = usePackages();

  const handleAddPackage = async (data: PackageFormValues) => {
    try {
      await createPackage(data as any);
      onOpenChange(false);
    } catch (error) {}
  };

  const defaultValues: PackageFormValues = {
    name: "",
    monthly_token_limit: 0,
    price: 0,
    overage_cost_per_1k_tokens: 0,
    duration_days: 30,
    is_active: true,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent 
            forceMount
            className="sm:max-w-[500px] rounded-[24px] overflow-hidden p-0" 
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
                <DialogTitle className="text-2xl font-bold text-primary">
                  {t("add_package")}
                </DialogTitle>
              </DialogHeader>

              <PackageForm
                defaultValues={defaultValues}
                onSubmit={handleAddPackage}
                isLoading={isCreating}
                submitLabel={t("add_package")}
                onCancel={() => onOpenChange(false)}
              />
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
