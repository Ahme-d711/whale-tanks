export interface Package {
  package_id: string;
  name: string;
  monthly_token_limit: number;
  price: number;
  overage_cost_per_1k_tokens: number;
  duration_days: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePackageData {
  name: string;
  monthly_token_limit: number;
  price: number;
  overage_cost_per_1k_tokens: number;
  duration_days: number;
  is_active?: boolean;
}

export interface UpdatePackageData extends Partial<CreatePackageData> {}
