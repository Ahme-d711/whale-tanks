import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "../services/subscription.service";
import { toast } from "sonner";
import { CreateSubscriptionData, UpdateSubscriptionData } from "../types/subscription.types";

export function useSubscriptions() {
  const queryClient = useQueryClient();

  const {
    data: subscriptions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => subscriptionService.getSubscriptions(),
  });

  const { data: activeSubscription } = useQuery({
    queryKey: ["subscriptions", "active"],
    queryFn: () => subscriptionService.getActiveSubscription(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSubscriptionData) => subscriptionService.subscribe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create subscription");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ subscriptionId, data }: { subscriptionId: string; data: UpdateSubscriptionData }) =>
      subscriptionService.updateSubscription(subscriptionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update subscription");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (subscriptionId: string) => subscriptionService.deleteSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete subscription");
    },
  });

  return {
    subscriptions,
    activeSubscription,
    isLoading,
    error,
    createSubscription: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateSubscription: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteSubscription: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
