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
import { mockUsers } from "../utils/mockUsers";

export default function UsersTable() {
  const t = useTranslations("Users");
  const tDashboard = useTranslations("Dashboard");

  const statusColorMap: Record<UserStatus, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inactive: "bg-amber-50 text-amber-700 border-amber-200",
    suspended: "bg-rose-50 text-rose-700 border-rose-200",
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
          onValueChange={(newStatus: string) => console.log(`Update ${row.id} to ${newStatus}`)}
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
          {row.createdAt ? format(new Date(row.createdAt), "dd MMM yyyy") : "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      cell: (value, row) => (
        <ActionCell>
          <EditActionButton 
            onClick={() => console.log("Edit", row.id)} 
          />
          <DeleteActionButton 
            onClick={() => console.log("Delete", row.id)} 
          />
        </ActionCell>
      ),
      headerClassName: "justify-center",
    },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-divider overflow-hidden shadow-sm">
      <UniTable
        data={mockUsers}
        columns={columns}
        enablePagination
        pageSize={5}
        itemLabel={tDashboard("users_management")}
      />
    </div>
  );
}
