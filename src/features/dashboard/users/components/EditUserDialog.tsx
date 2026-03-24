"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUsers } from "../hooks/useUsers";
import { UserDashboard } from "../types/user.types";
import { motion, AnimatePresence } from "motion/react";
import { UserForm, UserFormValues } from "./UserForm";

interface EditUserDialogProps {
  user: UserDashboard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const t = useTranslations("Dashboard");
  const tUsers = useTranslations("Users");
  const { updateUser, isUpdating } = useUsers();

  const handleUpdateUser = async (data: UserFormValues) => {
    if (!user) return;
    try {
      await updateUser({ userId: user.user_id, data: data as any });
      onOpenChange(false);
    } catch (error) {}
  };

  const defaultValues: UserFormValues = {
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "user",
    status: user?.status || "active",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent 
            forceMount
            className="sm:max-w-[425px] rounded-[24px] overflow-hidden p-0" 
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
                  {t("users_management")} - {tUsers("edit_user")}
                </DialogTitle>
              </DialogHeader>

              <UserForm
                mode="edit"
                defaultValues={defaultValues}
                onSubmit={handleUpdateUser}
                isLoading={isUpdating}
                submitLabel={tUsers("edit_user")}
                onCancel={() => onOpenChange(false)}
              />
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
