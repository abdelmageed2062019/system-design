'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useFleetStore } from '@/features/fleet-tracking/store/useFleetStore';
import { useFleetDataStream } from '@/features/fleet-tracking/hooks/useFleetDataStream';
import { Map, Navigation, Compass } from 'lucide-react';

const INITIAL_TRACKING_TIMESTAMP = 0;

export default function TrackingPage() {
  const initializeFleet = useFleetStore((state) => state.initializeFleet);
  const vehicles = useFleetStore((state) => state.vehicles);
  const selectedVehicleId = useFleetStore((state) => state.selectedVehicleId);

  // Isolated map refs prevent the whole component from re-rendering on marker moves.
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, HTMLDivElement>>({});

  // Generate deterministic initial positions for 10 vehicles in Greater Cairo.
  const mockInitialFleet = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: `shipment-v-${i + 1}`,
      driverName: `Support and Logistics Vehicle ${i + 1}`,
      lat: 30.0244 + (i % 5) * 0.01,
      lng: 31.2057 + Math.floor(i / 5) * 0.02,
      status: 'active' as const,
      metricsHistory: [{ timestamp: INITIAL_TRACKING_TIMESTAMP, speed: 75, fuelLevel: 80 }],
    }));
  }, []);

  // Initialize the store once, then start the batched live stream.
  useEffect(() => {
    initializeFleet(mockInitialFleet);
  }, [mockInitialFleet, initializeFleet]);

  useFleetDataStream();

  // This effect watches the batched state and mutates the DOM directly without React re-renders.
  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;

    Object.entries(vehicles).forEach(([id, vehicle]) => {
      let markerElement = markersRef.current[id];

      if (!markerElement) {
        // Create the DOM marker once if it does not exist yet.
        markerElement = document.createElement('div');
        markerElement.className = 'absolute w-6 h-6 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-500 ease-out z-10';
        markerElement.style.transform = 'translate(-50%, -50%)';
        markerElement.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-4v10a1 1 0 0 0 1 1h2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
        `;

        // Select the vehicle in the store when the marker is clicked.
        markerElement.onclick = () => {
          useFleetStore.getState().setSelectedVehicle(id);
        };

        mapContainer.appendChild(markerElement);
        markersRef.current[id] = markerElement;
      }

      // Convert simulated geo coordinates to relative screen coordinates.
      const x = ((vehicle.lng - 31.1) / 0.2) * 100;
      const y = (1 - (vehicle.lat - 29.9) / 0.2) * 100;

      // Move the marker through native styles outside the virtual DOM.
      markerElement.style.left = `${Math.min(Math.max(x, 5), 95)}%`;
      markerElement.style.top = `${Math.min(Math.max(y, 5), 95)}%`;

      // Highlight the selected marker.
      if (id === selectedVehicleId) {
        markerElement.className = 'absolute w-8 h-8 bg-amber-500 border-4 border-white rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 z-20 scale-125';
      } else {
        markerElement.className = 'absolute w-6 h-6 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-500 ease-out z-10';
      }
    });
  }, [vehicles, selectedVehicleId]);

  const selectedVehicle = selectedVehicleId ? vehicles[selectedVehicleId] : null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col h-screen">
      <header className="mb-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Compass className="text-blue-600 animate-spin-slow" size={22} /> Geographic Tracking and Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Vehicle coordinates update through an isolated canvas layer to avoid React
            re-render bottlenecks
          </p>
        </div>
      </header>

      {/* Responsive main workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0 mb-4">

        {/* Interactive map area */}
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl relative overflow-hidden shadow-inner border border-slate-800 flex items-center justify-center group">
          {/* Grid background that simulates a geographic map surface */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Real DOM container where markers are injected manually */}
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

          <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-2">
            <Map size={12} className="text-blue-400" /> Greater Cairo logistics map
            (active simulation)
          </div>
        </div>

        {/* Live telemetry panel */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-full overflow-y-auto">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
              <Navigation size={16} className="text-blue-600" /> Live Signal Center
            </h3>

            {selectedVehicle ? (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Tracked Vehicle</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedVehicle.driverName}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Live Coordinates:</span>
                  <div className="grid grid-cols-1 gap-2 font-mono text-xs">
                    <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-xl flex justify-between">
                      <span className="text-slate-500">LAT:</span>
                      <span className="font-bold">{selectedVehicle.lat.toFixed(6)}</span>
                    </div>
                    <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-xl flex justify-between">
                      <span className="text-slate-500">LNG:</span>
                      <span className="font-bold">{selectedVehicle.lng.toFixed(6)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-2xl text-xs text-blue-700 font-medium">
                  Click any other blue marker on the map to switch the tracking focus instantly.
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-2">
                <p className="text-xs text-slate-400 font-medium">No shipment is currently selected.</p>
                <p className="text-[11px] text-slate-400">
                  Click any moving vehicle marker on the map to inspect its live latitude and
                  longitude.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-150 text-[10px] text-slate-400 font-medium text-center">
            LogiMart GPS Engine v2.6 • Active
          </div>
        </div>

      </div>
    </div>
  );
}
