# Video Player Feature

## Purpose

Provides protected video playback with viewer-aware overlays and analytics hooks.

## What Was Achieved

- Added a dedicated `/video-player` route.
- Built a `SecurePlayer` component with a visible watermark layer.
- Added a `useVideoAnalytics` hook for heartbeat and progress reporting.
- Connected the route page to the feature and exposed it from the home page.

## Current Structure

- `components/SecurePlayer.tsx`: secure player shell and watermark overlay.
- `hooks/useVideoAnalytics.ts`: heartbeat/progress tracking hook.

## Notes

- The current implementation uses a demo video source.
- The feature is ready for signed URLs, DRM workflows, and user/session-based watermarks.
