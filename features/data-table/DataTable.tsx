"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { DataTableProps } from "@/core/types";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    width?: number | string;
  }
}

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  return (
    <span className="ml-1.5 inline-block text-xs opacity-50">
      {direction === "asc" ? "▲" : direction === "desc" ? "▼" : "⇅"}
    </span>
  );
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  height = "max-h-[500px]",
  sorting,
  pagination,
  onSortingChange,
  onPaginationChange,
  pageCount,
  total,
}: DataTableProps<T>) {
  const columnDefs: ColumnDef<T>[] = React.useMemo(
    () =>
      columns.map((col) => ({
        id: col.id,
        accessorKey: col.accessorKey as string | undefined,
        accessorFn: col.accessorFn,
        header: ({ header }) => {
          const label =
            typeof col.header === "function"
              ? col.header({ columnId: col.id })
              : col.header;
          const canSort =
            col.enableSorting !== false && col.id !== "avatar" && col.id !== "thumbnail";
          if (!canSort) return <>{label}</>;

          const sorted = header.column.getIsSorted();
          return (
            <button
              type="button"
              className="group inline-flex items-center gap-1 whitespace-nowrap"
              onClick={header.column.getToggleSortingHandler()}
            >
              {label}
              <SortIcon direction={sorted} />
            </button>
          );
        },
        cell: ({ row, getValue }) => {
          const value = getValue();
          if (col.cell) {
            return col.cell({ value, row: row.original, column: col });
          }
          return <>{String(value ?? "")}</>;
        },
        meta: { width: col.width },
        enableSorting: col.enableSorting ?? (col.id !== "avatar" && col.id !== "thumbnail"),
      })),
    [columns],
  );

  const table = useReactTable({
    data,
    columns: columnDefs,
    state: { sorting, pagination },
    onSortingChange,
    onPaginationChange,
    manualSorting: true,
    manualPagination: true,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
  });

  const { pageIndex, pageSize } = pagination;
  const fromRow = total === 0 ? 0 : pageIndex * pageSize + 1;
  const toRow = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div
      className={`w-full overflow-auto rounded-lg border border-slate-200 dark:border-slate-800 ${height}`}
    >
      <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-400 table-fixed">
        <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ width: header.column.columnDef.meta?.width }}
                  className="p-4 font-semibold text-slate-900 dark:text-slate-200"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-4 align-middle truncate"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          {fromRow}&ndash;{toRow} of {total}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded px-2 py-1 text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-30"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            &laquo;
          </button>
          <button
            type="button"
            className="rounded px-2 py-1 text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-30"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            &lsaquo;
          </button>

          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`rounded px-2.5 py-1 tabular-nums ${
                i === pageIndex
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </button>
          ))}

          <button
            type="button"
            className="rounded px-2 py-1 text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-30"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            &rsaquo;
          </button>
          <button
            type="button"
            className="rounded px-2 py-1 text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-30"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}
