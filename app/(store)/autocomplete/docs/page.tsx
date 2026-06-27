"use client";

import { Search, Keyboard, Zap, Share2 } from "lucide-react";

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
              A
            </div>
            <span className="text-sm font-semibold text-slate-900">Autocomplete engine</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
            <a href="#shared-hook" className="hover:text-slate-900">Shared Hook</a>
            <a href="#debounce-cancel" className="hover:text-slate-900">Debounce &amp; Cancel</a>
            <a href="#keyboard-nav" className="hover:text-slate-900">Keyboard Nav</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
            <Search className="size-4" />
            Autocomplete pattern
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Generic autocomplete with shared logic
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            How the Google-style and Facebook-style search inputs share a single generic
            hook that handles debounced fetching, AbortController cancellation, in-memory
            caching, and full keyboard navigation.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Share2 className="size-5 text-blue-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Generic hook</div>
              <div className="mt-0.5 text-xs text-slate-500">Shared across both components</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Zap className="size-5 text-green-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Debounce + abort</div>
              <div className="mt-0.5 text-xs text-slate-500">300ms delay, cancels stale requests</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Keyboard className="size-5 text-amber-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Keyboard navigation</div>
              <div className="mt-0.5 text-xs text-slate-500">Arrow keys, Enter, Escape</div>
            </div>
          </div>
        </header>

        <div className="space-y-20">
          <Section
            id="shared-hook"
            title="One hook, two components"
            description="The useAutocomplete hook is generic over the suggestion type T. The Autocomplete component renders text-only strings (T = string). The SearchDropdown renders rich grouped results (T = RichSearchItem). Both call the same hook with the same interface — the only difference is how they render the suggestions array. This avoids duplicating debounce, fetch, cache, and keyboard logic."
            code={`// Hook: generic over T
export function useAutocomplete<T>({
  fetchSuggestions,
  debounceDelay = 300,
  minLength = 2,
  onSelect,
}: {
  fetchSuggestions: (q: string, signal: AbortSignal) => Promise<T[]>;
  debounceDelay?: number;
  minLength?: number;
  onSelect: (item: T) => void;
}) {
  const [query, setQuery] = useState("");
  const [fetchedSuggestions, setFetchedSuggestions] = useState<T[]>([]);
  const cacheRef = useRef<CacheState<T>>({});
  // ... debounce, abort, keyboard navigation
  return { query, setQuery, suggestions, isOpen,
    isLoading, activeIndex, handleKeyDown, ... };
}

// Component A: Google-style (T = string)
<Autocomplete<string>
  fetchSuggestions={fetchGoogleSuggestions}
  renderItem={(item) => <span>{item}</span>}
  onSelect={handleGoogleSelect}
/>

// Component B: Facebook-style (T = RichSearchItem)
<SearchDropdown
  fetchSuggestions={fetchRichSuggestions}
  onSelect={handleRichSelect}
/>`}
            codeFirst={true}
          />

          <Section
            id="debounce-cancel"
            title="Debounced fetch with AbortController"
            description="When the user types, a 300ms debounce timer starts. If the query changes before the timer fires, the previous timer is cleared and the previous AbortController aborts the in-flight request. This prevents stale responses from appearing out of order and avoids unnecessary network calls. Results are cached per query in a useRef object so revisiting a previous query is instant."
            code={`useEffect(() => {
  if (query.length < minLength) return;

  const controller = new AbortController();

  const delayDebounce = setTimeout(async () => {
    setIsLoading(true);
    try {
      const results = await fetchSuggestions(
        query, controller.signal
      );

      // Cache the result for instant replay
      cacheRef.current[query] = results;
      setFetchedSuggestions(results);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Fetch error:", error);
      }
      // AbortError is expected — ignore
    } finally {
      setIsLoading(false);
    }
  }, debounceDelay); // default 300ms

  return () => {
    clearTimeout(delayDebounce);
    controller.abort(); // cancel stale request
  };
}, [query, fetchSuggestions, debounceDelay, minLength]);

// Cache is a plain ref — no re-renders on write
const cacheRef = useRef<CacheState<T>>({});

// On subsequent same-query keystrokes:
// cacheRef.current[query] returns instantly
// but still fires fetch to keep data fresh`}
            codeFirst={false}
          />

          <Section
            id="keyboard-nav"
            title="Full keyboard navigation"
            description="The hook tracks an activeIndex for keyboard selection. ArrowDown and ArrowUp cycle through the list with clamping at the bounds. Enter selects the active item and resets the query. Escape dismisses the dropdown. The parent components wire these into aria-activedescendant for screen reader support and pass role attributes (combobox, listbox, option) for accessibility."
            code={`const handleKeyDown = (event) => {
  if (!isOpen) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      setActiveIndex((prev) =>
        Math.min(prev + 1, suggestions.length - 1));
      break;

    case "ArrowUp":
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      break;

    case "Enter":
      event.preventDefault();
      if (activeIndex >= 0) {
        onSelect(suggestions[activeIndex]);
        setQuery("");
        setIsUserDismissed(true);
      }
      break;

    case "Escape":
      event.preventDefault();
      setIsUserDismissed(true);
      break;
  }
};

// Rendered with ARIA attributes:
<input
  role="combobox"
  aria-expanded={isOpen}
  aria-autocomplete="list"
  aria-controls={listboxId}
  aria-activedescendant={isActive
    ? \`option-\${activeIndex}\` : undefined}
/>

<ul role="listbox" id={listboxId}>
  {suggestions.map((item, index) => (
    <li
      role="option"
      aria-selected={index === activeIndex}
      className={index === activeIndex
        ? "bg-blue-50 text-blue-700"
        : "text-slate-700 hover:bg-slate-50"}
    >
      {renderItem(item, index === activeIndex)}
    </li>
  ))}
</ul>`}
            codeFirst={true}
          />

          <Section
            id="rich-grouping"
            title="Rich results with type-based grouping"
            description="The SearchDropdown component groups suggestions by type (user, page, group) using a useMemo that sorts by a fixed priority order. Each group renders a header with a label and icon, followed by items with colored avatar initials and type badges. The underlying hook is identical to the minimal Autocomplete — only the render layer differs."
            code={`// Grouped by type via useMemo
const grouped = useMemo(() => {
  const map = new Map<string, RichSearchItem[]>();
  for (const item of suggestions) {
    const group = map.get(item.type) ?? [];
    group.push(item);
    map.set(item.type, group);
  }
  return Array.from(map.entries()).sort(([a], [b]) => {
    const order = ["user", "page", "group"];
    return order.indexOf(a) - order.indexOf(b);
  });
}, [suggestions]);

// Rendered as sections with type headers
{grouped.map(([type, items]) => (
  <li key={type} role="presentation">
    <div className="flex items-center gap-2 px-4 py-2
      text-xs font-semibold uppercase text-slate-500">
      <TypeIcon className="size-3" />
      {typeConfig[type].label}
    </div>
    {items.map((item) => (
      <button
        role="option"
        aria-selected={isActive}
        onClick={() => onSelect(item)}
        className="flex w-full items-center gap-3 px-4 py-2.5"
      >
        <div className="flex size-9 items-center
          justify-center rounded-full text-white
          font-bold text-xs bg-blue-500">
          {getInitials(item.name)}
        </div>
        <div>
          <div className="text-sm font-medium">{item.name}</div>
          <div className="text-xs text-slate-500">
            {item.subtitle}
          </div>
        </div>
        <span className="rounded-full px-2 py-0.5
          text-[10px] font-medium bg-blue-100
          text-blue-700">
          {typeConfig[item.type].label.slice(0, -1)}
        </span>
      </button>
    ))}
  </li>
))}`}
            codeFirst={false}
          />
        </div>

        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          Built with React 19, AbortController, and ARIA-first accessibility.
        </footer>
      </div>
    </main>
  );
}
