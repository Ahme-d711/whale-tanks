"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { 
  UniTable, 
  UniTableColumn, 
  ActionCell, 
  SelectionCell,
  SelectionHeader
} from "@/components/shared/uni-table";
import { Badge } from "@/components/ui/badge";
import { Execution } from "../types/execution.types";
import { useExecutions } from "../hooks/useExecutions";

export default function ExecutionsTable() {
  const t = useTranslations("Executions");
  const tDashboard = useTranslations("Dashboard");
  const { executions, isLoading } = useExecutions();

  const columns: UniTableColumn<Execution>[] = [
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
      id: "execution_id",
      header: t("execution_id"),
      accessorKey: "execution_id",
      className: "font-mono text-xs text-content-tertiary",
    },
    {
      id: "user_id",
      header: t("user_id"),
      accessorKey: "user_id",
      className: "text-content-secondary text-sm",
    },
    {
      id: "model_id",
      header: t("model_id"),
      accessorKey: "model_id",
      cell: (value, row) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-lg">
          {row.model_id}
        </Badge>
      ),
    },
    {
      id: "tokens",
      header: t("tokens"),
      cell: (value, row) => (
        <div className="flex flex-col text-xs">
          {row.input_tokens} / {row.output_tokens} / {row.total_tokens}
        </div>
      ),
    },
    {
      id: "cost",
      header: t("cost"),
      cell: (value, row) => (
        <span className="font-medium text-emerald-600">
          ${Number(row.cost).toFixed(6)}
        </span>
      ),
    },
    {
      id: "type",
      header: t("type"),
      accessorKey: "execution_type",
      cell: (value, row) => (
        <Badge variant="secondary" className="capitalize">
          {row.execution_type}
        </Badge>
      ),
    },
    {
      id: "executed_at",
      header: t("executed_at"),
      cell: (value, row) => (
        <span className="text-content-tertiary text-sm">
          {row.executed_at ? format(new Date(row.executed_at), "dd MMM yyyy HH:mm") : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-divider overflow-hidden shadow-sm">
      <UniTable
        data={executions}
        columns={columns}
        enablePagination
        pageSize={10}
        itemLabel={t("title")}
        isLoading={isLoading}
      />
    </div>
  );
}
