import React from 'react';
import { 
  ArrowLeft, Award, CheckCircle2, XCircle, RotateCcw, Brain, 
  HelpCircle, ChevronRight, Trophy, BarChart3, Clock, Sparkles
} from 'lucide-react';

export default function QuizResultsPage({ setActivePage, resultData }) {
  // Fallback demo result if navigated directly
  const data = resultData || {
    score: 8,
    total: 10,
    percentage: 80,
    accuracy: 80,
    timeTakenSeconds: 345,
    xpAwarded: 120,
    categoryBreakdown: {
      'Quantitative Aptitude': { score: 3, total: 4 },
      'Logical Reasoning': { score: 3, total: 3 },
      'Verbal Ability': { score: 2, total: 3 }
    },
    questionsReview: [
      {
        question: 'A can complete a piece of work in 10 days and B can complete it in 15 days. If they work together for 3 days and then A leaves, how many more days will B take to complete the remaining work?',
        options: ['5 days', '6 days', '7.5 days', '8 days'],
        userSelected: 2,
        correctAnswer: 2,
        explanation: 'Total work = LCM(10, 15) = 30 units. Efficiency: A=3, B=2. Work in 3 days = 3*(3+2)=15 units. Remaining = 15 units. Time for B = 15/2 = 7.5 days.'
      },
      {
        question: 'A train 180 meters long is traveling at 72 km/h. How long will it take to pass an electric pole standing on the platform?',
        options: ['9 seconds', '12 seconds', '15 seconds', '8 seconds'],
        userSelected: 0,
        correctAnswer: 0,
        explanation: 'Speed in m/s = 72 * (5/18) = 20 m/s. Time to cross pole = Distance / Speed = 180 / 20 = 9 seconds.'
      },
      {
        question: 'Choose the word that is most nearly OPPOSITE in meaning to the capitalized word: EPHEMERAL',
        options: ['Transient', 'Eternal', 'Fleeting', 'Delicate'],
        userSelected: 1,
        correctAnswer: 1,
        explanation: 'Ephemeral means lasting for a very short time. Its antonym is Eternal (everlasting).'
      }
    ]
  };

  const minutes = Math.floor((data.timeTakenSeconds || 300) / 60);
  const seconds = (data.timeTakenSeconds || 300) % 60;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Top Navigation */}
      <button
        onClick={() => setActivePage('aptitude')}
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Aptitude Arena</span>
      </button>

      {/* Hero Scorecard */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-500/30 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assessment Completed!</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Quiz Performance Scorecard</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
            Great performance! You demonstrated strong problem-solving in logical deductions and numerical computations.
          </p>
          <p className="text-xs font-extrabold text-indigo-400 pt-2">
            + {data.xpAwarded || 100} XP Awarded to your Career Level
          </p>
        </div>

        {/* Score Ring / Pill */}
        <div className="flex-shrink-0 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Final Score</p>
          <p className="text-4xl sm:text-5xl font-black text-cyan-400">
            {data.score} <span className="text-slate-500 text-2xl font-bold">/ {data.total}</span>
          </p>
          <p className="text-xs font-semibold text-emerald-400">{data.percentage || Math.round((data.score / data.total) * 100)}% Accuracy</p>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{data.score}</p>
            <p className="text-[11px] text-slate-400">Correct Answers</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{data.total - data.score}</p>
            <p className="text-[11px] text-slate-400">Incorrect</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{minutes}m {seconds}s</p>
            <p className="text-[11px] text-slate-400">Time Taken</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-amber-400">Top 15%</p>
            <p className="text-[11px] text-slate-400">Percentile Rank</p>
          </div>
        </div>
      </div>

      {/* Question by Question Detailed Review */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>Comprehensive Question Solutions & Explanations</span>
          </h2>
          <span className="text-xs text-slate-400 font-semibold">
            {data.questionsReview?.length || 0} Questions
          </span>
        </div>

        <div className="space-y-4">
          {(data.questionsReview || []).map((q, idx) => {
            const isCorrect = q.userSelected === q.correctAnswer;

            return (
              <div 
                key={idx} 
                className={`p-5 rounded-2xl border transition ${
                  isCorrect 
                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                    : 'bg-rose-500/5 border-rose-500/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-white mb-4 leading-relaxed">
                  {q.question}
                </p>

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
                  {q.options?.map((opt, optIdx) => {
                    const isSelected = q.userSelected === optIdx;
                    const isThisCorrect = q.correctAnswer === optIdx;

                    let optStyle = 'bg-slate-900 border-slate-800 text-slate-400';
                    if (isThisCorrect) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold';
                    } else if (isSelected && !isThisCorrect) {
                      optStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold';
                    }

                    return (
                      <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${optStyle}`}>
                        <span>{opt}</span>
                        {isThisCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                        {isSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Step-by-Step Explanation */}
                {q.explanation && (
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                    <p className="font-extrabold text-cyan-400 text-[11px] uppercase tracking-wider">Solution Logic:</p>
                    <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActivePage('aptitude')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Another Quiz</span>
          </button>

          <button
            onClick={() => setActivePage('leaderboard')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-slate-200 glass-panel border border-slate-700 hover:bg-slate-800 flex items-center justify-center space-x-2"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Compare on Leaderboard</span>
          </button>
        </div>
      </div>

    </div>
  );
}
