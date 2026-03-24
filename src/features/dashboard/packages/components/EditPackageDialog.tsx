"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePackages } from "../hooks/usePackages";
import { Package } from "../types/package.types";
import { motion, AnimatePresence } from "motion/react";
import { PackageForm, PackageFormValues } from "./PackageForm";

interface EditPackageDialogProps {
  packageData: Package | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPackageDialog({ packageData, open, onOpenChange }: EditPackageDialogProps) {
  const t = useTranslations("Packages");
  const { updatePackage, isUpdating } = usePackages();

  const handleUpdatePackage = async (data: PackageFormValues) => {
    if (!packageData) return;
    try {
      await updatePackage({ packageId: packageData.package_id, data: data as any });
      onOpenChange(false);
    } catch (error) {}
  };

  const defaultValues: PackageFormValues = {
    name: packageData?.name || "",
    monthly_token_limit: packageData?.monthly_token_limit || 0,
    price: packageData?.price || 0,
    overage_cost_per_1k_tokens: packageData?.overage_cost_per_1k_tokens || 0,
    duration_days: packageData?.duration_days || 30,
    is_active: packageData?.is_active ?? true,
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
                  {t("edit_package")}
                </DialogTitle>
              </DialogHeader>

              <PackageForm
                defaultValues={defaultValues}
                onSubmit={handleUpdatePackage}
                isLoading={isUpdating}
                submitLabel={t("edit_package")}
                onCancel={() => onOpenChange(false)}
              />
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
