import type { Metadata } from "next";

import { TrackingBoard } from "@/features/fleet-tracking/tracking-board";

export const metadata: Metadata = {
  title: "Tracking",
  description: "Operations dashboard scaffold for real-time fleet tracking and batched updates.",
};

export default function TrackingPage() {
  return (
    <main className="flex-1 bg-zinc-50 px-6 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <TrackingBoard />
      </div>
    </main>
  );
}
