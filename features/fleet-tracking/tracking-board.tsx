'use client';

const liveTrackingRows = [
  {
    vehicleId: 'fleet-v-12',
    route: 'Cairo -> Giza',
    status: 'On route',
    eta: '12 min',
    lat: '30.0419',
    lng: '31.2104',
  },
  {
    vehicleId: 'fleet-v-07',
    route: 'Nasr City -> Maadi',
    status: 'Delayed',
    eta: '19 min',
    lat: '30.0626',
    lng: '31.2497',
  },
  {
    vehicleId: 'fleet-v-21',
    route: 'Alexandria Road Hub',
    status: 'Idle',
    eta: 'Awaiting dispatch',
    lat: '30.0330',
    lng: '31.1802',
  },
];

const statusStyles: Record<string, string> = {
  'On route': 'bg-emerald-50 text-emerald-700',
  Delayed: 'bg-amber-50 text-amber-700',
  Idle: 'bg-slate-100 text-slate-700',
};

export function TrackingBoard() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-zinc-950 p-8 text-white">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-400">
          Live tracking
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Operational visibility for active fleet movement and delivery ETA updates.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300">
          This dashboard is ready for map integration, SSE updates, and batched route events.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Tracked vehicles', value: '50' },
          { label: 'Average ETA', value: '16 min' },
          { label: 'Delayed shipments', value: '4' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <h2 className="text-lg font-semibold text-zinc-950">Route activity</h2>
            <span className="text-xs text-zinc-500">Updated every 500ms</span>
          </div>

          <div className="mt-4 space-y-3">
            {liveTrackingRows.map((row) => (
              <article
                key={row.vehicleId}
                className="grid gap-4 rounded-2xl border border-zinc-200 p-4 md:grid-cols-[1fr_1fr_auto]"
              >
                <div>
                  <p className="text-xs text-zinc-500">{row.vehicleId}</p>
                  <h3 className="mt-1 text-sm font-semibold text-zinc-950">{row.route}</h3>
                  <p className="mt-2 text-xs text-zinc-500">
                    Lat {row.lat}, Lng {row.lng}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">ETA</p>
                  <p className="mt-1 text-sm font-medium text-zinc-900">{row.eta}</p>
                </div>

                <div className="flex items-start justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[row.status]}`}
                  >
                    {row.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">Map placeholder</h2>
          <div className="mt-4 grid min-h-80 place-items-center rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 text-center">
            <div>
              <p className="text-sm font-medium text-zinc-900">Ready for Mapbox integration</p>
              <p className="mt-2 max-w-xs text-xs leading-6 text-zinc-500">
                Connect your real vehicle coordinates here to visualize route density and live
                driver movement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
