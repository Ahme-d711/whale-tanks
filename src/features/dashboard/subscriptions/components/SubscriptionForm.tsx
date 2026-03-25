"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FormSelect } from "@/components/shared/form";
import { usePackages } from "../../packages/hooks/usePackages";
import { useUsers } from "../../users/hooks/useUsers";

const subscriptionSchema = z.object({
  user_id: z.string().min(1, "User is required"),
  package_id: z.string().min(1, "Package is required"),
  status: z.enum(["active", "inactive"]),
  start_date: z.string().min(1, "Start Date is required"),
  end_date: z.string().min(1, "End Date is required"),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  defaultValues: SubscriptionFormValues;
  onSubmit: (data: SubscriptionFormValues) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
  onCancel: () => void;
}

export function SubscriptionForm({ defaultValues, onSubmit, isLoading, submitLabel, onCancel }: SubscriptionFormProps) {
  const t = useTranslations("Subscriptions");
  const tDashboard = useTranslations("Dashboard");
  const { users, isLoading: isLoadingUsers } = useUsers();
  const { packages, isLoading: isLoadingPackages } = usePackages({ active_only: true });

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema) as any,
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormSelect
          control={form.control}
          name="user_id"
          label={t("user")}
          placeholder="Select user"
          isLoading={isLoadingUsers}
          options={users.map((user) => ({
            label: user.full_name || user.email,
            value: user.user_id,
          }))}
        />

        <FormSelect
          control={form.control}
          name="package_id"
          label={t("package")}
          placeholder="Select package"
          isLoading={isLoadingPackages}
          options={packages.map((pkg) => ({
            label: pkg.name,
            value: pkg.package_id,
          }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("start_date")}</FormLabel>
                <FormControl>
                  <Input type="date" className="rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("end_date")}</FormLabel>
                <FormControl>
                  <Input type="date" className="rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormSelect
          control={form.control}
          name="status"
          label={t("status")}
          placeholder="Select status"
          options={[
            { label: t("status_active"), value: "active" },
            { label: t("status_inactive"), value: "inactive" },
          ]}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="rounded-xl"
          >
            {tDashboard("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-xl min-w-[120px]"
          >
            {isLoading ? <Spinner className="w-5 h-5" /> : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
