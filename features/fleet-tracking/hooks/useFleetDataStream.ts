'use client';

import { useEffect, useRef } from 'react';
import { useFleetStore } from '../store/useFleetStore';
import { FleetMetric, LiveVehicle } from '@/core/types';

export function useFleetDataStream() {
     const batchUpdateVehicles = useFleetStore((state) => state.batchUpdateVehicles);
     const vehicles = useFleetStore((state) => state.vehicles);

     // Buffer incoming events outside React rendering.
     const bufferRef = useRef<Record<string, Partial<LiveVehicle> & { newMetric?: FleetMetric }>>({});

     useEffect(() => {
          // Simulate a high-frequency live data stream.
          const intervalSimulation = setInterval(() => {
               const vehicleIds = Object.keys(vehicles);
               if (vehicleIds.length === 0) return;

               // Randomly pick a vehicle to update every 50ms.
               const randomId = vehicleIds[Math.floor(Math.random() * vehicleIds.length)];
               const currentVehicle = vehicles[randomId];

               bufferRef.current[randomId] = {
                    id: randomId,
                    lat: currentVehicle.lat + (Math.random() - 0.5) * 0.001,
                    lng: currentVehicle.lng + (Math.random() - 0.5) * 0.001,
                    status: Math.random() > 0.1 ? 'active' : 'idle',
                    newMetric: {
                         timestamp: Date.now(),
                         speed: Math.floor(Math.random() * 40) + 60, // Speed between 60 and 100 km/h.
                         fuelLevel: Math.max(10, Math.floor(Math.random() * 100)),
                    }
               };
          }, 50);

          // Flush buffered events every 500ms.
          const flushInterval = setInterval(() => {
               if (Object.keys(bufferRef.current).length === 0) return;

               batchUpdateVehicles(bufferRef.current);
               bufferRef.current = {};
          }, 500);

          // Clean up timers on unmount to avoid leaks.
          return () => {
               clearInterval(intervalSimulation);
               clearInterval(flushInterval);
               console.log('Stream closed and timers cleared successfully.');
          };
     }, [vehicles, batchUpdateVehicles]);
}
