"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { ProviderForm, ProviderFormValues } from "./ProviderForm";
import { useProviders } from "../hooks/useProviders";

interface AddProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProviderDialog({ open, onOpenChange }: AddProviderDialogProps) {
  const t = useTranslations("AIProviders");
  const { createProvider, isCreating } = useProviders();

  const handleSubmit = async (data: ProviderFormValues) => {
    try {
      await createProvider(data);
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[32px] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">{t("add_provider")}</DialogTitle>
        </DialogHeader>
        <ProviderForm
          defaultValues={{
            name: "",
            status: "active",
          }}
          onSubmit={handleSubmit}
          isLoading={isCreating}
          submitLabel={t("add_provider")}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
