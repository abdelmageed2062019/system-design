export interface AutocompleteProps<T> {
  fetchSuggestions: (query: string, signal: AbortSignal) => Promise<T[]>;
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
  onSelect: (item: T) => void;
  placeholder?: string;
  debounceDelay?: number;
  minLength?: number;
}

export interface CacheState<T> {
  [query: string]: T[];
}

export interface RichSearchItem {
  id: string;
  name: string;
  subtitle: string;
  type: "user" | "page" | "group";
}