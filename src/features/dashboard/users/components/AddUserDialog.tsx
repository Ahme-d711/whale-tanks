"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUsers } from "../hooks/useUsers";
import { RegisterData } from "@/features/auth/types";
import { motion, AnimatePresence } from "motion/react";
import { UserForm, UserFormValues } from "./UserForm";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const t = useTranslations("Dashboard");
  const { addUser, isAdding } = useUsers();

  const handleAddUser = async (data: UserFormValues) => {
    try {
      await addUser(data as RegisterData);
      onOpenChange(false);
    } catch (error) {}
  };

  const defaultValues: UserFormValues = {
    name: "",
    email: "",
    password: "",
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
                  {t("add_user")}
                </DialogTitle>
              </DialogHeader>

              <UserForm
                mode="add"
                defaultValues={defaultValues}
                onSubmit={handleAddUser}
                isLoading={isAdding}
                submitLabel={t("add_user")}
                onCancel={() => onOpenChange(false)}
              />
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
