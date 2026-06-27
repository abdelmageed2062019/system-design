"use client";

import { Shield, Radar, Play, Paintbrush } from "lucide-react";

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
              V
            </div>
            <span className="text-sm font-semibold text-slate-900">Secure player</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
            <a href="#watermark" className="hover:text-slate-900">Watermark</a>
            <a href="#heartbeat" className="hover:text-slate-900">Heartbeat</a>
            <a href="#custom-ui" className="hover:text-slate-900">Custom UI</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
            <Play className="size-4" />
            Video player pattern
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Secure video playback with watermarking
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            How the video player renders a protected stream with a viewer-specific
            animated watermark overlay, custom playback controls, and heartbeat
            analytics tracking.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Paintbrush className="size-5 text-blue-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Animated watermark</div>
              <div className="mt-0.5 text-xs text-slate-500">Canvas overlay with viewer email</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Radar className="size-5 text-green-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Heartbeat analytics</div>
              <div className="mt-0.5 text-xs text-slate-500">10-second verified duration pings</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Shield className="size-5 text-amber-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Custom controls</div>
              <div className="mt-0.5 text-xs text-slate-500">Overlay UI with play/pause/volume</div>
            </div>
          </div>
        </header>

        <div className="space-y-20">
          <Section
            id="watermark"
            title="Animated canvas watermark overlay"
            description="A <canvas> element is layered above the <video> with pointer-events: none. A requestAnimationFrame loop renders the student's email as translucent white text that bounces off the edges of the canvas (like a DVD screensaver). The watermark is viewer-specific and persists even if someone tries to screen-record. The animation runs independently of video playback state."
            code={`const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let x = Math.random() * 100;
  let y = Math.random() * 100;
  let dx = 0.5;
  let dy = 0.5;

  const renderWatermark = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillText(
      \`Protected for: \${studentEmail}\`,
      x, y,
    );

    // Bounce off edges
    if (x + 150 > canvas.width || x < 0) dx = -dx;
    if (y + 20 > canvas.height || y < 0) dy = -dy;

    x += dx;
    y += dy;

    animationId = requestAnimationFrame(renderWatermark);
  };

  renderWatermark();
  return () => cancelAnimationFrame(animationId);
}, [studentEmail]);

// Rendered on top of the video
<video className="w-full h-full object-contain" />
<canvas
  ref={canvasRef}
  width={800}
  height={450}
  className="absolute inset-0 w-full h-full
    pointer-events-none z-10"
/>`}
            codeFirst={true}
          />

          <Section
            id="heartbeat"
            title="Heartbeat analytics with verified duration"
            description="The useVideoAnalytics hook tracks playback position via onTimeUpdate. It calculates the delta between consecutive events and only counts deltas of 1–2 seconds (filtering out seeking/jumps). Every 10 seconds of verified watch time, it logs a heartbeat payload with courseId, lessonId, and current playback position — ready to be sent to a real analytics endpoint."
            code={`export function useVideoAnalytics({
  courseId, lessonId,
}: AnalyticsConfig) {
  const lastTrackedTimeRef = useRef<number>(0);
  const totalWatchedSecondsRef = useRef<number>(0);

  const handleVideoProgress = (currentTime: number) => {
    const timeDelta =
      currentTime - lastTrackedTimeRef.current;

    // Only count smooth playback (not seeking)
    if (timeDelta > 0 && timeDelta <= 2) {
      totalWatchedSecondsRef.current += timeDelta;
    }

    lastTrackedTimeRef.current = currentTime;

    // Fire heartbeat every 10 verified seconds
    if (Math.floor(totalWatchedSecondsRef.current) >= 10) {
      totalWatchedSecondsRef.current = 0;
      console.log('[heartbeat]', {
        courseId,
        lessonId,
        playbackPosition: currentTime,
        verifiedDuration: 10,
      });
    }
  };

  return { handleVideoProgress, resetAnalytics };
}

// Hooked into the video element
<video
  onTimeUpdate={(e) =>
    handleVideoProgress(e.currentTarget.currentTime)
  }
/>`}
            codeFirst={false}
          />

          <Section
            id="custom-ui"
            title="Custom playback controls overlay"
            description="The native video controls are disabled (controls={false}). A custom overlay fades in on hover via group-hover:opacity-100. It includes play/pause, volume, and a status badge. The controls sit above the watermark layer (z-20) so they remain interactive. The play state is tracked locally via useState."
            code={`const [isPlaying, setIsPlaying] = useState(false);

const togglePlay = () => {
  if (!videoRef.current) return;
  if (isPlaying) {
    videoRef.current.pause();
  } else {
    videoRef.current.play().catch(() => {});
  }
  setIsPlaying(!isPlaying);
};

// Video clicks also toggle play
<video onClick={togglePlay} controls={false} />

<div className="absolute bottom-0 inset-x-0
  bg-gradient-to-t from-black/90 to-transparent
  p-4 flex items-center justify-between
  opacity-0 group-hover:opacity-100 z-20">

  <div className="flex items-center gap-4">
    <button onClick={togglePlay}
      className="text-white hover:text-blue-400">
      {isPlaying
        ? <Pause size={20} />
        : <Play size={20} fill="currentColor" />}
    </button>
    <button className="text-white hover:text-blue-400">
      <Volume2 size={20} />
    </button>
  </div>

  <div className="flex items-center gap-2
    text-[10px] bg-slate-800/80 backdrop-blur-md
    px-2.5 py-1 rounded-full border border-slate-700">
    <Shield size={12} className="text-emerald-400" />
    Encrypted protected stream
  </div>
</div>`}
            codeFirst={false}
          />
        </div>

        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          Built with React 19, Canvas API, and requestAnimationFrame.
        </footer>
      </div>
    </main>
  );
}
