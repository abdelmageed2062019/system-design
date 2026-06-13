'use client';

import { create } from 'zustand';
import { LiveVehicle, FleetMetric } from '@/core/types';

interface FleetState {
     vehicles: Record<string, LiveVehicle>;
     selectedVehicleId: string | null;
     initializeFleet: (vehicles: LiveVehicle[]) => void;
     batchUpdateVehicles: (updates: Record<string, Partial<LiveVehicle> & { newMetric?: FleetMetric }>) => void;
     setSelectedVehicle: (id: string | null) => void;
}

const MAX_WINDOW_SIZE = 50; // Sliding window size to prevent unbounded memory growth.

export const useFleetStore = create<FleetState>((set) => ({
     vehicles: {},
     selectedVehicleId: null,

     initializeFleet: (initialData) => {
          const normalized = initialData.reduce((acc, vehicle) => {
               acc[vehicle.id] = vehicle;
               return acc;
          }, {} as Record<string, LiveVehicle>);
          set({ vehicles: normalized });
     },

     setSelectedVehicle: (id) => set({ selectedVehicleId: id }),

     batchUpdateVehicles: (batchUpdates) =>
          set((state) => {
               const updatedVehicles = { ...state.vehicles };
               let hasChanges = false;

               Object.entries(batchUpdates).forEach(([id, update]) => {
                    const currentVehicle = updatedVehicles[id];
                    if (!currentVehicle) return;

                    hasChanges = true;
                    let newHistory = currentVehicle.metricsHistory;

                    if (update.newMetric) {
                         // Append the latest reading and trim older items using FIFO order.
                         newHistory = [...currentVehicle.metricsHistory, update.newMetric].slice(-MAX_WINDOW_SIZE);
                    }

                    updatedVehicles[id] = {
                         ...currentVehicle,
                         ...update,
                         metricsHistory: newHistory,
                    };
               });

               return hasChanges ? { vehicles: updatedVehicles } : {};
          }),
}));
