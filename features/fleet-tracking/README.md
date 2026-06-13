# Fleet Tracking Feature

## Purpose

Supports live fleet visibility, telemetry, and route-tracking dashboards.

## What Was Achieved

- Added reusable vehicle cards and a selected-vehicle diagnostics panel.
- Built a batched fleet data stream hook for simulated live updates.
- Added a Zustand store for fleet state and selected vehicle tracking.
- Implemented a Chart.js metrics chart for speed and fuel trends.
- Restored the tracking board route with a lightweight operational dashboard.
- Converted the feature to English and removed render-time purity issues.

## Current Structure

- `components/VehicleOptimizedCard.tsx`: compact vehicle summary card.
- `components/VehicleMetricsChart.tsx`: speed and fuel trend visualization.
- `hooks/useFleetDataStream.ts`: simulated batched live updates.
- `store/useFleetStore.ts`: fleet state container.
- `tracking-board.tsx`: route-level tracking dashboard content.

## Notes

- Current vehicle movement is simulated in the client.
- The feature is ready for real maps, SSE/WebSocket feeds, and backend telemetry.
