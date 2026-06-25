import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { CacheState } from "../types";

export function useAutocomplete<T>({
  fetchSuggestions,
  debounceDelay = 300,
  minLength = 2,
  onSelect,
}: {
  fetchSuggestions: (query: string, signal: AbortSignal) => Promise<T[]>;
  debounceDelay?: number;
  minLength?: number;
  onSelect: (item: T) => void;
}) {
  const [query, setQuery] = useState("");
  const [fetchedSuggestions, setFetchedSuggestions] = useState<T[]>([]);
  const [isUserDismissed, setIsUserDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const cacheRef = useRef<CacheState<T>>({});

  const isValid = query.length >= minLength;
  const suggestions = useMemo(
    () => (isValid ? fetchedSuggestions : []),
    [isValid, fetchedSuggestions],
  );
  const isOpen = isValid && suggestions.length > 0 && !isUserDismissed;

  useEffect(() => {
    if (query.length < minLength) return;

    const controller = new AbortController();

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await fetchSuggestions(query, controller.signal);
        cacheRef.current[query] = results;
        setFetchedSuggestions(results);
        setIsUserDismissed(false);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching suggestions:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }, debounceDelay);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [query, fetchSuggestions, debounceDelay, minLength]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
          break;

        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
          break;

        case "Enter":
          event.preventDefault();
          if (activeIndex >= 0 && activeIndex < suggestions.length) {
            onSelect(suggestions[activeIndex]);
            setIsUserDismissed(true);
            setQuery("");
          }
          break;

        case "Escape":
          event.preventDefault();
          setIsUserDismissed(true);
          break;

        default:
          break;
      }
    },
    [isOpen, activeIndex, suggestions, onSelect],
  );

  const setIsOpen = useCallback(
    (open: boolean) => setIsUserDismissed(!open),
    [],
  );

  return {
    query,
    setQuery,
    suggestions,
    isOpen,
    setIsOpen,
    isLoading,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  };
}