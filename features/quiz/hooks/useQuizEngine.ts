// features/quiz/hooks/useQuizEngine.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Question {
     id: string;
     text: string;
     options: string[];
}

function readStoredAnswers(quizId: string) {
     if (typeof window === 'undefined') {
          return {};
     }

     const savedAnswers = window.localStorage.getItem(`quiz_ans_${quizId}`);

     if (!savedAnswers) {
          return {};
     }

     try {
          return JSON.parse(savedAnswers) as Record<string, string>;
     } catch {
          return {};
     }
}

function readStoredTime(quizId: string, initialDurationSeconds: number) {
     if (typeof window === 'undefined') {
          return initialDurationSeconds;
     }

     const savedTime = window.localStorage.getItem(`quiz_time_${quizId}`);
     return savedTime ? Number(savedTime) : initialDurationSeconds;
}

export function useQuizEngine(quizId: string, questions: Question[], initialDurationSeconds: number) {
     const [currentIdx, setCurrentIdx] = useState(0);
     const [answers, setAnswers] = useState<Record<string, string>>(() =>
          readStoredAnswers(quizId),
     );
     const [timeLeft, setTimeLeft] = useState(() =>
          readStoredTime(quizId, initialDurationSeconds),
     );
     const [isOnline, setIsOnline] = useState(() =>
          typeof window === 'undefined' ? true : window.navigator.onLine,
     );
     const syncQueueRef = useRef<Record<string, string>>({});

     // Flush queued answers to the backend whenever the network is available.
      const flushSyncQueue = useCallback(async () => {
           const queue = { ...syncQueueRef.current };
           if (Object.keys(queue).length === 0) return;

           console.log(`[quiz] ${quizId} synced answers:`, queue);
           Object.keys(queue).forEach((id) => delete syncQueueRef.current[id]);
      }, [quizId]);

     // Subscribe to network changes only; persisted state is restored through lazy initializers.
     useEffect(() => {
          const handleOnline = () => {
               setIsOnline(true);
               void flushSyncQueue();
          };
          const handleOffline = () => setIsOnline(false);

          window.addEventListener('online', handleOnline);
          window.addEventListener('offline', handleOffline);

          return () => {
               window.removeEventListener('online', handleOnline);
               window.removeEventListener('offline', handleOffline);
          };
     }, [flushSyncQueue]);

     // Protected countdown engine.
     useEffect(() => {
          if (timeLeft <= 0) return;

          const timer = setInterval(() => {
               setTimeLeft((prev) => {
                    const nextTime = prev - 1;
                    localStorage.setItem(`quiz_time_${quizId}`, String(nextTime));
                    return nextTime;
               });
          }, 1000);

          return () => clearInterval(timer);
     }, [timeLeft, quizId]);

     // Optimistically persist the answer locally and queue it for sync.
     const saveAnswer = (questionId: string, option: string) => {
          const updatedAnswers = { ...answers, [questionId]: option };
          setAnswers(updatedAnswers);

          localStorage.setItem(`quiz_ans_${quizId}`, JSON.stringify(updatedAnswers));

          syncQueueRef.current[questionId] = option;

          if (isOnline) {
               void flushSyncQueue();
          }
     };

     return {
          currentQuestion: questions[currentIdx],
          currentIdx,
          setCurrentIdx,
          answers,
          saveAnswer,
          timeLeft,
          isOnline,
          totalQuestions: questions.length,
     };
}
