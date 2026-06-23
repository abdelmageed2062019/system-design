'use client';

import { useRef } from "react";

interface AnalyticsConfig {
  courseId: string;
  lessonId: string;
}

export function useVideoAnalytics({ courseId, lessonId }: AnalyticsConfig) {
  const lastTrackedTimeRef = useRef<number>(0);
  const totalWatchedSecondsRef = useRef<number>(0);

  const handleVideoProgress = (currentTime: number) => {
    const timeDelta = currentTime - lastTrackedTimeRef.current;

    if (timeDelta > 0 && timeDelta <= 2) {
      totalWatchedSecondsRef.current += timeDelta;
    }

    lastTrackedTimeRef.current = currentTime;

    if (Math.floor(totalWatchedSecondsRef.current) >= 10) {
      totalWatchedSecondsRef.current = 0;
      console.log('[heartbeat]', { courseId, lessonId, playbackPosition: currentTime, verifiedDuration: 10 });
    }
  }

  return {
    handleVideoProgress,
    resetAnalytics: () => {
      lastTrackedTimeRef.current = 0;
      totalWatchedSecondsRef.current = 0;
    }
  }
}