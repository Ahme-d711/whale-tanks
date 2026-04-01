import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { executionService } from "../services/execution.service";
import { Execution, CreateExecutionData } from "../types/execution.types";

export const useExecutions = (skip = 0, limit = 50) => {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchExecutions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await executionService.getExecutions(skip, limit);
      setExecutions(data);
      setError(null);
    } catch (err: any) {
      setError(err);
      toast.error("Error fetching executions", {
        description: err.response?.data?.message || err.message || "Failed to load executions",
      });
    } finally {
      setIsLoading(false);
    }
  }, [skip, limit]);

  useEffect(() => {
    fetchExecutions();
  }, [fetchExecutions]);

  const createExecution = async (data: CreateExecutionData) => {
    try {
      const newExecution = await executionService.createExecution(data);
      setExecutions((prev) => [newExecution, ...prev]);
      toast.success("Execution Created", {
        description: `Execution ${newExecution.execution_id} successful.`,
      });
      return newExecution;
    } catch (err: any) {
      toast.error("Error creating execution", {
        description: err.response?.data?.message || err.message || "Execution failed",
      });
    }
  };

  return {
    executions,
    isLoading,
    error,
    refetch: fetchExecutions,
    createExecution,
  };
};
