"use client";

import React, { useMemo, Suspense } from "react";
import Link from "next/link";
import { DataTable } from "@/features/data-table/DataTable";
import { useTableParams } from "@/features/data-table/hooks/useTableParams";
import {
  ImageCell,
  CurrencyCell,
  NumberCell,
  DateCell,
  StatusCell,
  BooleanCell,
  TagCell,
} from "@/features/data-table/cells";
import type { DataColumn } from "@/core/types";

interface Product {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  stock: number;
  category: string;
  tags: string[];
  status: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
  department: string;
  active: boolean;
  lastActive: string;
  status: string;
}

const allProducts: Product[] = [
  { id: "1", title: "Wireless Headphones", thumbnail: "https://picsum.photos/seed/headphones/100", price: 149.99, stock: 234, category: "Electronics", tags: ["audio", "bluetooth"], status: "active" },
  { id: "2", title: "Ergonomic Keyboard", thumbnail: "https://picsum.photos/seed/keyboard/100", price: 89.5, stock: 87, category: "Electronics", tags: ["mechanical", "wired"], status: "active" },
  { id: "3", title: "Slim Fit Blazer", thumbnail: "https://picsum.photos/seed/blazer/100", price: 199.99, stock: 12, category: "Clothing", tags: ["formal", "wool"], status: "active" },
  { id: "4", title: "Canvas Backpack", thumbnail: "https://picsum.photos/seed/backpack/100", price: 59.99, stock: 0, category: "Accessories", tags: ["travel", "unisex"], status: "archived" },
  { id: "5", title: "Stainless Steel Bottle", thumbnail: "https://picsum.photos/seed/bottle/100", price: 34.99, stock: 412, category: "Home", tags: ["insulated", "eco-friendly"], status: "active" },
  { id: "6", title: "Leather Notebook Cover", thumbnail: "https://picsum.photos/seed/notebook/100", price: 44.95, stock: 6, category: "Stationery", tags: ["leather", "a5"], status: "pending" },
  { id: "7", title: "USB-C Hub", thumbnail: "https://picsum.photos/seed/usbhub/100", price: 39.99, stock: 153, category: "Electronics", tags: ["usb", "adapter"], status: "active" },
  { id: "8", title: "Wool Beanie", thumbnail: "https://picsum.photos/seed/beanie/100", price: 24.99, stock: 88, category: "Clothing", tags: ["winter", "knit"], status: "active" },
  { id: "9", title: "Desk Lamp", thumbnail: "https://picsum.photos/seed/lamp/100", price: 79.99, stock: 41, category: "Home", tags: ["led", "adjustable"], status: "active" },
  { id: "10", title: "Yoga Mat", thumbnail: "https://picsum.photos/seed/yogamat/100", price: 29.99, stock: 200, category: "Sports", tags: ["fitness", "eco-friendly"], status: "active" },
  { id: "11", title: "Ceramic Mug Set", thumbnail: "https://picsum.photos/seed/mug/100", price: 32.0, stock: 0, category: "Home", tags: ["ceramic", "set"], status: "archived" },
  { id: "12", title: "Running Shoes", thumbnail: "https://picsum.photos/seed/shoes/100", price: 129.95, stock: 66, category: "Sports", tags: ["running", "mesh"], status: "active" },
  { id: "13", title: "Polarized Sunglasses", thumbnail: "https://picsum.photos/seed/sunglasses/100", price: 69.99, stock: 23, category: "Accessories", tags: ["uv-protection", "polarized"], status: "pending" },
  { id: "14", title: "Hardcover Journal", thumbnail: "https://picsum.photos/seed/journal/100", price: 18.5, stock: 310, category: "Stationery", tags: ["lined", "hardcover"], status: "active" },
  { id: "15", title: "Bluetooth Speaker", thumbnail: "https://picsum.photos/seed/speaker/100", price: 59.99, stock: 94, category: "Electronics", tags: ["audio", "portable"], status: "active" },
];

