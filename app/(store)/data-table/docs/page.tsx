"use client";

import { Table2, ArrowUpDown, Link, Server } from "lucide-react";

const codeStyles = "overflow-x-auto rounded-xl border border-slate-200 bg-[#0f172a] p-5 text-sm leading-relaxed text-slate-50";

function CodeBlock({ children }: { children: string }) {
  return (
    <div className={codeStyles}>
      <pre className="font-mono">{children}</pre>
    </div>
  );
}

function Section({
  id,
  title,
  description,
  code,
  codeFirst,
}: {
  id: string;
  title: string;
  description: string;
  code: string;
  codeFirst?: boolean;
}) {
  const content = (
    <>
      {codeFirst ? (
        <>
          <CodeBlock>{code}</CodeBlock>
          <div className="flex flex-col justify-start">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-start">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
          <CodeBlock>{code}</CodeBlock>
        </>
      )}
    </>
  );

  return (
    <section id={id} className="scroll-mt-20">
      <div className="grid gap-8 lg:grid-cols-2">{content}</div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              T
            </div>
            <span className="text-sm font-semibold text-slate-900">Server-side data table</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
            <a href="#architecture" className="hover:text-slate-900">Architecture</a>
            <a href="#url-state" className="hover:text-slate-900">URL State</a>
            <a href="#implementation" className="hover:text-slate-900">Implementation</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
            <Table2 className="size-4" />
            Data table pattern
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Server-side sorting &amp; pagination
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            How the data table uses TanStack Table v8 with manual sorting and pagination,
            URL search params as the source of truth, and a simulated server fetch layer.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <ArrowUpDown className="size-5 text-blue-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Manual sorting</div>
              <div className="mt-0.5 text-xs text-slate-500">getSortedRowModel() omitted</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Link className="size-5 text-green-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">URL-driven state</div>
              <div className="mt-0.5 text-xs text-slate-500">Deep-linkable, cache-friendly</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Server className="size-5 text-amber-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Server simulation</div>
              <div className="mt-0.5 text-xs text-slate-500">fetchPage() sorts &amp; slices</div>
            </div>
          </div>
        </header>

        <div className="space-y-20">
          <Section
            id="architecture"
            title="Architecture: tell the engine to stay out"
            description="Instead of passing processing models like getSortedRowModel() or getPaginationRowModel(), we pass the table state explicitly, listen for state changes via onSortingChange / onPaginationChange, and enable manualSorting + manualPagination. This tells TanStack Table: 'The server handles these — you just render.'"
            code={`import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

const table = useReactTable({
  data,               // only current page slice
  columns,
  state: { sorting, pagination },
  onSortingChange,    // updates URL params
  onPaginationChange, // updates URL params
  manualSorting: true,      // no client sort
  manualPagination: true,   // no client pagination
  pageCount,                // from server
  getCoreRowModel: getCoreRowModel(),
  // NOTE: no getSortedRowModel, no getPaginationRowModel
});`}
            codeFirst={true}
          />

          <Section
            id="url-state"
            title="URL search params as the single source of truth"
            description="Pagination and sorting are never stored in local useState. They live in URL search params (e.g., ?products_page=2&products_sort=price&products_order=desc). This gives you deep-linking, working browser history, and a single cache key for data fetching. Each table uses a unique namespace prefix (products_, team_) so params never collide on the same page."
            code={`// features/data-table/hooks/useTableParams.ts
export function useTableParams(namespace: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read state from URL
  const pagination = {
    pageIndex: searchParams.get(\`\${namespace}_page\`)
      ? Number(...) - 1 : 0,
    pageSize: 10,
  };

  const sorting = searchParams.get(\`\${namespace}_sort\`)
    ? [{ id: ..., desc: ... }]
    : [];

  // Write state to URL
  const onPaginationChange = (updater) => {
    const next = updater(pagination);
    setParams({ [\`\${namespace}_page\`]: next.pageIndex + 1 });
  };

  const onSortingChange = (updater) => {
    const next = updater(sorting);
    // Reset page to 0 when sort changes
    setParams({
      [\`\${namespace}_sort\`]: next[0]?.id ?? undefined,
      [\`\${namespace}_order\`]: next[0]?.desc ? 'desc' : undefined,
      [\`\${namespace}_page\`]: undefined,
    });
  };

  return { pagination, sorting,
    onPaginationChange, onSortingChange };
}`}
            codeFirst={false}
          />

          <Section
            id="implementation"
            title="Server fetch simulation with reset rules"
            description="The fetchPage function receives the full dataset, applies the single sort column (string localeCompare or numeric subtraction), slices the requested page, and returns { data, pageCount, total }. When sorting changes, the hook deletes the page param, which resets pageIndex to 0 — preventing the user from landing on page 15 of a now-empty set."
            code={`// Applies sort, slices page — mimics a real API call
function fetchPage<T extends { id: string }>(
  allData: T[],
  pageIndex: number,
  pageSize: number,
  sorting: { id: string; desc: boolean }[],
) {
  const sorted = [...allData];

  if (sorting.length > 0) {
    const { id, desc } = sorting[0];
    sorted.sort((a, b) => {
      const aVal = (a as any)[id];
      const bVal = (b as any)[id];
      if (aVal == null) return desc ? -1 : 1;
      if (bVal == null) return desc ? 1 : -1;
      if (typeof aVal === "string")
        return desc
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      return desc
        ? Number(bVal) - Number(aVal)
        : Number(aVal) - Number(bVal);
    });
  }

  const total = sorted.length;
  const start = pageIndex * pageSize;
  return {
    data: sorted.slice(start, start + pageSize),
    pageCount: Math.ceil(total / pageSize),
    total,
  };
}

// In production, replace with:
// const { data, pageCount } =
//   useQuery({
//     queryKey: ['products', sorting, pagination],
//     queryFn: () => fetchApi('/api/products', {
//       sort, order, page, pageSize
//     }),
//   });`}
            codeFirst={false}
          />

          <Section
            id="column-header-sorting"
            title="Sortable column headers"
            description="Column headers are clickable and cycle through: asc → desc → none. TanStack Table's getToggleSortingHandler() handles the toggle logic. Non-sortable columns (avatars, thumbnails) have enableSorting: false. A sort arrow indicator shows the current direction using unicode characters (▲, ▼, ⇅)."
            code={`// In DataTable.tsx — per-column header render
header: ({ header }) => {
  const label = typeof col.header === 'function'
    ? col.header({ columnId: col.id })
    : col.header;

  if (col.enableSorting === false)
    return <>{label}</>;

  const sorted = header.column.getIsSorted();
  return (
    <button onClick={header.column.getToggleSortingHandler()}>
      {label}
      <SortIcon direction={sorted} />
    </button>
  );
},

// With sort indicator component
function SortIcon({ direction }) {
  return (
    <span className="ml-1.5 text-xs opacity-50">
      {direction === 'asc' ? '▲'
       : direction === 'desc' ? '▼'
       : '⇅'}
    </span>
  );
}

// Column definition
{ id: "title", header: "Product", accessorKey: "title" },
{ id: "price", header: "Price", enableSorting: true },
{ id: "avatar", header: "", enableSorting: false },`}
            codeFirst={true}
          />

          <Section
            id="pagination-controls"
            title="Pagination bar with page numbers"
            description="The pagination bar sits below the table body and shows: 'fromRow–toRow of total' on the left, and page buttons on the right. It includes first ( « ), previous ( ‹ ), numbered page buttons, next ( › ), and last ( » ) controls. The active page is highlighted with inverted colors. All interactions call onPaginationChange which updates the URL."
            code={`{/* Pagination footer row */}
<div className="flex items-center justify-between
  border-t border-slate-200
  bg-slate-50 px-4 py-3 text-sm">

  <span className="text-slate-500">
    {fromRow}–{toRow} of {total}
  </span>

  <div className="flex items-center gap-1">
    <button onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>
      «
    </button>
    <button onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
      ‹
    </button>

    {Array.from({ length: pageCount }, (_, i) => (
      <button key={i}
        className={i === pageIndex
          ? 'bg-slate-900 text-white'
          : 'text-slate-600 hover:bg-slate-200'}
        onClick={() => table.setPageIndex(i)}>
        {i + 1}
      </button>
    ))}

    <button onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
      ›
    </button>
    <button onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}>
      »
    </button>
  </div>
</div>`}
            codeFirst={true}
          />
        </div>

        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          Built with @tanstack/react-table v8, Next.js App Router, and Tailwind CSS.
        </footer>
      </div>
    </main>
  );
}
