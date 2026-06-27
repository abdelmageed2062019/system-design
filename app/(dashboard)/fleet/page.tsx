'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useFleetStore } from '@/features/fleet-tracking/store/useFleetStore';
import { useFleetDataStream } from '@/features/fleet-tracking/hooks/useFleetDataStream';
import { VehicleOptimizedCard } from '@/features/fleet-tracking/components/VehicleOptimizedCard';
import { VehicleMetricsChart } from '@/features/fleet-tracking/components/VehicleMetricsChart';
import { Activity, Gauge } from 'lucide-react';

const INITIAL_FLEET_TIMESTAMP = 0;

export default function FleetPage() {
  const initializeFleet = useFleetStore((state) => state.initializeFleet);
  const vehicles = useFleetStore((state) => state.vehicles);
  const selectedVehicleId = useFleetStore((state) => state.selectedVehicleId);

  // Generate initial data for 50 fleet vehicles.
  const mockInitialFleet = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: `fleet-v-${i + 1}`,
      driverName: `Driver ${i + 1}`,
      lat: 30.0444,
      lng: 31.2357,
      status: 'active' as const,
      metricsHistory: [{ timestamp: INITIAL_FLEET_TIMESTAMP, speed: 0, fuelLevel: 100 }],
    }));
  }, []);

  useEffect(() => {
    initializeFleet(mockInitialFleet);
  }, [mockInitialFleet, initializeFleet]);

  useFleetDataStream();

  const vehicleIds = Object.keys(vehicles);
  const selectedVehicle = selectedVehicleId ? vehicles[selectedVehicleId] : null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <header className="mb-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="text-blue-600 animate-pulse" size={22} /> Real-Time Fleet Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Batched updates every 500ms to keep rendering and memory usage stable</p>
        </div>
        <Link
          href="/fleet/docs"
          className="text-xs font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
        >
          Docs
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto pr-2">
          {vehicleIds.map((id) => (
            <VehicleOptimizedCard key={id} vehicleId={id} />
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-6">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b pb-3">
            <Gauge size={16} className="text-blue-600" /> Selected Vehicle Diagnostics
          </h3>

          {selectedVehicle ? (
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 block">Assigned Driver</span>
                <span className="font-bold text-slate-800 text-base">{selectedVehicle.driverName}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Latitude</span>
                  <span className="font-mono text-xs font-bold text-slate-700">{selectedVehicle.lat.toFixed(5)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Longitude</span>
                  <span className="font-mono text-xs font-bold text-slate-700">{selectedVehicle.lng.toFixed(5)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <span className="text-xs text-slate-400 block mb-2">Live speed and fuel trend</span>
                <VehicleMetricsChart metrics={selectedVehicle.metricsHistory} />
              </div>
            </div>
          ) : (
            <p className="text-center text-xs text-slate-400 py-12">Select a vehicle from the list to inspect live metrics and diagnostics.</p>
          )}
        </div>
      </div>
    </div>
  );
}
