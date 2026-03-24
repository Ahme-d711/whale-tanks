export interface AIModel {
  model_id: string;
  provider_id: string;
  name: string;
  input_token_cost: number;
  output_token_cost: number;
  max_tokens: number;
  is_active: boolean;
  created_at?: string;
}

export interface CreateModelData {
  provider_id: string;
  name: string;
  input_token_cost: number;
  output_token_cost: number;
  max_tokens: number;
  is_active: boolean;
}

export interface UpdateModelData extends Partial<CreateModelData> {}

export interface AIModelFilters {
  active_only?: boolean;
}
