"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { ModelForm, ModelFormValues } from "./ModelForm";
import { useModels } from "../hooks/useModels";

interface AddModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddModelDialog({ open, onOpenChange }: AddModelDialogProps) {
  const t = useTranslations("AIModels");
  const { createModel, isCreating } = useModels();

  const handleSubmit = async (data: ModelFormValues) => {
    try {
      await createModel(data);
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-[32px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t("add_model")}</DialogTitle>
        </DialogHeader>
        <ModelForm
          defaultValues={{
            name: "",
            provider_id: "",
            input_token_cost: 0,
            output_token_cost: 0,
            max_tokens: 0,
            is_active: true,
          }}
          onSubmit={handleSubmit}
          isLoading={isCreating}
          submitLabel={t("add_model")}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
