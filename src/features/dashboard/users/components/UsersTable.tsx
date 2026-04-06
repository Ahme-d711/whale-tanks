"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

import { 
  UniTable, 
  UniTableColumn, 
  ActionCell, 
  StatusSelectCell,
  SelectionCell,
  SelectionHeader,
  oneImage,
  EditActionButton,
  DeleteActionButton
} from "@/components/shared/uni-table";
import { Badge } from "@/components/ui/badge";
import { UserDashboard, UserStatus } from "../types/user.types";
import { useUsers } from "../hooks/useUsers";
import { EditUserDialog } from "./EditUserDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { TableFilterBar } from "@/components/shared/TableFilterBar";

export default function UsersTable() {
  const t = useTranslations("Users");
  const tDashboard = useTranslations("Dashboard");
  const [filters, setFilters] = React.useState({ status: "" });
  const { users, updateUser, deleteUser, isDeleting, pagination, isLoading } = useUsers(filters);

  const [selectedUser, setSelectedUser] = React.useState<UserDashboard | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleEdit = (user: UserDashboard) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: UserDashboard) => {
    setSelectedUser(user);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.user_id);
      setIsConfirmOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const statusColorMap: Record<UserStatus, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inactive: "bg-amber-50 text-amber-700 border-amber-200",
    suspended: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const filterFields = [
    {
      id: "status",
      label: t("status"),
      type: "tabs" as const,
      options: [
        { label: t("statuses.all"), value: "" },
        { label: t("statuses.active"), value: "active" },
        { label: t("statuses.inactive"), value: "inactive" },
        { label: t("statuses.suspended"), value: "suspended" },
      ],
    },
  ];

  const handleFilterChange = (id: string, value: any) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const columns: UniTableColumn<UserDashboard>[] = [
    {
      id: "select",
      header: ({ table }: any) => (
        <SelectionHeader
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={(val: boolean) => table.toggleAllPageRowsSelected(!!val)}
        />
      ),
      cell: (value, row, props: any) => (
        <SelectionCell
          checked={props.row.getIsSelected()}
          onChange={(val: boolean) => props.row.toggleSelected(!!val)}
        />
      ),
      className: "w-[50px]",
    },
    {
      id: "user",
      header: t("user"),
      cell: (value, row) => oneImage(row.photo, row.name),
    },
    {
      id: "email",
      header: t("email"),
      accessorKey: "email",
      className: "text-content-secondary",
    },
    {
      id: "role",
      header: t("role"),
      cell: (value, row) => (
        <Badge variant="outline" className="capitalize bg-gray-50 text-gray-600 border-gray-200 rounded-lg">
          {t(`roles.${row.role}`)}
        </Badge>
      ),
    },
    {
      id: "status",
      header: t("status"),
      cell: (value, row) => (
        <StatusSelectCell
          value={row.status}
          onValueChange={(newStatus: string) => {
            updateUser({ userId: row.user_id, data: { status: newStatus as UserStatus } });
          }}
          options={["active", "inactive", "suspended"]}
          colorMap={statusColorMap}
          t={(key: string) => t(`statuses.${key}`)}
        />
      ),
    },
    {
      id: "joined",
      header: t("joined"),
      cell: (value, row) => (
        <span className="text-content-tertiary">
          {row.created_at ? format(new Date(row.created_at), "dd MMM yyyy") : "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      cell: (value, row) => (
        <ActionCell>
          <EditActionButton 
            onClick={() => handleEdit(row)} 
          />
          <DeleteActionButton 
            onClick={() => handleDeleteClick(row)} 
          />
        </ActionCell>
      ),
      headerClassName: "justify-center",
    },
  ];

  return (
    <div className="space-y-4">
      <TableFilterBar
        fields={filterFields}
        values={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white rounded-[24px] border border-divider overflow-hidden shadow-sm">
        <UniTable
          data={users}
          columns={columns}
          serverPagination={pagination}
          isLoading={isLoading}
          itemLabel={tDashboard("users_management")}
        />
      </div>

      <EditUserDialog
        user={selectedUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={t("delete_confirm")}
        description={`${t("delete_confirm")} ${selectedUser?.name}?`}
        onConfirm={handleConfirmDelete}
        confirmLabel={tDashboard("delete")}
        cancelLabel={tDashboard("cancel")}
        isLoading={isDeleting}
      />
    </div>
  );
}
