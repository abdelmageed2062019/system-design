"use client";

import { useCallback } from "react";
import { Search, Globe, Bell } from "lucide-react";
import { Autocomplete } from "@/features/autocomplete/components/Autocomplete";
import { SearchDropdown } from "@/features/autocomplete/components/SearchDropdown";
import { fetchGoogleSuggestions, fetchRichSuggestions } from "@/features/autocomplete/mock";
import { RichSearchItem } from "@/features/autocomplete/types";

export default function AutocompletePage() {
  const handleGoogleSelect = useCallback((item: string) => {
    alert(`Selected: ${item}`);
  }, []);

  const handleRichSelect = useCallback((item: RichSearchItem) => {
    alert(`Selected: ${item.name} (${item.type})`);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/50 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-[2rem] bg-zinc-950 px-8 py-10 text-white">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-zinc-400">
            <Search className="size-4" />
            Autocomplete patterns
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight">
            Two search patterns
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            Google-style and Facebook-style autocomplete inputs built on the same generic hook. Type at least 2 characters to see suggestions.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Globe className="size-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-slate-900">
                Google-style
              </h2>
            </div>
            <p className="mb-5 text-xs text-slate-500">
              Minimal text-only suggestions with keyboard navigation.
            </p>
            <Autocomplete
              fetchSuggestions={fetchGoogleSuggestions}
              renderItem={(item: string) => (
                <span className="text-sm text-slate-700">{item}</span>
              )}
              onSelect={handleGoogleSelect}
              placeholder="Search Google..."
              minLength={2}
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Bell className="size-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-slate-900">
                Facebook-style
              </h2>
            </div>
            <p className="mb-5 text-xs text-slate-500">
              Rich results grouped by type with avatars, badges, and icons.
            </p>
            <SearchDropdown
              fetchSuggestions={fetchRichSuggestions}
              onSelect={handleRichSelect}
              placeholder="Search Facebook..."
              minLength={2}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
