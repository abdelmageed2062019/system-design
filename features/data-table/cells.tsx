import React from "react";

export const NumberCell = ({ value }: { value: number }) => (
  <span className="font-mono text-right block w-full tabular-nums text-emerald-600 dark:text-emerald-400">
    {new Intl.NumberFormat().format(value)}
  </span>
);

export const CurrencyCell = ({ value }: { value: number }) => (
  <span className="font-mono text-right block w-full tabular-nums text-sky-600 dark:text-sky-400">
    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)}
  </span>
);

export const ImageCell = ({
  value,
  alt,
}: {
  value: string;
  alt: string;
}) => (
  <div className="flex items-center">
    <img
      src={value}
      alt={alt}
      className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
    />
  </div>
);

export const DateCell = ({ value }: { value: string | Date }) => (
  <span className="text-slate-500 dark:text-slate-400">
    {new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(value))}
  </span>
);

export const StatusCell = ({ value }: { value: string }) => {
  const colors: Record<string, string> = {
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    inactive:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    archived:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const normalized = value.toLowerCase();
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium leading-5 ${
        colors[normalized] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {value}
    </span>
  );
};

export const BooleanCell = ({ value }: { value: boolean }) => (
  <span
    className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
      value
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    }`}
  >
    {value ? "✓" : "✗"}
  </span>
);

export const TagCell = ({ values }: { values: string[] }) => (
  <div className="flex flex-wrap gap-1">
    {values.map((tag) => (
      <span
        key={tag}
        className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
      >
        {tag}
      </span>
    ))}
  </div>
);
