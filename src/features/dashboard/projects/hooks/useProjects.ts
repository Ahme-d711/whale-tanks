"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/project.service";
import { toast } from "sonner";

export const useProjects = (skip = 0, limit = 50) => {
  const queryClient = useQueryClient();

  const { data: projects, isLoading, isError, refetch } = useQuery({
    queryKey: ['projects', skip, limit],
    queryFn: () => projectService.getProjects(skip, limit),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success("Project deleted successfully");
    },
    onError: (err: any) => {
      toast.error("Failed to delete project", {
        description: err.response?.data?.message || err.message,
      });
    },
  });

  return {
    projects,
    isLoading,
    isError,
    refetch,
    deleteProject: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
