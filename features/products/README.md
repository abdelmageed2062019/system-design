# Products Feature

## Purpose

Provides the storefront product browsing experience.

## What Was Achieved

- Added a scalable products route for `/products`.
- Built a reusable `ProductCard` component for catalog items.
- Prepared the catalog for very large datasets with `react-virtuoso`.
- Standardized the feature around the shared `Product` type from `core/types`.

## Current Structure

- `components/ProductCard.tsx`: product tile UI and add-to-cart entry point.

## Notes

- The current product list uses generated mock data.
- This feature is ready for search, filters, real APIs, and richer media.
