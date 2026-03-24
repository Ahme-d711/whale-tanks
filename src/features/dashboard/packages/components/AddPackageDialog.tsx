"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { usePackages } from "../hooks/usePackages";
import { Spinner } from "@/components/ui/spinner";
import { motion, AnimatePresence } from "motion/react";

const packageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  monthly_token_limit: z.number().min(0),
  price: z.number().min(0),
  overage_cost_per_1k_tokens: z.number().min(0),
  duration_days: z.number().min(1),
  is_active: z.boolean(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface AddPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPackageDialog({ open, onOpenChange }: AddPackageDialogProps) {
  const t = useTranslations("Packages");
  const { createPackage, isCreating } = usePackages();

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      monthly_token_limit: 0,
      price: 0,
      overage_cost_per_1k_tokens: 0,
      duration_days: 30,
      is_active: true,
    },
  });

  const onSubmit = async (data: PackageFormValues) => {
    try {
      await createPackage(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent 
            forceMount
            className="sm:max-w-[500px] rounded-[24px] overflow-hidden p-0" 
            showCloseButton={false}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full h-full p-6"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary">
                  {t("add_package")}
                </DialogTitle>
              </DialogHeader>

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

                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="rounded-xl min-w-[100px]"
                    >
                      {isCreating ? <Spinner className="w-4 h-4" /> : t("add_package")}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
