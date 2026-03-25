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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePackages } from "../../packages/hooks/usePackages";
import { useUsers } from "../../users/hooks/useUsers";

const subscriptionSchema = z.object({
  user_id: z.string().min(1, "User is required"),
  package_id: z.string().min(1, "Package is required"),
  status: z.enum(["active", "inactive"]),
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
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("user")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                disabled={isLoadingUsers}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={isLoadingUsers ? "Loading..." : "Select user"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  {users.map((user) => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      {user.full_name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="package_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("package")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                disabled={isLoadingPackages}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={isLoadingPackages ? "Loading..." : "Select package"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.package_id} value={pkg.package_id}>
                      {pkg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("status")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  <SelectItem value="active">{t("status_active")}</SelectItem>
                  <SelectItem value="inactive">{t("status_inactive")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
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
