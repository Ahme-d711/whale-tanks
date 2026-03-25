"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { 
  UniTable, 
  UniTableColumn,
  ActionCell,
  EditActionButton,
  DeleteActionButton
} from "@/components/shared/uni-table";
import { AIProvider } from "../types/provider.types";
import { useProviders } from "../hooks/useProviders";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EditProviderDialog } from "./EditProviderDialog";
import { Switch } from "@/components/ui/switch";
import { TableFilterBar } from "@/components/shared/TableFilterBar";

export default function ProvidersTable() {
  const t = useTranslations("AIProviders");
  const tDashboard = useTranslations("Dashboard");
  const [filters, setFilters] = React.useState<{ active_only?: boolean }>({ active_only: undefined });
  const { providers, isLoading, deleteProvider, updateProvider, isDeleting } = useProviders(filters);
  const [providerToDelete, setProviderToDelete] = React.useState<AIProvider | null>(null);
  const [providerToEdit, setProviderToEdit] = React.useState<AIProvider | null>(null);

  const filterFields = [
    {
      id: "active_only",
      label: t("status"),
      type: "tabs" as const,
      options: [
        { label: t("all"), value: undefined },
        { label: t("active"), value: true },
        { label: t("inactive"), value: false },
      ],
    },
  ];

  const handleFilterChange = (id: string, value: any) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const columns: UniTableColumn<AIProvider>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("provider_name"),
      className: "font-bold text-primary text-base",
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("status"),
      cell: (value: any, row: AIProvider) => (
        <Switch 
          checked={value === "active"} 
          onCheckedChange={(checked) => updateProvider({ providerId: row.provider_id, data: { status: checked ? "active" : "inactive" } })}
        />
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      headerClassName: "justify-center",
      cell: (_: any, row: AIProvider) => (
        <ActionCell>
          <EditActionButton 
            onClick={() => setProviderToEdit(row)} 
          />
          <DeleteActionButton 
            onClick={() => setProviderToDelete(row)} 
          />
        </ActionCell>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <TableFilterBar
        fields={filterFields}
        values={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white rounded-[32px] border border-divider overflow-hidden shadow-sm transition-all hover:shadow-md">
        <UniTable 
          data={providers} 
          columns={columns as any} 
        />
      </div>

      <EditProviderDialog 
        providerData={providerToEdit}
        open={!!providerToEdit}
        onOpenChange={(open) => !open && setProviderToEdit(null)}
      />

      <ConfirmDialog 
        open={!!providerToDelete}
        onOpenChange={(open) => !open && setProviderToDelete(null)}
        title={t("delete_provider")}
        description={`${t("delete_confirm")} : ${providerToDelete?.name}`}
        onConfirm={async () => {
          if (providerToDelete) {
            await deleteProvider(providerToDelete.provider_id);
            setProviderToDelete(null);
          }
        }}
        confirmLabel={tDashboard("delete")}
        cancelLabel={tDashboard("cancel")}
        isLoading={isDeleting}
      />
    </div>
  );
}
