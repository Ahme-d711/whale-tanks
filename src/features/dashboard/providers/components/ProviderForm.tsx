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
import { Switch } from "@/components/ui/switch";

const providerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  status: z.enum(["active", "inactive"]),
});

export type ProviderFormValues = z.infer<typeof providerSchema>;

interface ProviderFormProps {
  defaultValues: ProviderFormValues;
  onSubmit: (data: ProviderFormValues) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
  onCancel: () => void;
}

export function ProviderForm({ defaultValues, onSubmit, isLoading, submitLabel, onCancel }: ProviderFormProps) {
  const t = useTranslations("AIProviders");
  const tDashboard = useTranslations("Dashboard");

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema) as any,
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("provider_name")}</FormLabel>
              <FormControl>
                <Input placeholder="OpenAI" className="rounded-xl h-12" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-divider p-4 shadow-sm bg-background-secondary/30">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-semibold">
                  {t("status")}
                </FormLabel>
                <div className="text-sm text-content-tertiary">
                  {field.value === "active" ? t("active_desc") : t("inactive_desc")}
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "active"}
                  onCheckedChange={(checked) => field.onChange(checked ? "active" : "inactive")}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="rounded-xl h-11 px-6 font-medium text-content-tertiary hover:text-content-primary hover:bg-background-secondary transition-all"
          >
            {tDashboard("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-xl h-11 px-8 font-semibold shadow-md active:scale-95 transition-all min-w-[120px]"
          >
            {isLoading ? <Spinner className="w-5 h-5" /> : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
