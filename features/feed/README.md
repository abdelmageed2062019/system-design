# Feed Feature

## Purpose

Infinite-scroll social feed with virtualized posts and optimistic likes.

## What Was Achieved

- Added a dedicated `/feed` route under the `(social)` route group.
- Built `PostCard` with Next.js `Image` optimization for avatars and media.
- Added `useFeedData` that fetches posts from a static `data.json` file.
- Added `useFeedStore` (Zustand) for post deduplication and optimistic like toggling.
- Integrated `react-virtuoso` for performant virtual scrolling of large post lists.
- API mock removed; data is served from `public/data.json`.

## Current Structure

- `components/PostCard.tsx`: post UI with avatar, media, caption, and like button.
- `hooks/useFeedData.ts`: data fetching and pagination logic.
- `store/useFeedStore.ts`: Zustand store for post state and optimistic updates.

## Notes

- Posts are served via a static JSON file — no backend required.
- Likes are toggled optimistically in Zustand (no server round-trip).
- The feed works offline after the initial data fetch.
