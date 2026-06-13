export interface FleetMetric {
  timestamp: number;
  speed: number;
  fuelLevel: number;
}

export interface LiveVehicle {
  id: string;
  driverName: string;
  lat: number;
  lng: number;
  status: "active" | "idle" | "offline";
  metricsHistory: FleetMetric[];
}
