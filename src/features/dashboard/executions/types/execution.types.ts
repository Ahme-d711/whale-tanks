export interface Execution {
  execution_id: string;
  user_id: string;
  model_id: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: string;
  execution_type: string;
  executed_at: string;
}

export interface CreateExecutionData {
  user_id: string;
  model_id: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  execution_type: string;
}
