import clientAxios from "@/lib/axios/clientAxios";
import { Subscription, CreateSubscriptionData, UpdateSubscriptionData } from "../types/subscription.types";

export const subscriptionService = {
  getSubscriptions: async (): Promise<Subscription[]> => {
    const response = await clientAxios.get<Subscription[]>("/subscriptions/");
    return response.data;
  },

  getActiveSubscription: async (): Promise<Subscription | null> => {
    try {
      const response = await clientAxios.get<Subscription>("/subscriptions/active");
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getSubscription: async (subscriptionId: string): Promise<Subscription> => {
    const response = await clientAxios.get<Subscription>(`/subscriptions/${subscriptionId}`);
    return response.data;
  },

  subscribe: async (data: CreateSubscriptionData): Promise<Subscription> => {
    const response = await clientAxios.post<Subscription>("/subscriptions/", data);
    return response.data;
  },

  updateSubscription: async (subscriptionId: string, data: UpdateSubscriptionData): Promise<Subscription> => {
    const response = await clientAxios.put<Subscription>(`/subscriptions/${subscriptionId}`, data);
    return response.data;
  },

  deleteSubscription: async (subscriptionId: string): Promise<void> => {
    await clientAxios.delete(`/subscriptions/${subscriptionId}`);
  },
};
