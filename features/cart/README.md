# Cart Feature

## Purpose

Handles shopping cart state and cart-side user interactions.

## What Was Achieved

- Added a persisted Zustand store for cart state.
- Implemented add, remove, and clear cart flows.
- Built a floating `CartDrawer` for quick cart review.
- Connected product cards directly to the cart store.

## Current Structure

- `components/CartDrawer.tsx`: floating cart UI and checkout entry.
- `store/useLogiMartStore.ts`: persisted client-side cart store.

## Notes

- Cart state survives page refresh through local persistence.
- The feature is ready for server sync, pricing rules, and coupons.
