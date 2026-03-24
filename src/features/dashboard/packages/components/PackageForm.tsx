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

const packageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  monthly_token_limit: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
  overage_cost_per_1k_tokens: z.coerce.number().min(0),
  duration_days: z.coerce.number().min(1),
  is_active: z.boolean(),
});

export type PackageFormValues = {
  name: string;
  monthly_token_limit: number;
  price: number;
  overage_cost_per_1k_tokens: number;
  duration_days: number;
  is_active: boolean;
};

interface PackageFormProps {
  defaultValues: PackageFormValues;
  onSubmit: (data: PackageFormValues) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
  onCancel: () => void;
}

export function PackageForm({ defaultValues, onSubmit, isLoading, submitLabel, onCancel }: PackageFormProps) {
  const t = useTranslations("Packages");

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema) as any,
    defaultValues,
  });

  // Update form values if defaultValues change (e.g. when editing)
  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("package_name")}</FormLabel>
              <FormControl>
                <Input className="rounded-xl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("price")}</FormLabel>
                <FormControl>
                  <Input type="number" className="rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("duration")} ({t("days")})</FormLabel>
                <FormControl>
                  <Input type="number" className="rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="monthly_token_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("monthly_tokens")}</FormLabel>
                <FormControl>
                  <Input type="number" className="rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="overage_cost_per_1k_tokens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("overage_cost")}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.0001" className="rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-xl min-w-[100px]"
          >
            {isLoading ? <Spinner className="w-4 h-4" /> : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
