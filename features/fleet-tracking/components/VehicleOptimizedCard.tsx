'use client';

import { memo } from 'react';
import { useFleetStore } from '../store/useFleetStore';
import { Truck, ShieldAlert } from 'lucide-react';

interface CardProps {
     vehicleId: string;
}

export const VehicleOptimizedCard = memo(function VehicleOptimizedCard({ vehicleId }: CardProps) {
     const vehicle = useFleetStore((state) => state.vehicles[vehicleId]);
     const setSelected = useFleetStore((state) => state.setSelectedVehicle);
     const isSelected = useFleetStore((state) => state.selectedVehicleId === vehicleId);

     if (!vehicle) return null;

     const latestMetric = vehicle.metricsHistory[vehicle.metricsHistory.length - 1];

     return (
          <div
               onClick={() => setSelected(vehicle.id)}
               className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-32 bg-white ${isSelected ? 'border-blue-600 ring-2 ring-blue-500/10 shadow-md' : 'border-slate-100 hover:border-slate-200 shadow-sm'
                    }`}
          >
               <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                         <div className={`p-2.5 rounded-xl ${vehicle.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              <Truck size={18} />
                         </div>
                         <div>
                              <h4 className="font-bold text-sm text-slate-800">{vehicle.driverName}</h4>
                              <span className="text-[10px] font-mono text-slate-400">ID: {vehicle.id}</span>
                         </div>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${vehicle.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
               </div>

               <div className="flex justify-between items-center text-xs font-mono text-slate-500 border-t border-slate-50 pt-2">
                    <div>
                         <span className="text-slate-400 block text-[10px]">Speed</span>
                         <span className="font-bold text-slate-800 text-sm">{latestMetric ? `${latestMetric.speed} km/h` : '--'}</span>
                    </div>
                    <div className="text-left">
                         <span className="text-slate-400 block text-[10px]">Fuel Level</span>
                         <span className={`font-bold text-sm ${latestMetric && latestMetric.fuelLevel < 20 ? 'text-rose-500 flex items-center gap-1' : 'text-slate-800'}`}>
                              {latestMetric ? `${latestMetric.fuelLevel}%` : '--'}
                              {latestMetric && latestMetric.fuelLevel < 20 && <ShieldAlert size={12} />}
                         </span>
                    </div>
               </div>
          </div>
     );
});
