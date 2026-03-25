export interface Subscription {
  subscription_id: string;
  user_id: string;
  package_id: string;
  status: "active" | "inactive" | "expired" | "cancelled";
  start_date: string;
  end_date: string;
  tokens_used: number;
  tokens_limit: number;
  created_at?: string;
  updated_at?: string;
  user_name?: string; // Optinal, from join if available
  package_name?: string; // Optional, from join if available
}

export interface CreateSubscriptionData {
  package_id: string;
  start_date: string;
  end_date: string;
}

export interface UpdateSubscriptionData extends Partial<CreateSubscriptionData> {
  status?: "active" | "inactive" | "expired" | "cancelled";
}
