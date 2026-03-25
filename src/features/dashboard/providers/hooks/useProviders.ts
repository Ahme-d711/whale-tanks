import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { providerService } from "../services/provider.service";
import { toast } from "sonner";
import { CreateProviderData, UpdateProviderData, AIProviderFilters } from "../types/provider.types";

export function useProviders(filters?: AIProviderFilters) {
  const queryClient = useQueryClient();

  const {
    data: providers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["providers", filters],
    queryFn: () => providerService.getProviders(filters?.active_only),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProviderData) => providerService.createProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Provider created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create provider");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ providerId, data }: { providerId: string; data: UpdateProviderData }) =>
      providerService.updateProvider(providerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Provider updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update provider");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (providerId: string) => providerService.deleteProvider(providerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Provider deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete provider");
    },
  });

  return {
    providers,
    isLoading,
    error,
    createProvider: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProvider: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProvider: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
