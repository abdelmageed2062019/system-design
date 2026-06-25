# Autocomplete Feature

## Purpose

Provides two autocomplete search patterns — Google-style (text-only suggestions) and Facebook-style (rich grouped results with avatars) — built on a shared generic hook.

## What Was Achieved

- Added a dedicated `/autocomplete` route.
- Built `useAutocomplete`, a generic hook with debounced fetching, AbortController-based cancellation, result caching, and keyboard navigation.
- Built `Autocomplete`, a minimal component for text suggestions.
- Built `SearchDropdown`, a rich component with grouped results, avatar initials, and type badges.
- Added mock data for both search patterns (Google-style strings and Facebook-style people/pages/groups).
- Refactored the hook to avoid synchronous `setState` in effects and ref access during render.
- Styled both inputs consistently with rounded-full inputs, search icons, and focus rings.

## Current Structure

- `hooks/useAutocomplete.ts`: generic autocomplete hook.
- `components/Autocomplete.tsx`: Google-style text suggestion component.
- `components/SearchDropdown.tsx`: Facebook-style rich search component.
- `types.ts`: shared types (`CacheState`, `AutocompleteProps`, `RichSearchItem`).
- `mock.ts`: mock datasets and fetch functions for both search patterns.

## Notes

- Both components use the same `useAutocomplete` hook under the hood.
- The hook caches results per query in a ref to avoid redundant fetches.
- AbortController cancels in-flight requests when the query changes.
- The feature is ready for real API backends — just swap the mock fetch functions.
