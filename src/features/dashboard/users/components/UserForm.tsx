"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UniInput, UniSelect } from "@/components/shared/form";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["admin", "user", "editor"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  role?: "admin" | "user" | "editor";
  status?: "active" | "inactive" | "suspended";
}

interface UserFormProps {
  mode: "add" | "edit";
  defaultValues: UserFormValues;
  onSubmit: (data: UserFormValues) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
  onCancel: () => void;
}

export function UserForm({ mode, defaultValues, onSubmit, isLoading, submitLabel, onCancel }: UserFormProps) {
  const tDashboard = useTranslations("Dashboard");
  const tUsers = useTranslations("Users");
  const tAuth = useTranslations("Auth");

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema) as any,
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const roleOptions = [
    { label: tUsers("roles.admin"), value: "admin" },
    { label: tUsers("roles.editor"), value: "editor" },
    { label: tUsers("roles.user"), value: "user" },
  ];

  const statusOptions = [
    { label: tUsers("statuses.active"), value: "active" },
    { label: tUsers("statuses.inactive"), value: "inactive" },
    { label: tUsers("statuses.suspended"), value: "suspended" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <UniInput
          control={form.control}
          name="name"
          label={tAuth("name")}
          placeholder={tAuth("name_placeholder")}
          isLoading={isLoading}
        />

        <UniInput
          control={form.control}
          name="email"
          label={tAuth("email")}
          type="email"
          placeholder={tAuth("email_placeholder")}
          isLoading={isLoading}
        />

        {mode === "add" && (
          <UniInput
            control={form.control}
            name="password"
            label={tAuth("password")}
            type="password"
            placeholder={tAuth("password_placeholder")}
            isLoading={isLoading}
          />
        )}

        {mode === "edit" && (
          <div className="grid grid-cols-2 gap-4">
            <UniSelect
              control={form.control}
              name="role"
              label={tUsers("role")}
              options={roleOptions}
              isLoading={isLoading}
            />

            <UniSelect
              control={form.control}
              name="status"
              label={tUsers("status")}
              options={statusOptions}
              isLoading={isLoading}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 w-full">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="rounded-xl w-1/2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-xl min-w-[100px] w-1/2"
          >
            {isLoading ? <Spinner className="w-4 h-4" /> : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
