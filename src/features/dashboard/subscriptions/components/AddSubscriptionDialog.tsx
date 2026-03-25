"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { SubscriptionForm, SubscriptionFormValues } from "./SubscriptionForm";
import { useSubscriptions } from "../hooks/useSubscriptions";

interface AddSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSubscriptionDialog({ open, onOpenChange }: AddSubscriptionDialogProps) {
  const t = useTranslations("Subscriptions");
  const { createSubscription, isCreating } = useSubscriptions();

  const handleSubmit = async (data: SubscriptionFormValues) => {
    try {
      await createSubscription(data);
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[32px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t("add_subscription")}</DialogTitle>
        </DialogHeader>
        <SubscriptionForm
          defaultValues={{
            user_id: "",
            package_id: "",
            status: "active",
            start_date: new Date().toISOString().split("T")[0],
            end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
          }}
          onSubmit={handleSubmit}
          isLoading={isCreating}
          submitLabel={t("add_subscription")}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
