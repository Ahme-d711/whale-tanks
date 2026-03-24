import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockUsers } from "../utils/mockUsers";
import { authService } from "@/features/auth/services/auth.service";
import { toast } from "sonner";
import { UserDashboard } from "../types/user.types";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = mockUsers, isLoading } = useQuery<UserDashboard[]>({
    queryKey: ["users"],
    queryFn: async () => {
      // This is a placeholder for a real getUsers endpoint
      // For now, we use mockData as the base
      return mockUsers;
    },
    initialData: mockUsers,
    staleTime: Infinity, // Keep it static in memory
  });

  const addUserMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (newUser) => {
      const formattedUser: UserDashboard = {
        ...newUser,
        // Since register returns a User, we ensure it has dashboard fields
        status: "active",
        role: "user",
        created_at: newUser.created_at || new Date().toISOString(),
      };
      
      // Update the cache locally to "activate" the UI change
      queryClient.setQueryData(["users"], (oldUsers: UserDashboard[] | undefined) => {
        return oldUsers ? [formattedUser, ...oldUsers] : [formattedUser];
      });

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

  return {
    users,
    isLoading,
    addUser: addUserMutation.mutateAsync,
    isAdding: addUserMutation.isPending,
  };
};
