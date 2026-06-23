# System Design Scaffold

Next.js app with storefront, checkout, fleet tracking, social feed, quiz, and video player — organized by route groups and feature modules.

## Routes

| Path | Feature |
|---|---|
| `/` | Landing page with links to all routes |
| `/products` | SEO-friendly product catalog |
| `/checkout` | Multi-step checkout with validation |
| `/tracking` | Live fleet tracking dashboard |
| `/fleet` | Fleet utilization and vehicle cards |
| `/feed` | Social feed with virtualized posts and optimistic likes |
| `/video-player` | Protected video streaming with watermarking |
| `/quiz` | Timed assessment with offline answer sync |

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

- Route groups separate public (`(store)`) and internal (`(dashboard)`, `(social)`) routes.
- Each feature lives in `features/<name>/` with its own components, hooks, store, and README.
- Shared types live in `core/types/`; no API routes — data is served from `public/data.json`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Project conventions](./AGENTS.md)
