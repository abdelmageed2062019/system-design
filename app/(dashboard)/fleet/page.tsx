import type { Metadata } from "next";

import { FleetOverview } from "@/features/fleet-tracking/fleet-overview";

export const metadata: Metadata = {
  title: "Fleet",
  description: "Fleet management scaffold for utilization, vehicle status, and daily operations.",
};

export default function FleetPage() {
  return (
    <main className="flex-1 bg-zinc-50 px-6 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <FleetOverview />
      </div>
    </main>
  );
}
