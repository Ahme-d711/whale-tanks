"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import LogoComponent from "@/components/shared/LogoComponent"
import { useAuthStore } from "../stores/authStore"
import { AuthInput } from "./AuthInput"
import ShinyButton from "@/components/shared/ShinyButton"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  oldPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
})

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditProfileDialog({
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const { user } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      oldPassword: "",
      newPassword: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Handle profile update logic here
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] rounded-[40px] p-10 border-none shadow-2xl">
        <DialogHeader className="items-start space-y-7 text-left">
          <LogoComponent />
          <DialogTitle className="text-[32px] font-medium text-primary leading-tight">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <AuthInput
              control={form.control}
              name="name"
              label="Name"
              placeholder="Your full name"
              delay={0.1}
            />

            <AuthInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
              delay={0.2}
            />

            <AuthInput
              control={form.control}
              name="oldPassword"
              label="Old Password"
              placeholder="Your old password"
              type="password"
              delay={0.3}
            />

            <AuthInput
              control={form.control}
              name="newPassword"
              label="New Password"
              placeholder="Your new password"
              type="password"
              delay={0.4}
            />


            <ShinyButton 
            type="submit" 
            loadingText="Confirm..."
            className="w-full font-medium! capitalize!"
          >
            Confirm
          </ShinyButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
