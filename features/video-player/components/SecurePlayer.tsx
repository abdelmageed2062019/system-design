'use client';

import { useEffect, useRef, useState } from 'react';
import { useVideoAnalytics } from '../hooks/useVideoAnalytics';
import { Shield, Play, Pause, Volume2 } from 'lucide-react';

interface SecurePlayerProps {
  streamUrl: string;
  studentEmail: string;
  courseId: string;
  lessonId: string;
}

export function SecurePlayer({ streamUrl, studentEmail, courseId, lessonId }: SecurePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { handleVideoProgress } = useVideoAnalytics({ courseId, lessonId });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let x = Math.random() * 100;
    let y = Math.random() * 100;
    let dx = 0.5;
    let dy = 0.5;

    const renderWatermark = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = '12px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillText(`Protected for: ${studentEmail}`, x, y);

      if (x + 150 > canvas.width || x < 0) dx = -dx;
      if (y + 20 > canvas.height || y < 0) dy = -dy;

      x += dx;
      y += dy;

      animationId = requestAnimationFrame(renderWatermark);
    };

    renderWatermark();
    return () => cancelAnimationFrame(animationId);
  }, [studentEmail]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => { });
    }
    setIsPlaying(!isPlaying);
  };
  return (
    <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group">

      <video
        ref={videoRef}
        src={streamUrl} 
        onTimeUpdate={(e) => handleVideoProgress(e.currentTarget.currentTime)}
        controls={false} 
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* شريط التحكم المخصص (Custom UI Controls) */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
            {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
          </button>
          <button className="text-white hover:text-blue-400 transition-colors">
            <Volume2 size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] bg-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-full text-slate-350 border border-slate-700">
          <Shield size={12} className="text-emerald-400" /> بث مشفر محمي عالي الأداء
        </div>
      </div>
    </div>
  );
}


