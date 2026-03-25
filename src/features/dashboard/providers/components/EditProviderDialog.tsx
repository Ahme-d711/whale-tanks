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
import { AIProvider } from "../types/provider.types";

interface EditProviderDialogProps {
  providerData: AIProvider | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProviderDialog({ providerData, open, onOpenChange }: EditProviderDialogProps) {
  const t = useTranslations("AIProviders");
  const { updateProvider, isUpdating } = useProviders();

  const handleSubmit = async (data: ProviderFormValues) => {
    if (!providerData) return;
    try {
      await updateProvider({ providerId: providerData.provider_id, data });
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  if (!providerData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[32px] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">{t("edit_provider")}</DialogTitle>
        </DialogHeader>
        <ProviderForm
          defaultValues={{
            name: providerData.name,
            status: providerData.status as any,
          }}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          submitLabel={t("edit_provider")}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
