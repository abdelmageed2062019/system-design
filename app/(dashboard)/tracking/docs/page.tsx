"use client";

import { Map, Radio, Cpu, Eye } from "lucide-react";

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
              G
            </div>
            <span className="text-sm font-semibold text-slate-900">GPS tracking engine</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
            <a href="#architecture" className="hover:text-slate-900">Architecture</a>
            <a href="#dom-bypass" className="hover:text-slate-900">DOM Bypass</a>
            <a href="#buffered-stream" className="hover:text-slate-900">Buffered Stream</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
            <Map className="size-4" />
            Real-time tracking pattern
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Live fleet tracking with DOM bypass
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            How the tracking page renders 10 live vehicle markers on a simulated map
            without triggering React re-renders, using direct DOM manipulation and a
            buffered data stream.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Eye className="size-5 text-blue-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">DOM bypass</div>
              <div className="mt-0.5 text-xs text-slate-500">Markers created outside virtual DOM</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Radio className="size-5 text-green-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Buffered stream</div>
              <div className="mt-0.5 text-xs text-slate-500">50ms events flushed every 500ms</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Cpu className="size-5 text-amber-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Zustand sliding window</div>
              <div className="mt-0.5 text-xs text-slate-500">Last 50 metrics per vehicle</div>
            </div>
          </div>
        </header>

        <div className="space-y-20">
          <Section
            id="architecture"
            title="Architecture: React for structure, DOM for pixels"
            description="The page uses a hybrid model. React handles the layout (header, telemetry panel) and Zustand state. But the map markers — which update 2–3 times per second — are created and positioned via plain DOM APIs inside a useEffect. A markersRef keeps references to existing marker divs, so they are created once and only repositioned on subsequent renders. This avoids React's reconciliation cost for 10 rapidly-moving elements."
            code={`// Markers are real DOM nodes managed outside React
const markersRef = useRef<Record<string, HTMLDivElement>>({});

useEffect(() => {
  Object.entries(vehicles).forEach(([id, vehicle]) => {
    let marker = markersRef.current[id];

    // Create once — never again
    if (!marker) {
      marker = document.createElement('div');
      marker.className = 'absolute w-6 h-6 bg-blue-600 ...';
      marker.onclick = () =>
        useFleetStore.getState().setSelectedVehicle(id);
      mapContainer.appendChild(marker);
      markersRef.current[id] = marker;
    }

    // Update position via style — no React involved
    marker.style.left = \`\${x}%\`;
    marker.style.top = \`\${y}%\`;
  });
}, [vehicles, selectedVehicleId]);`}
            codeFirst={true}
          />

          <Section
            id="dom-bypass"
            title="Why bypass React for markers?"
            description="Each vehicle updates its position every 50ms. If React owned those 10 marker components, every position change would trigger a virtual DOM diff, reconciliation, and commit phase. By injecting marker divs directly into the DOM via refs and moving them with style.left/style.top, we eliminate all React overhead for the high-frequency updates. The useEffect dependency array still triggers after each Zustand batch flush, but the DOM mutations are minimal style assignments — no component re-renders, no VDOM diffing."
            code={`// Inside useEffect that watches the Zustand store:
// 1. Find or create the marker DOM node
// 2. Convert lat/lng to percentage coordinates
// 3. Set left/top inline styles

const x = ((vehicle.lng - 31.1) / 0.2) * 100;
const y = (1 - (vehicle.lat - 29.9) / 0.2) * 100;

marker.style.left = \`\${Math.min(Math.max(x, 5), 95)}%\`;
marker.style.top = \`\${Math.min(Math.max(y, 5), 95)}%\`;

// Selected vehicle gets a highlight class
if (id === selectedVehicleId) {
  marker.className =
    'absolute w-8 h-8 bg-amber-500 border-4 ...';
} else {
  marker.className =
    'absolute w-6 h-6 bg-blue-600 border-2 ...';
}

// Only 2 DOM writes per vehicle per flush
// No VDOM, no component re-render, no diff`}
            codeFirst={true}
          />

          <Section
            id="buffered-stream"
            title="Buffered data stream: batch before you burn"
            description="A simulated GPS stream generates random position updates every 50ms. Rather than writing each event to Zustand immediately (which would trigger 20 React renders/second), updates are accumulated in a useRef buffer. A separate interval flushes the buffer to the Zustand store every 500ms — reducing React updates from 20/s to 2/s. The store maintains a sliding window of 50 metrics per vehicle using FIFO eviction."
            code={`// useFleetDataStream.ts
const bufferRef = useRef<Record<string, Partial<LiveVehicle>>>({});

// Simulate high-frequency events (50ms)
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

// Flush to Zustand every 500ms
const flushInterval = setInterval(() => {
  batchUpdateVehicles(bufferRef.current);
  bufferRef.current = {};
}, 500);

// Zustand store: sliding window of 50
// FIFO eviction
newHistory =
  [...currentVehicle.metricsHistory, update.newMetric]
    .slice(-MAX_WINDOW_SIZE);`}
            codeFirst={false}
          />

          <Section
            id="store-pattern"
            title="Zustand store with normalized state"
            description="The fleet store uses a normalized shape (Record<string, LiveVehicle>) keyed by vehicle ID for O(1) lookups. batchUpdateVehicles applies partial updates and appends new metrics with a hard cap of 50 entries. The selectedVehicleId is a separate slice to avoid spreading selection logic across the component tree. The store is non-persisted — there's no localStorage or URL serialization."
            code={`interface FleetState {
  vehicles: Record<string, LiveVehicle>;
  selectedVehicleId: string | null;
  initializeFleet: (vehicles: LiveVehicle[]) => void;
  batchUpdateVehicles: (
    updates: Record<string, Partial<LiveVehicle>>
  ) => void;
  setSelectedVehicle: (id: string | null) => void;
}

// Normalized by vehicle ID:
{
  "shipment-v-1": {
    id: "shipment-v-1",
    driverName: "Support and Logistics Vehicle 1",
    lat: 30.0344,
    lng: 31.2157,
    status: "active",
    metricsHistory: [
      { timestamp: ..., speed: 75, fuelLevel: 80 },
      // ... sliding window, max 50 entries
    ],
  },
  // ... 9 more vehicles
}

// Accessing selected vehicle:
const selectedVehicle =
  selectedVehicleId
    ? vehicles[selectedVehicleId]
    : null;`}
            codeFirst={false}
          />

          <Section
            id="telemetry-panel"
            title="Telemetry panel: reacts to selection, not position"
            description="The sidebar panel only re-renders when selectedVehicleId changes — not on every position update. This is because it reads selectedVehicleId from Zustand, which only updates when the user clicks a different marker. The markers' lat/lng updates flow through a separate useEffect that does not touch the panel's state, keeping the UI responsive regardless of stream frequency."
            code={`// Only re-renders on selection change
const selectedVehicleId = useFleetStore(
  (state) => state.selectedVehicleId
);

// Telemetry panel reads the selected vehicle directly
const selectedVehicle = selectedVehicleId
  ? vehicles[selectedVehicleId]
  : null;

return (
  <div className="bg-white p-5 rounded-3xl ...">
    {selectedVehicle ? (
      <div className="space-y-4">
        <div>
          <span>Tracked Vehicle</span>
          <span>{selectedVehicle.driverName}</span>
        </div>
        <div>
          <span>LAT:</span>
          <span>{selectedVehicle.lat.toFixed(6)}</span>
        </div>
        <div>
          <span>LNG:</span>
          <span>{selectedVehicle.lng.toFixed(6)}</span>
        </div>
      </div>
    ) : (
      <p>No shipment selected.</p>
    )}
  </div>
);`}
            codeFirst={true}
          />
        </div>

        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          Built with React 19, Zustand 5, and direct DOM APIs. No map library dependency.
        </footer>
      </div>
    </main>
  );
}
