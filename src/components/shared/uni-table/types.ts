import * as React from "react";
import { HeaderContext, CellContext } from "@tanstack/react-table";

// Types for flexible cell rendering
export type CellRenderer<TData> = (value: unknown, row: TData, props: CellContext<TData, unknown>) => React.ReactNode

export interface UniTableColumn<TData> {
  id: string
  header: string | React.ReactNode | ((props: HeaderContext<TData, unknown>) => React.ReactNode)
  accessorKey?: keyof TData | string
  cell?: CellRenderer<TData>
  enableSorting?: boolean
  className?: string
  headerClassName?: string
}

export interface UniTableProps<TData> {
  data: TData[]
  columns: UniTableColumn<TData>[]
  className?: string
  enablePagination?: boolean
  pageSize?: number
  emptyMessage?: string
  itemLabel?: string 
  showSelection?: boolean
  onSelectionChange?: (selectedRows: TData[]) => void
  getRowId?: (row: TData) => string
  isLoading?: boolean
  serverPagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    onPageChange: (page: number) => void
  }
}
