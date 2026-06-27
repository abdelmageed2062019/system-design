"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { SortingState, PaginationState } from "@tanstack/react-table";

export function useTableParams(namespace: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageKey = `${namespace}_page`;
  const sortKey = `${namespace}_sort`;
  const orderKey = `${namespace}_order`;

  const pagination = useMemo<PaginationState>(() => {
    const raw = searchParams.get(pageKey);
    return {
      pageIndex: raw ? Math.max(0, Number(raw) - 1) : 0,
      pageSize: 10,
    };
  }, [searchParams, pageKey]);

  const sorting = useMemo<SortingState>(() => {
    const sort = searchParams.get(sortKey);
    const order = searchParams.get(orderKey);
    if (!sort) return [];
    return [{ id: sort, desc: order === "desc" }];
  }, [searchParams, sortKey, orderKey]);

  const setParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const onPaginationChange = useCallback(
    (updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      setParams({ [pageKey]: String(next.pageIndex + 1) });
    },
    [setParams, pageKey, pagination],
  );

  const onSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      if (next.length === 0) {
        setParams({ [sortKey]: undefined, [orderKey]: undefined, [pageKey]: undefined });
      } else {
        setParams({
          [sortKey]: next[0].id,
          [orderKey]: next[0].desc ? "desc" : "asc",
          [pageKey]: undefined,
        });
      }
    },
    [setParams, sortKey, orderKey, pageKey, sorting],
  );

  return {
    pagination,
    sorting,
    onPaginationChange,
    onSortingChange,
  } as const;
}