const allTeam: TeamMember[] = [
  { id: "1", name: "Alice Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", email: "alice@example.com", role: "Design Lead", department: "Product", active: true, lastActive: "2026-06-26T09:15:00Z", status: "active" },
  { id: "2", name: "Bob Martinez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", email: "bob@example.com", role: "Frontend Engineer", department: "Engineering", active: true, lastActive: "2026-06-26T10:30:00Z", status: "active" },
  { id: "3", name: "Carol Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol", email: "carol@example.com", role: "Backend Engineer", department: "Engineering", active: false, lastActive: "2026-06-24T16:45:00Z", status: "inactive" },
  { id: "4", name: "David Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", email: "david@example.com", role: "Product Manager", department: "Product", active: true, lastActive: "2026-06-26T08:00:00Z", status: "active" },
  { id: "5", name: "Eva Johansson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eva", email: "eva@example.com", role: "Data Analyst", department: "Data", active: true, lastActive: "2026-06-25T14:20:00Z", status: "pending" },
  { id: "6", name: "Frank Okafor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank", email: "frank@example.com", role: "DevOps Engineer", department: "Engineering", active: false, lastActive: "2026-06-20T11:00:00Z", status: "archived" },
  { id: "7", name: "Grace Liu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace", email: "grace@example.com", role: "UX Researcher", department: "Product", active: true, lastActive: "2026-06-26T07:45:00Z", status: "active" },
  { id: "8", name: "Hassan Ali", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan", email: "hassan@example.com", role: "QA Engineer", department: "Engineering", active: true, lastActive: "2026-06-25T16:30:00Z", status: "active" },
  { id: "9", name: "Iris van Dijk", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Iris", email: "iris@example.com", role: "Marketing Lead", department: "Marketing", active: true, lastActive: "2026-06-26T11:00:00Z", status: "active" },
  { id: "10", name: "Jake Thompson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jake", email: "jake@example.com", role: "iOS Engineer", department: "Engineering", active: false, lastActive: "2026-06-22T13:15:00Z", status: "inactive" },
  { id: "11", name: "Kira Chenko", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kira", email: "kira@example.com", role: "Content Strategist", department: "Marketing", active: true, lastActive: "2026-06-25T09:30:00Z", status: "active" },
  { id: "12", name: "Liam O'Brien", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam", email: "liam@example.com", role: "Sales Manager", department: "Sales", active: true, lastActive: "2026-06-26T10:15:00Z", status: "active" },
  { id: "13", name: "Mia Santos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia", email: "mia@example.com", role: "HR Coordinator", department: "People", active: true, lastActive: "2026-06-24T15:00:00Z", status: "pending" },
  { id: "14", name: "Noah Williams", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah", email: "noah@example.com", role: "Fullstack Engineer", department: "Engineering", active: true, lastActive: "2026-06-26T08:45:00Z", status: "active" },
  { id: "15", name: "Olivia Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia", email: "olivia@example.com", role: "VP of Design", department: "Product", active: false, lastActive: "2026-06-18T12:00:00Z", status: "archived" },
];

function fetchPage<T extends { id: string }>(
  allData: T[],
  pageIndex: number,
  pageSize: number,
  sorting: { id: string; desc: boolean }[],
): { data: T[]; pageCount: number; total: number } {
  const sorted = [...allData];

  if (sorting.length > 0) {
    const { id, desc } = sorting[0];
    sorted.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[id];
      const bVal = (b as Record<string, unknown>)[id];
      if (aVal == null) return desc ? -1 : 1;
      if (bVal == null) return desc ? 1 : -1;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }
      return desc ? Number(bVal) - Number(aVal) : Number(aVal) - Number(bVal);
    });
  }

  const total = sorted.length;
  const pageCount = Math.ceil(total / pageSize);
  const start = pageIndex * pageSize;
  const data = sorted.slice(start, start + pageSize);

  return { data, pageCount, total };
}

const productColumns: DataColumn<Product>[] = [
  { id: "thumbnail", header: "", accessorKey: "thumbnail", width: 64, cell: ({ value }) => <ImageCell value={value as string} alt="product" />, enableSorting: false },
  { id: "title", header: "Product", accessorKey: "title", width: "1fr" },
  { id: "price", header: "Price", accessorKey: "price", width: 120, cell: ({ value }) => <CurrencyCell value={value as number} /> },
  { id: "stock", header: "Stock", accessorKey: "stock", width: 100, cell: ({ value }) => <NumberCell value={value as number} /> },
  { id: "category", header: "Category", accessorKey: "category", width: 130 },
  { id: "tags", header: "Tags", accessorKey: "tags", width: 200, cell: ({ value }) => <TagCell values={value as string[]} /> },
  { id: "status", header: "Status", accessorKey: "status", width: 110, cell: ({ value }) => <StatusCell value={value as string} /> },
];

const teamColumns: DataColumn<TeamMember>[] = [
  { id: "avatar", header: "", accessorKey: "avatar", width: 56, cell: ({ row }) => <ImageCell value={row.avatar} alt={row.name} />, enableSorting: false },
  { id: "name", header: "Name", accessorKey: "name", width: "1fr" },
  { id: "email", header: "Email", accessorKey: "email", width: "1fr" },
  { id: "role", header: "Role", accessorKey: "role", width: 160 },
  { id: "department", header: "Department", accessorKey: "department", width: 130 },
  { id: "active", header: "Active", accessorKey: "active", width: 90, cell: ({ value }) => <BooleanCell value={value as boolean} /> },
  { id: "lastActive", header: "Last Active", accessorKey: "lastActive", width: 140, cell: ({ value }) => <DateCell value={value as string} /> },
  { id: "status", header: "Status", accessorKey: "status", width: 110, cell: ({ value }) => <StatusCell value={value as string} /> },
];

function ProductsTable() {
  const { pagination, sorting, onPaginationChange, onSortingChange } = useTableParams("products");

  const { data, pageCount, total } = useMemo(
    () => fetchPage(allProducts, pagination.pageIndex, pagination.pageSize, sorting),
    [pagination.pageIndex, pagination.pageSize, sorting],
  );

  return (
    <section>
      <h1 className="mb-1 text-2xl font-semibold text-zinc-900 dark:text-slate-800">
        Products Catalog
      </h1>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Product inventory with image, pricing, stock levels, and status. Sort by clicking column headers.
        </p>
        <Link
          href="/data-table/docs"
          className="text-xs font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
        >
          Docs
        </Link>
      </div>
      <DataTable<Product>
        data={data}
        columns={productColumns}
        sorting={sorting}
        pagination={pagination}
        onSortingChange={onSortingChange}
        onPaginationChange={onPaginationChange}
        pageCount={pageCount}
        total={total}
        height="max-h-[460px]"
      />
    </section>
  );
}

function TeamTable() {
  const { pagination, sorting, onPaginationChange, onSortingChange } = useTableParams("team");

  const { data, pageCount, total } = useMemo(
    () => fetchPage(allTeam, pagination.pageIndex, pagination.pageSize, sorting),
    [pagination.pageIndex, pagination.pageSize, sorting],
  );

  return (
    <section>
      <h1 className="mb-1 text-2xl font-semibold text-zinc-900 dark:text-slate-800">
        Team Members
      </h1>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Employee directory with avatars, roles, activity status, and last active date.
        </p>
        <Link
          href="/data-table/docs"
          className="text-xs font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
        >
          Docs
        </Link>
      </div>
      <DataTable<TeamMember>
        data={data}
        columns={teamColumns}
        sorting={sorting}
        pagination={pagination}
        onSortingChange={onSortingChange}
        onPaginationChange={onPaginationChange}
        pageCount={pageCount}
        total={total}
        height="max-h-[460px]"
      />
    </section>
  );
}

function DataTablePageInner() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      <ProductsTable />
      <TeamTable />
    </div>
  );
}

export default function DataTablePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading&hellip;</div>}>
      <DataTablePageInner />
    </Suspense>
  );
}
