export interface AIProvider {
  provider_id: string;
  name: string;
  status: "active" | "inactive";
}

export interface CreateProviderData {
  name: string;
  status: "active" | "inactive";
}

export interface UpdateProviderData extends Partial<CreateProviderData> {}

export interface AIProviderFilters {
  active_only?: boolean;
}
