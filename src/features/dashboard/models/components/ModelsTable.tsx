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
import { AIModel } from "../types/model.types";
import { useModels } from "../hooks/useModels";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EditModelDialog } from "./EditModelDialog";
import { Switch } from "@/components/ui/switch";
import { TableFilterBar } from "@/components/shared/TableFilterBar";

export default function ModelsTable() {
  const t = useTranslations("AIModels");
  const tDashboard = useTranslations("Dashboard");
  const [filters, setFilters] = React.useState<{ active_only?: boolean }>({ active_only: undefined });
  const { models, isLoading, deleteModel, updateModel, isDeleting } = useModels(filters);
  const [modelToDelete, setModelToDelete] = React.useState<AIModel | null>(null);
  const [modelToEdit, setModelToEdit] = React.useState<AIModel | null>(null);

  const filterFields = [
    {
      id: "active_only",
      label: t("status"),
      type: "tabs" as const,
      options: [
        { label: t("all"), value: undefined },
        { label: t("is_active"), value: true },
        { label: t("inactive"), value: false },
      ],
    },
  ];

  const handleFilterChange = (id: string, value: any) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const columns: UniTableColumn<AIModel>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("model_name"),
      className: "font-bold text-primary",
    },
    {
      id: "provider_id",
      accessorKey: "provider_id",
      header: t("provider_id"),
      className: "font-medium text-content-secondary",
    },
    {
      id: "input_token_cost",
      accessorKey: "input_token_cost",
      header: t("input_cost"),
      cell: (value: any) => (
        <span className="font-mono text-xs">{Number(value).toFixed(6)}</span>
      ),
    },
    {
      id: "output_token_cost",
      accessorKey: "output_token_cost",
      header: t("output_cost"),
      cell: (value: any) => (
        <span className="font-mono text-xs">{Number(value).toFixed(6)}</span>
      ),
    },
    {
      id: "max_tokens",
      accessorKey: "max_tokens",
      header: t("max_tokens"),
      cell: (value: any) => (
        <span className="font-mono">{(value as number).toLocaleString()}</span>
      ),
    },
    {
      id: "is_active",
      accessorKey: "is_active",
      header: t("status"),
      cell: (value: any, row: AIModel) => (
        <Switch 
          checked={value as boolean} 
          onCheckedChange={(checked) => updateModel({ modelId: row.model_id, data: { is_active: checked } })}
        />
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      headerClassName: "justify-center",
      cell: (_: any, row: AIModel) => (
        <ActionCell>
          <EditActionButton 
            onClick={() => setModelToEdit(row)} 
          />
          <DeleteActionButton 
            onClick={() => setModelToDelete(row)} 
          />
        </ActionCell>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <TableFilterBar
        fields={filterFields}
        values={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white rounded-[32px] border border-divider overflow-hidden shadow-sm">
        <UniTable 
          data={models} 
          columns={columns as any} 
        />
      </div>

      <EditModelDialog 
        modelData={modelToEdit}
        open={!!modelToEdit}
        onOpenChange={(open) => !open && setModelToEdit(null)}
      />

      <ConfirmDialog 
        open={!!modelToDelete}
        onOpenChange={(open) => !open && setModelToDelete(null)}
        title={t("delete_model")}
        description={`${t("delete_confirm")} : ${modelToDelete?.name}`}
        onConfirm={async () => {
          if (modelToDelete) {
            await deleteModel(modelToDelete.model_id);
            setModelToDelete(null);
          }
        }}
        confirmLabel={tDashboard("delete")}
        cancelLabel={tDashboard("cancel")}
        isLoading={isDeleting}
      />
    </div>
  );
}
