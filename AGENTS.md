# AGENTS.md

## Quick start

- **Package manager:** `pnpm` (lockfile: `pnpm-lock.yaml`)
- **Dev server:** `pnpm dev` (Next.js 16.2, App Router, React 19, port 3000)
- **Build:** `pnpm build`
- **Lint:** `pnpm lint` (ESLint 9 with `eslint-config-next` core-web-vitals + TypeScript rules)
- **No tests, no CI, no pre-commit hooks**

## Architecture

### Route groups (URL-neutral)

| Group | Routes |
|---|---|
| `app/(store)/` | `/` (checkout), `/products`, `/quiz`, `/video-player` |
| `app/(dashboard)/` | `/fleet`, `/tracking` |
| `app/page.tsx` | Root landing page with links to all 6 routes |

No nested layouts, no `loading.tsx`, no `error.tsx`, no `app/api/` directory, no middleware.

### Feature modules (`features/<name>/`)

Each feature is self-contained: `components/`, `hooks/`, `store/`, `schemas/` as needed. Every feature has a `README.md` with purpose, structure, and notes — read those first.

Cross-feature imports are expected (e.g., `products/ProductCard` imports `cart/store/useLogiMartStore`).

### Core shared code (`core/`)

- `core/types/` — single source of truth for shared domain types (`Product`, `CartItem`, `LiveVehicle`, `FleetMetric`, etc.). Barrel export from `index.ts`.
- `core/api/sse-client.ts` — empty placeholder, not implemented.

### State management

| Pattern | Used in |
|---|---|
| Zustand 5 (persisted) | `features/cart/store/useLogiMartStore` (localStorage key: `logimart-cart-storage`) |
| Zustand 5 (non-persisted) | `features/fleet-tracking/store/useFleetStore` (sliding window of 50 metrics) |
| react-hook-form + Zod 4 | `features/checkout/` |
| Custom React hooks | `features/quiz/`, `features/video-player/` |
| `@tanstack/react-query` | **Installed but NOT used anywhere** |
| `auto-zustand-selectors-hook` | **Installed but NOT used** |

### TypeScript path alias

`@/*` → `./*` (repo root). All imports use this: `@/core/types`, `@/features/cart/store/useLogiMartStore`.

## Non-obvious conventions

- **`'use client'` placement**: Pages that use hooks/state/browser APIs need it; pages that only render server-safe components can be server components and export `metadata`.
- **Direct DOM manipulation**: `app/(dashboard)/tracking/page.tsx` creates/positions DOM elements via refs + `useEffect` to bypass React for high-frequency updates.
- **Buffered state updates**: `useFleetDataStream` simulates 50ms events but flushes to Zustand every 500ms via a `useRef` buffer.
- **Quiz offline queue**: Answers stored in localStorage immediately (`quiz_ans_<quizId>`), queued in a ref, flushed via `fetch()` when online.
- **Cart persistence**: Zustand `persist` middleware stores cart in localStorage.
- **No API routes**: `fetch()` calls in features target hypothetical endpoints (`/api/v1/quiz/...`, `/api/v1/analytics/heartbeat`) — no `app/api/` directory exists.
- **Unused packages**: `@tanstack/react-query`, `mapbox-gl`, and `auto-zustand-selectors-hook` are in `package.json` but not imported anywhere.
- **Video player**: `SecurePlayer.tsx` contains Arabic text (`"بث مشفر محمي عالي الأداء"`) — legacy artifact, the rest of the codebase is English.
- **Formatting**: No formatter config (no Prettier). Lint only.
