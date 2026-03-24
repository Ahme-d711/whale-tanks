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
import { AIModel } from "../types/model.types";

interface EditModelDialogProps {
  modelData: AIModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditModelDialog({ modelData, open, onOpenChange }: EditModelDialogProps) {
  const t = useTranslations("AIModels");
  const { updateModel, isUpdating } = useModels();

  const handleSubmit = async (data: ModelFormValues) => {
    if (!modelData) return;
    try {
      await updateModel({ modelId: modelData.model_id, data });
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  if (!modelData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-[32px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t("edit_model")}</DialogTitle>
        </DialogHeader>
        <ModelForm
          defaultValues={{
            name: modelData.name,
            provider_id: modelData.provider_id,
            input_token_cost: modelData.input_token_cost,
            output_token_cost: modelData.output_token_cost,
            max_tokens: modelData.max_tokens,
            is_active: modelData.is_active,
          }}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          submitLabel={t("edit_model")}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
