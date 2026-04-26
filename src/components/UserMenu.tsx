"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { LogOut, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ConfirmationDialog } from "./shared/ConfirmationDialog";
import { useTranslations } from "next-intl";
import { getImageUrl } from "@/utils/images";
import { EditUserDialog } from "@/features/dashboard/users/components/EditUserDialog";
import { UserDashboard } from "@/features/dashboard/users/types/user.types";

export function UserMenu() {
  const { user } = useAuthStore();
  const t = useTranslations("Navigation");
  const tAuth = useTranslations("Auth");
  
  const { logout, loading: isLoggingOut } = useLogout();

  const userName = user?.name || tAuth("user_fallback");
  const userPhoto = getImageUrl(user?.picture);
  const userInitial = userName?.charAt(0).toUpperCase() || "U";
  const userRole = user?.role === "admin" ? t("admin_status") : t("user_fallback"); 
  const [imageError, setImageError] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const userId = (user && (user.user_id || user._id || user.id)) as string | undefined;

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = async () => {
    if (isLoggingOut) return;
    await logout();
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-auto p-1 hover:bg-transparent group" suppressHydrationWarning>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary/20 transition-all">
                  {!imageError && userPhoto ? (
                    <AvatarImage
                      src={userPhoto}
                      alt={userName}
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-border bg-success" />
              </div>
              
              <div className="hidden sm:flex flex-col items-start gap-0.5">
                <span className="text-sm font-semibold text-content-primary leading-tight">
                  {userName}
                </span>
                <span className="text-xs font-medium text-content-secondary">
                  {userRole}
                </span>
              </div>
              
              <ChevronDown className="h-4 w-4 text-content-secondary group-hover:text-primary transition-colors" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 mt-2 border-divider" align="end">
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start cursor-pointer transition-colors"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <User className="h-4 w-4 mr-2" />
              {tAuth("edit_profile")}
            </Button>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full justify-start cursor-pointer"
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title={t("logout")}
        description={tAuth("sign_in_text")}
        confirmText={t("logout")}
        variant="default"
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />

      <EditUserDialog
        user={user as unknown as UserDashboard}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
