"use client";

import { Activity, LayoutGrid, Heart, BarChart3 } from "lucide-react";

const codeStyles = "overflow-x-auto rounded-xl border border-slate-200 bg-[#0f172a] p-5 text-sm leading-relaxed text-slate-50";

function CodeBlock({ children }: { children: string }) {
  return (
    <div className={codeStyles}>
      <pre className="font-mono">{children}</pre>
    </div>
  );
}

function Section({
  id,
  title,
  description,
  code,
  codeFirst,
}: {
  id: string;
  title: string;
  description: string;
  code: string;
  codeFirst?: boolean;
}) {
  const content = (
    <>
      {codeFirst ? (
        <>
          <CodeBlock>{code}</CodeBlock>
          <div className="flex flex-col justify-start">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-start">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
          <CodeBlock>{code}</CodeBlock>
        </>
      )}
    </>
  );

  return (
    <section id={id} className="scroll-mt-20">
      <div className="grid gap-8 lg:grid-cols-2">{content}</div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              F
            </div>
            <span className="text-sm font-semibold text-slate-900">Fleet monitor</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
            <a href="#shared-store" className="hover:text-slate-900">Shared Store</a>
            <a href="#memo-cards" className="hover:text-slate-900">Memo Cards</a>
            <a href="#chart" className="hover:text-slate-900">Chart</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
            <Activity className="size-4" />
            Fleet monitoring pattern
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Real-time fleet monitoring dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            How the fleet page monitors 50 vehicles with live speed/fuel updates, memoized
            vehicle cards, and a Chart.js diagnostics panel — sharing the same Zustand store
            and data stream as the tracking page.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <LayoutGrid className="size-5 text-blue-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">50 vehicle cards</div>
              <div className="mt-0.5 text-xs text-slate-500">Grid with memoized rendering</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Heart className="size-5 text-rose-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Shared Zustand store</div>
              <div className="mt-0.5 text-xs text-slate-500">Same store as /tracking page</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <BarChart3 className="size-5 text-green-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Chart.js diagnostics</div>
              <div className="mt-0.5 text-xs text-slate-500">Speed + fuel trend line chart</div>
            </div>
          </div>
        </header>

        <div className="space-y-20">
          <Section
            id="shared-store"
            title="Shared Zustand store across routes"
            description="Both /fleet and /tracking use the same useFleetStore and useFleetDataStream. The store is non-persisted Zustand with a normalized Record<string, LiveVehicle>. Each vehicle holds a metricsHistory array capped at 50 entries (FIFO). The selectedVehicleId is shared too — selecting a vehicle on one page carries over to the other."
            code={`// Shared by /fleet and /tracking
import { useFleetStore }
  from '@/features/fleet-tracking/store/useFleetStore';
import { useFleetDataStream }
  from '@/features/fleet-tracking/hooks/useFleetDataStream';

export default function FleetPage() {
  const initializeFleet = useFleetStore((s) => s.initializeFleet);
  const vehicles = useFleetStore((s) => s.vehicles);
  const selectedVehicleId =
    useFleetStore((s) => s.selectedVehicleId);

  // 50 vehicles with initial position in Cairo
  const mockInitialFleet = useMemo(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id: \`fleet-v-\${i + 1}\`,
      driverName: \`Driver \${i + 1}\`,
      lat: 30.0444,
      lng: 31.2357,
      status: 'active' as const,
      metricsHistory: [
        { timestamp: 0, speed: 0, fuelLevel: 100 }
      ],
    })),
  []);

  useEffect(() => {
    initializeFleet(mockInitialFleet);
  }, [mockInitialFleet, initializeFleet]);

  // Start the 50ms/500ms buffered stream
  useFleetDataStream();

  // Store shape (normalized by vehicle ID):
  {
    "fleet-v-1": {
      id: "fleet-v-1",
      driverName: "Driver 1",
      lat: 30.0444, lng: 31.2357,
      status: "active",
      metricsHistory: [
        { timestamp: 0, speed: 0, fuelLevel: 100 },
        { timestamp: 1748467200000, speed: 72, fuelLevel: 88 },
        // ... sliding window, max 50
      ],
    },
    // ... 49 more vehicles
  }
}`}
            codeFirst={true}
          />

          <Section
            id="memo-cards"
            title="Memoized vehicle cards"
            description="Each vehicle card is a React.memo component that only re-renders when its specific vehicle data changes in the store. The card selects its slice with useFleetStore((state) => state.vehicles[vehicleId]), which returns a stable reference until batchUpdateVehicles modifies that specific entry. This means 49 out of 50 cards stay mounted unchanged during each 500ms flush."
            code={`export const VehicleOptimizedCard = memo(
  function VehicleOptimizedCard({ vehicleId }: { vehicleId: string }) {
    const vehicle = useFleetStore(
      (state) => state.vehicles[vehicleId]
    );
    const setSelected = useFleetStore(
      (state) => state.setSelectedVehicle
    );
    const isSelected = useFleetStore(
      (state) => state.selectedVehicleId === vehicleId
    );

    if (!vehicle) return null;

    const latestMetric =
      vehicle.metricsHistory[vehicle.metricsHistory.length - 1];

    return (
      <div onClick={() => setSelected(vehicle.id)}
        className={isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/10'
          : 'border-slate-100 hover:border-slate-200'}
      >
        <div className="flex items-center gap-3">
          <Truck className={vehicle.status === 'active'
            ? 'text-emerald-600' : 'text-amber-600'} />
          <h4>{vehicle.driverName}</h4>
        </div>
        <div className="flex justify-between">
          <div>
            <span>Speed</span>
            <span>{latestMetric.speed} km/h</span>
          </div>
          <div>
            <span>Fuel</span>
            <span className={latestMetric.fuelLevel < 20
              ? 'text-rose-500' : ''}>
              {latestMetric.fuelLevel}%
            </span>
          </div>
        </div>
      </div>
    );
  }
);

// Only this card re-renders when its data updates
// Other 49 cards stay mounted — no re-render`}
            codeFirst={false}
          />

          <Section
            id="chart"
            title="Chart.js diagnostics panel"
            description="When a vehicle is selected, the diagnostics panel shows a line chart with speed (blue) and fuel level (green) trends. The chart uses Chart.js via react-chartjs-2 with custom options: no point markers for cleaner lines, hover-only tooltips, and tension for smooth curves. The chart re-renders reactively when selectedVehicleId changes or new metrics arrive for that vehicle."
            code={`import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Tooltip, Legend, Filler,
);

export function VehicleMetricsChart({
  metrics
}: { metrics: FleetMetric[] }) {
  const chartData = {
    labels: metrics.map((_, i) => \`P\${i + 1}\`),
    datasets: [
      {
        label: 'Speed',
        data: metrics.map((m) => m.speed),
        borderColor: '#2563eb',     // blue
        borderWidth: 3,
        tension: 0.35,
        pointRadius: 0,
      },
      {
        label: 'Fuel',
        data: metrics.map((m) => m.fuelLevel),
        borderColor: '#22c55e',     // green
        borderWidth: 2,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="h-52 rounded-2xl border
      border-slate-100 bg-slate-50 p-3">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

// Tooltip shows: "Reading 23 • Speed: 82 km/h"`}
            codeFirst={true}
          />

          <Section
            id="buffered-stream"
            title="Buffered data stream (shared with /tracking)"
            description="The same useFleetDataStream hook from the tracking feature powers the fleet page. Events are generated every 50ms, buffered in a ref, and flushed to Zustand every 500ms. The store caps metricsHistory at 50 entries using FIFO slice. This decouples the high-frequency simulation from React rendering — only 2 batched updates per second hit the store."
            code={`// useFleetDataStream.ts — shared by /fleet and /tracking
const bufferRef = useRef<Record<string, Partial<LiveVehicle>>>({});

// Generate 50ms events
const intervalSimulation = setInterval(() => {
  const randomId = vehicleIds[
    Math.floor(Math.random() * vehicleIds.length)
  ];
  bufferRef.current[randomId] = {
    lat: currentVehicle.lat + (Math.random() - 0.5) * 0.001,
    lng: currentVehicle.lng + (Math.random() - 0.5) * 0.001,
    status: Math.random() > 0.1 ? 'active' : 'idle',
  };
}, 50);

// Flush every 500ms
const flushInterval = setInterval(() => {
  batchUpdateVehicles(bufferRef.current);
  bufferRef.current = {};
}, 500);

// Store: sliding window of 50 metrics
newHistory =
  [...currentVehicle.metricsHistory, update.newMetric]
    .slice(-MAX_WINDOW_SIZE);`}
            codeFirst={false}
          />
        </div>

        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          Built with Zustand 5, Chart.js, react-chartjs-2, and React.memo.
        </footer>
      </div>
    </main>
  );
}
