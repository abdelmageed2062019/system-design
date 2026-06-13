import type { Metadata } from 'next';

import { SecurePlayer } from '@/features/video-player/components/SecurePlayer';

export const metadata: Metadata = {
  title: 'Video Player',
  description: 'Protected video delivery with watermarking and playback analytics.',
};

export default function VideoPlayerPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-[2rem] bg-zinc-950 px-8 py-10 text-white">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-400">
            Protected streaming
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight">
            Secure video playback with watermarking and heartbeat analytics.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
            This feature module demonstrates a protected lesson player with a moving
            watermark overlay and progress reporting ready for analytics integration.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.85fr]">
          <SecurePlayer
            streamUrl="https://www.w3schools.com/html/mov_bbb.mp4"
            studentEmail="learner@logimart.io"
            courseId="course-system-design"
            lessonId="lesson-secure-video"
          />

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Playback Controls</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Watermark overlay</p>
                <p className="mt-2 leading-6">
                  The player injects a viewer-specific watermark above the video surface.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Heartbeat tracking</p>
                <p className="mt-2 leading-6">
                  Progress events are prepared for periodic analytics verification.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Usage sample</p>
                <p className="mt-2 leading-6">
                  Route path: <span className="font-mono text-slate-900">/video-player</span>
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
