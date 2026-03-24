import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageService } from "../services/package.service";
import { toast } from "sonner";
import { CreatePackageData, UpdatePackageData } from "../types/package.types";

export function usePackages() {
  const queryClient = useQueryClient();

  const {
    data: packages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: packageService.getPackages,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePackageData) => packageService.createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Package created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create package");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ packageId, data }: { packageId: string; data: UpdatePackageData }) =>
      packageService.updatePackage(packageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Package updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update package");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (packageId: string) => packageService.deletePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Package deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete package");
    },
  });

  return {
    packages,
    isLoading,
    error,
    createPackage: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updatePackage: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deletePackage: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
