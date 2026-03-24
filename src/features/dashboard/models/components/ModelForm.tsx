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
import { Checkbox } from "@/components/ui/checkbox";

const modelSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  provider_id: z.string().min(1, "Provider ID is required"),
  input_token_cost: z.coerce.number().min(0),
  output_token_cost: z.coerce.number().min(0),
  max_tokens: z.coerce.number().min(0),
  is_active: z.boolean().default(true),
});

export type ModelFormValues = z.infer<typeof modelSchema>;

interface ModelFormProps {
  defaultValues: ModelFormValues;
  onSubmit: (data: ModelFormValues) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
  onCancel: () => void;
}

export function ModelForm({ defaultValues, onSubmit, isLoading, submitLabel, onCancel }: ModelFormProps) {
  const t = useTranslations("AIModels");
  const tDashboard = useTranslations("Dashboard");

  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema) as any,
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("model_name")}</FormLabel>
                <FormControl>
                  <Input placeholder="gpt-4o" className="rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="provider_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("provider_id")}</FormLabel>
                <FormControl>
                  <Input placeholder="openai" className="rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="input_token_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("input_cost")}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" className="rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="output_token_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("output_cost")}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" className="rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="max_tokens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("max_tokens")}</FormLabel>
                <FormControl>
                  <Input type="number" className="rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 pt-8">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {t("is_active")}
                  </FormLabel>
                </div>
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
            {tDashboard("cancel")}
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
