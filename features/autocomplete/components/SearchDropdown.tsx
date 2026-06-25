"use client";

import { useId, useMemo } from "react";
import { Search, Users, Building2, Globe } from "lucide-react";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { RichSearchItem } from "../types";

const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-indigo-500",
];

const typeConfig = {
  user: { label: "People", icon: Users },
  page: { label: "Pages", icon: Building2 },
  group: { label: "Groups", icon: Globe },
};

function getAvatarColor(name: string) {
  return avatarColors[name.length % avatarColors.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SearchDropdown({
  fetchSuggestions,
  onSelect,
  placeholder = "Search Facebook...",
  debounceDelay,
  minLength,
}: {
  fetchSuggestions: (query: string, signal: AbortSignal) => Promise<RichSearchItem[]>;
  onSelect: (item: RichSearchItem) => void;
  placeholder?: string;
  debounceDelay?: number;
  minLength?: number;
}) {
  const {
    query,
    setQuery,
    suggestions,
    isOpen,
    setIsOpen,
    isLoading,
    activeIndex,
    handleKeyDown,
  } = useAutocomplete({ fetchSuggestions, debounceDelay, minLength, onSelect });

  const inputId = useId();
  const listboxId = useId();

  const grouped = useMemo(() => {
    const map = new Map<string, RichSearchItem[]>();
    for (const item of suggestions) {
      const group = map.get(item.type);
      if (group) {
        group.push(item);
      } else {
        map.set(item.type, [item]);
      }
    }
    return Array.from(map.entries()).sort(([a], [b]) => {
      const order = ["user", "page", "group"];
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [suggestions]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length >= (minLength || 2) && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-full bg-slate-100 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-slate-200 focus:ring-2 focus:ring-blue-500/30"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `rich-option-${activeIndex}` : undefined
          }
        />
      </div>

      {isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div className="absolute mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <ul
            id={listboxId}
            role="listbox"
            className="max-h-[360px] overflow-y-auto py-2"
          >
            {grouped.map(([type, items]) => {
              const TypeIcon = typeConfig[type as keyof typeof typeConfig].icon;
              return (
                <li key={type} role="presentation">
                  <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <TypeIcon className="size-3" />
                    {typeConfig[type as keyof typeof typeConfig].label}
                  </div>
                  {items.map((item) => {
                    const globalIndex = suggestions.indexOf(item);
                    const isActive = globalIndex === activeIndex;
                    return (
                      <button
                        key={item.id}
                        id={`rich-option-${globalIndex}`}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => {
                          onSelect(item);
                          setIsOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isActive ? "bg-blue-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(item.name)}`}
                        >
                          {getInitials(item.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-900">
                            {item.name}
                          </div>
                          <div className="truncate text-xs text-slate-500">
                            {item.subtitle}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            item.type === "user"
                              ? "bg-blue-100 text-blue-700"
                              : item.type === "page"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {typeConfig[item.type].label.slice(0, -1)}
                        </span>
                      </button>
                    );
                  })}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
