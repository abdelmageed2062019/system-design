"use client";

import { Clock, Wifi, Database, RefreshCw } from "lucide-react";

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
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-600 text-xs font-bold text-white">
              Q
            </div>
            <span className="text-sm font-semibold text-slate-900">Quiz engine</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
            <a href="#offline" className="hover:text-slate-900">Offline Resilience</a>
            <a href="#timer" className="hover:text-slate-900">Timer</a>
            <a href="#sync-queue" className="hover:text-slate-900">Sync Queue</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-amber-600">
            <Clock className="size-4" />
            Quiz pattern
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Offline-resilient timed quiz
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            How the quiz workspace handles a timed exam with localStorage persistence,
            network-aware status indicators, and a deferred sync queue for answer
            submission.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Database className="size-5 text-blue-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">localStorage persistence</div>
              <div className="mt-0.5 text-xs text-slate-500">Answers + time survive refresh</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Wifi className="size-5 text-green-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Network-aware UI</div>
              <div className="mt-0.5 text-xs text-slate-500">Online/offline badge with animation</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <RefreshCw className="size-5 text-amber-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Deferred sync queue</div>
              <div className="mt-0.5 text-xs text-slate-500">Flushes on reconnect</div>
            </div>
          </div>
        </header>

        <div className="space-y-20">
          <Section
            id="offline"
            title="localStorage persistence across refresh"
            description="Answers are written to localStorage on every selection via saveAnswer. On mount, the hook initializes state from localStorage using lazy initializers (useState(() => readStoredAnswers(quizId))). This means a page refresh restores all previous answers instantly. The quiz ID scopes the storage key (quiz_ans_<quizId>) so multiple quizzes don't collide."
            code={`// Lazy initializer — runs once on mount
const [answers, setAnswers] =
  useState<Record<string, string>>(
    () => readStoredAnswers(quizId),
  );

const [timeLeft, setTimeLeft] = useState(() =>
  readStoredTime(quizId, initialDurationSeconds),
);

function readStoredAnswers(quizId: string) {
  const saved =
    localStorage.getItem(\`quiz_ans_\${quizId}\`);
  return saved ? JSON.parse(saved) : {};
}

function readStoredTime(quizId: string,
  fallback: number) {
  const saved =
    localStorage.getItem(\`quiz_time_\${quizId}\`);
  return saved ? Number(saved) : fallback;
}

// Every answer write also persists:
const saveAnswer = (questionId: string, option: string) => {
  const updated = { ...answers, [questionId]: option };
  setAnswers(updated);
  localStorage.setItem(
    \`quiz_ans_\${quizId}\`,
    JSON.stringify(updated),
  );
  // Also queues for server sync...
};`}
            codeFirst={true}
          />

          <Section
            id="timer"
            title="Countdown timer with localStorage sync"
            description="A 1-second interval decrements timeLeft and writes the remaining seconds to localStorage on every tick. If the user refreshes, the timer resumes from the stored value. The timer stops when it reaches 0. The initial duration is passed as a prop (1800 seconds = 30 minutes for the demo)."
            code={`// Protected countdown engine
useEffect(() => {
  if (timeLeft <= 0) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      const nextTime = prev - 1;
      localStorage.setItem(
        \`quiz_time_\${quizId}\`,
        String(nextTime),
      );
      return nextTime;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft, quizId]);

// Format for display
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
};

// Display in the UI
<div className="bg-slate-950 text-white font-mono
  px-3 py-1.5 rounded-xl text-sm font-bold">
  <Clock className="text-amber-400" />
  {formatTime(timeLeft)}
</div>`}
            codeFirst={false}
          />

          <Section
            id="sync-queue"
            title="Deferred sync queue with network detection"
            description="When the user selects an answer, it's added to syncQueueRef — a useRef object. If online, the queue flushes immediately (simulated via console.log). If offline, the queue accumulates. When the 'online' event fires, flushSyncQueue runs. The hook subscribes to window online/offline events and shows a live badge in the UI with an animation for offline state."
            code={`// Queue stored in ref — no re-render overhead
const syncQueueRef = useRef<Record<string, string>>({});

const flushSyncQueue = useCallback(async () => {
  const queue = { ...syncQueueRef.current };
  if (Object.keys(queue).length === 0) return;

  console.log(\`[quiz] \${quizId} synced:\`, queue);
  // In production: POST /api/v1/quiz/answers
  Object.keys(queue).forEach(
    (id) => delete syncQueueRef.current[id],
  );
}, [quizId]);

const saveAnswer = (questionId: string, option: string) => {
  // localStorage write (always)
  const updated = { ...answers, [questionId]: option };
  setAnswers(updated);
  localStorage.setItem(...);

  // Queue for server sync
  syncQueueRef.current[questionId] = option;

  // Flush if online
  if (isOnline) {
    void flushSyncQueue();
  }
};

// Network-aware status badge
{isOnline ? (
  <span className="bg-emerald-50 text-emerald-600 ...">
    <Wifi size={12} /> Online and synced
  </span>
) : (
  <span className="bg-rose-50 text-rose-600 ... animate-pulse">
    <WifiOff size={12} /> Offline with local recovery
  </span>
)}`}
            codeFirst={true}
          />
        </div>

        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          Built with React 19, localStorage, and the navigator.onLine API.
        </footer>
      </div>
    </main>
  );
}
