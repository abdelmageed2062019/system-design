import type { ReactNode } from "react";
import type { SortingState, PaginationState } from "@tanstack/react-table";

export interface HeaderRenderProps {
  columnId: string;
}

export interface CellRenderProps<T> {
  row: T;
  column: DataColumn<T>;
  value: unknown;
}

export interface DataColumn<T> {
  id: string;
  header: string | ((props: HeaderRenderProps) => ReactNode);
  accessorKey?: keyof T;
  accessorFn?: (row: T) => unknown;
  cell?: (props: CellRenderProps<T>) => ReactNode;
  width?: number | string;
  type?: "text" | "number" | "date" | "image";
  enableSorting?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataColumn<T>[];
  height?: number | string;
  width?: number | string;
  rowHeight?: number;
  sorting: SortingState;
  pagination: PaginationState;
  onSortingChange: (
    updater: SortingState | ((old: SortingState) => SortingState),
  ) => void;
  onPaginationChange: (
    updater: PaginationState | ((old: PaginationState) => PaginationState),
  ) => void;
  pageCount: number;
  total: number;
}
