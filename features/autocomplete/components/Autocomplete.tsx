import React, { useId } from "react";
import { Search } from "lucide-react";
import { AutocompleteProps } from "../types";
import { useAutocomplete } from "../hooks/useAutocomplete";

export function Autocomplete<T>({
  fetchSuggestions,
  renderItem,
  onSelect,
  placeholder = "Search...",
  debounceDelay,
  minLength,
}: AutocompleteProps<T>) {
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
          aria-activedescendant={activeIndex >= 0 ? `option-${activeIndex}` : undefined}
        />
      </div>

      {isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
        </div>
      )}

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {suggestions.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={index}
                id={`option-${index}`}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
                className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {renderItem(item, isActive)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}