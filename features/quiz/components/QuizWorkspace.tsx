'use client';

import { useQuizEngine } from '../hooks/useQuizEngine';
import { Wifi, WifiOff, Clock, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';

const MOCK_QUESTIONS = [
     { id: 'q1', text: 'Which technique is best for rendering thousands of map points with high performance?', options: ['Virtual DOM', 'WebGL / Canvas', 'CSS Animations', 'Server-Side Rendering'] },
     { id: 'q2', text: 'Which of the following helps prevent memory leaks during a high-volume data stream?', options: ['Time Windowing', 'UseEffect Without Dependencies', 'LocalStorage', 'Inline Styles'] },
     { id: 'q3', text: 'What is the primary benefit of event batching?', options: ['Encrypting data', 'Reducing re-renders and saving CPU time', 'Increasing cache size', 'Improving SEO'] },
];

export function QuizWorkspace() {
     const {
          currentQuestion,
          currentIdx,
          setCurrentIdx,
          answers,
          saveAnswer,
          timeLeft,
          isOnline,
          totalQuestions
     } = useQuizEngine('final-exam-01', MOCK_QUESTIONS, 1800); // 30-minute exam.

     const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
     };

     return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
               <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-2xl w-full p-6 space-y-6 relative overflow-hidden">

                    {/* Top status bar and network state */}
                    <div className="flex justify-between items-center border-b pb-4">
                         <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700">Question {currentIdx + 1} of {totalQuestions}</span>
                              {isOnline ? (
                                   <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
                                        <Wifi size={12} /> Online and synced
                                   </span>
                              ) : (
                                   <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 animate-pulse">
                                        <WifiOff size={12} /> Offline with local recovery
                                   </span>
                              )}
                         </div>

                         <div className="flex items-center gap-2 bg-slate-950 text-white font-mono px-3 py-1.5 rounded-xl text-sm font-bold">
                              <Clock size={16} className="text-amber-400" />
                              {formatTime(timeLeft)}
                         </div>
                    </div>

                    {/* Current question body */}
                    <div className="space-y-4">
                         <h2 className="text-base font-bold text-slate-900 leading-relaxed">{currentQuestion.text}</h2>

                         <div className="grid grid-cols-1 gap-3 pt-2">
                              {currentQuestion.options.map((option) => {
                                   const isSelected = answers[currentQuestion.id] === option;
                                   return (
                                        <button
                                             key={option}
                                             onClick={() => saveAnswer(currentQuestion.id, option)}
                                             className={`p-4 rounded-2xl text-left text-sm font-semibold transition-all border ${isSelected
                                                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                                                  }`}
                                        >
                                             {option}
                                        </button>
                                   );
                              })}
                         </div>
                    </div>

                    {/* Navigation controls */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                         <button
                              disabled={currentIdx === 0}
                              onClick={() => setCurrentIdx(prev => prev - 1)}
                              className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 disabled:opacity-30"
                         >
                              <ArrowLeft size={14} /> Previous
                         </button>

                         {!isOnline && (
                              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                   <ShieldAlert size={12} /> Your progress is stored locally
                              </span>
                         )}

                         <button
                              disabled={currentIdx === totalQuestions - 1}
                              onClick={() => setCurrentIdx(prev => prev + 1)}
                              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-30"
                         >
                              Next <ArrowRight size={14} />
                         </button>
                    </div>
               </div>
          </div>
     );
}
