import type { Metadata } from 'next';

import { QuizWorkspace } from '@/features/quiz/components/QuizWorkspace';

export const metadata: Metadata = {
  title: 'Quiz',
  description: 'Resilient quiz workspace with timer, offline-safe progress, and answer sync.',
};

export default function QuizPage() {
  return <QuizWorkspace />;
}
