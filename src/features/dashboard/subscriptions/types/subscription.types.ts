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
  user_id: string;
  package_id: string;
  status: "active" | "inactive";
  start_date?: string;
  end_date?: string;
}

export interface UpdateSubscriptionData extends Partial<CreateSubscriptionData> {}
