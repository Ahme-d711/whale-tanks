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
import { Subscription } from "../types/subscription.types";

interface EditSubscriptionDialogProps {
  subscriptionData: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSubscriptionDialog({ subscriptionData, open, onOpenChange }: EditSubscriptionDialogProps) {
  const t = useTranslations("Subscriptions");
  const { updateSubscription, isUpdating } = useSubscriptions();

  const handleSubmit = async (data: SubscriptionFormValues) => {
    if (!subscriptionData) return;
    try {
      await updateSubscription({ subscriptionId: subscriptionData.subscription_id, data });
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  if (!subscriptionData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[32px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t("edit_subscription")}</DialogTitle>
        </DialogHeader>
        <SubscriptionForm
          defaultValues={{
            user_id: subscriptionData.user_id,
            package_id: subscriptionData.package_id,
            status: subscriptionData.status as any,
            start_date: subscriptionData.start_date.split("T")[0],
            end_date: subscriptionData.end_date.split("T")[0],
          }}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          submitLabel={t("edit_subscription")}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
