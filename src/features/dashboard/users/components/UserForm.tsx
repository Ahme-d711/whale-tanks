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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tAuth("name")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tAuth("name_placeholder")}
                  className="rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tAuth("email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={tAuth("email_placeholder")}
                  className="rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === "add" && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tAuth("password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={tAuth("password_placeholder")}
                    className="rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {mode === "edit" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tUsers("role")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="admin">{tUsers("roles.admin")}</SelectItem>
                      <SelectItem value="editor">{tUsers("roles.editor")}</SelectItem>
                      <SelectItem value="user">{tUsers("roles.user")}</SelectItem>
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
                  <FormLabel>{tUsers("status")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="active">{tUsers("statuses.active")}</SelectItem>
                      <SelectItem value="inactive">{tUsers("statuses.inactive")}</SelectItem>
                      <SelectItem value="suspended">{tUsers("statuses.suspended")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

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
