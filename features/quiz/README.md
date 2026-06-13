# Quiz Feature

## Purpose

Supports a timed quiz experience with resilient local progress handling.

## What Was Achieved

- Added a dedicated `/quiz` route.
- Built `QuizWorkspace` for the assessment interface.
- Added `useQuizEngine` for timer management, answer persistence, and sync queue handling.
- Refactored the hook to avoid effect-driven cascading renders.
- Added offline-aware progress behavior and server sync retry behavior.
- Converted the feature to English and aligned it with the global LTR layout.

## Current Structure

- `components/QuizWorkspace.tsx`: quiz UI and navigation.
- `hooks/useQuizEngine.ts`: timer, persistence, and sync logic.

## Notes

- The current quiz uses mock questions.
- The feature is ready for real exam APIs, anti-refresh recovery, and submission workflows.
