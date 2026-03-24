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
import { Package } from "../types/package.types";
import { usePackages } from "../hooks/usePackages";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EditPackageDialog } from "./EditPackageDialog";
import { Switch } from "@/components/ui/switch";
import { TableFilterBar } from "@/components/shared/TableFilterBar";

export default function PackagesTable() {
  const t = useTranslations("Packages");
  const tDashboard = useTranslations("Dashboard");
  const [filters, setFilters] = React.useState<{ active_only?: boolean }>({ active_only: undefined });
  const { packages, isLoading, deletePackage, updatePackage, isDeleting } = usePackages(filters);
  const [packageToDelete, setPackageToDelete] = React.useState<Package | null>(null);
  const [packageToEdit, setPackageToEdit] = React.useState<Package | null>(null);

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

  const columns: UniTableColumn<Package>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("package_name"),
      className: "font-bold text-primary",
    },
    {
      id: "monthly_token_limit",
      accessorKey: "monthly_token_limit",
      header: t("monthly_tokens"),
      cell: (value: any) => (
        <span className="font-mono">{(value as number).toLocaleString()}</span>
      ),
    },
    {
      id: "price",
      accessorKey: "price",
      header: t("price"),
      cell: (value: any) => (
        <span className="font-bold text-success">{(value as number).toLocaleString()} AED</span>
      ),
    },
    {
      id: "duration_days",
      accessorKey: "duration_days",
      header: t("duration"),
      cell: (value: any) => (
        <span>{value as number} {t("days")}</span>
      ),
    },
    {
      id: "is_active",
      accessorKey: "is_active",
      header: t("status"),
      cell: (value: any, row: Package) => (
        <Switch 
          checked={value as boolean} 
          onCheckedChange={(checked) => updatePackage({ packageId: row.package_id, data: { is_active: checked } })}
        />
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      headerClassName: "justify-center",
      cell: (_: any, row: Package) => (
        <ActionCell>
          <EditActionButton 
            onClick={() => setPackageToEdit(row)} 
          />
          <DeleteActionButton 
            onClick={() => setPackageToDelete(row)} 
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
          data={packages} 
          columns={columns as any} 
        />
      </div>

      <EditPackageDialog 
        packageData={packageToEdit as any}
        open={!!packageToEdit}
        onOpenChange={(open) => !open && setPackageToEdit(null)}
      />

      <ConfirmDialog 
        open={!!packageToDelete}
        onOpenChange={(open) => !open && setPackageToDelete(null)}
        title={t("delete_package")}
        description={`${t("delete_confirm")} : ${packageToDelete?.name}`}
        onConfirm={async () => {
          if (packageToDelete) {
            await deletePackage(packageToDelete.package_id);
            setPackageToDelete(null);
          }
        }}
        confirmLabel={tDashboard("delete")}
        cancelLabel={tDashboard("cancel")}
        isLoading={isDeleting}
      />
    </div>
  );
}
