"use client";

import * as React from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { UniTableProps } from "./types";
import { Pagination } from "../Pagination";
import { Skeleton } from "@/components/ui/skeleton";

export function UniTable<TData>({
  data,
  columns,
  className,
  enablePagination = false,
  pageSize = 10,
  emptyMessage = "No data found",
  itemLabel = "items",
  showSelection = false,
  onSelectionChange,
  getRowId,
  isLoading = false,
  serverPagination,
}: UniTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({});
  
  const tableColumns = React.useMemo<ColumnDef<TData>[]>(() => {
    return columns.map((col) => ({
      id: col.id,
      accessorKey: col.accessorKey as string,
      header: (headerProps) => {
        if (typeof col.header === "function") {
          return col.header(headerProps);
        }
        return col.header;
      },
      cell: (cellProps) => {
        const value = cellProps.getValue();
        if (col.cell) {
          return col.cell(value, cellProps.row.original, cellProps);
        }
        return value ?? "-";
      },
      enableSorting: col.enableSorting ?? false,
    }));
  }, [columns]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: getRowId,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const onSelectionChangeRef = React.useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  React.useEffect(() => {
    if (onSelectionChangeRef.current) {
      const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
      onSelectionChangeRef.current(selectedRows);
    }
  }, [rowSelection]);

  if (data.length === 0 && !isLoading) {
    return (
      <div className={cn("text-center py-20 text-muted-foreground bg-white rounded-2xl border border-divider", className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-y border-divider">
                {headerGroup.headers.map((header) => {
                  const column = columns.find((col) => col.id === header.id);
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "h-14 px-4 py-4 align-middle font-medium text-base text-content-secondary first:pl-6 last:pr-6 whitespace-nowrap",
                        column?.headerClassName
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="relative">
            <AnimatePresence mode="popLayout" initial={false}>
              {isLoading ? (
                // Skeleton Rows
                Array.from({ length: pageSize }).map((_, rowIndex) => (
                  <tr key={`skeleton-row-${rowIndex}`} className="border-b border-divider">
                    {columns.map((col, colIndex) => (
                      <td key={`skeleton-cell-${rowIndex}-${colIndex}`} className="p-4 align-middle first:pl-6 last:pr-6">
                        <Skeleton className="h-6 w-full max-w-[100px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                    transition={{ 
                      opacity: { duration: 0.2 },
                      layout: { type: "spring", stiffness: 500, damping: 50, mass: 1 }
                    }}
                    className="bg-white border-b border-divider hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const column = columns.find((col) => col.id === cell.column.id);
                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            "p-4 align-middle first:pl-6 last:pr-6",
                            column?.className
                          )}
                        >
                          <div className="flex items-center whitespace-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {(serverPagination || enablePagination) && (
        <Pagination
          currentPage={serverPagination?.currentPage ?? table.getState().pagination.pageIndex + 1}
          totalPages={serverPagination?.totalPages ?? table.getPageCount()}
          totalItems={serverPagination?.totalItems ?? data.length}
          pageSize={pageSize}
          onPageChange={serverPagination?.onPageChange ?? ((page) => table.setPageIndex(page - 1))}
          itemLabel={itemLabel}
        />
      )}
    </div>
  );
}

export default UniTable;
