import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { modelService } from "../services/model.service";
import { toast } from "sonner";
import { CreateModelData, UpdateModelData, AIModelFilters } from "../types/model.types";

export function useModels(filters?: AIModelFilters) {
  const queryClient = useQueryClient();

  const {
    data: models = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["models", filters],
    queryFn: () => modelService.getModels(filters?.active_only),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateModelData) => modelService.createModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      toast.success("Model created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create model");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ modelId, data }: { modelId: string; data: UpdateModelData }) =>
      modelService.updateModel(modelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      toast.success("Model updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update model");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (modelId: string) => modelService.deleteModel(modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      toast.success("Model deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete model");
    },
  });

  return {
    models,
    isLoading,
    error,
    createModel: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateModel: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteModel: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
