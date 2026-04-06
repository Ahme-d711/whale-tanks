import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.service";
import { userService } from "../services/user.service";
import { toast } from "sonner";
import { UserDashboard } from "../types/user.types";

export const useUsers = (filters?: { status?: string }) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: users = [], isLoading } = useQuery<UserDashboard[]>({
    queryKey: ["users", filters, page],
    queryFn: () => userService.getUsers((page - 1) * limit, limit, filters?.status),
  });

  // Reset to first page when filtering
  React.useEffect(() => {
    setPage(1);
  }, [filters]);

  const hasMore = users.length === limit;
  const totalPages = hasMore ? page + 1 : page;
  const totalItems = hasMore ? page * limit + 1 : (page - 1) * limit + users.length;

  const addUserMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (newUser) => {
      const formattedUser: UserDashboard = {
        ...newUser,
        status: "active",
        role: "user",
        created_at: newUser.created_at || new Date().toISOString(),
      };
      
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User Added", {
        description: `${formattedUser.name} has been added successfully.`,
      });
    },
    onError: (error: any) => {
      toast.error("Error adding user", {
        description: error.response?.data?.message || error.message || "Registration failed",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<UserDashboard> }) =>
      userService.updateUser(userId, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["users", filters, page], (oldUsers: UserDashboard[] | undefined) => {
        return oldUsers?.map((u) => (u.user_id === updatedUser.user_id ? updatedUser : u));
      });
      // Also invalidate to be safe
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User Updated", {
        description: `${updatedUser.name} has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast.error("Error updating user", {
        description: error.response?.data?.message || error.message || "Update failed",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User Deleted", {
        description: "The user has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast.error("Error deleting user", {
        description: error.response?.data?.message || error.message || "Delete failed",
      });
    },
  });

  return {
    users,
    isLoading,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      onPageChange: setPage,
      pageSize: limit,
    },
    addUser: addUserMutation.mutateAsync,
    isAdding: addUserMutation.isPending,
    updateUser: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending,
    deleteUser: deleteUserMutation.mutateAsync,
    isDeleting: deleteUserMutation.isPending,
  };
};
