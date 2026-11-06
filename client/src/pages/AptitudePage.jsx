import React, { useState, useEffect } from 'react';
import { 
  Brain, Clock, Award, CheckCircle2, XCircle, ArrowRight, ArrowLeft, 
  RotateCcw, Sparkles, Filter, AlertCircle, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AptitudePage({ setActivePage }) {
  const { refreshUser } = useAuth();
  const [stage, setStage] = useState('config'); // 'config' | 'exam' | 'results'
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [enableNegativeMarking, setEnableNegativeMarking] = useState(true);

  // Active Exam State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes
  const [loading, setLoading] = useState(false);
  const [examResult, setExamResult] = useState(null);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (stage === 'exam' && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, secondsRemaining]);

  const handleStartExam = async () => {
    setLoading(true);
    try {
      const query = `category=${category}&difficulty=${difficulty}&limit=10`;
      const res = await api.getAptitudeQuestions(query);
      setQuestions(res.questions || []);
      setCurrentIndex(0);
      setUserAnswers({});
      setMarkedForReview(new Set());
      setSecondsRemaining(600); // 10 mins
      setStage('exam');
    } catch (e) {
      alert('Failed to load aptitude test questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const toggleMarkReview = (qId) => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleSubmitTest = async () => {
    if (!confirm('Are you sure you want to finish and submit your test?')) return;
    executeSubmission();
  };

  const handleAutoSubmit = async () => {
    executeSubmission();
  };

  const executeSubmission = async () => {
    setLoading(true);
    try {
      const res = await api.submitAptitudeTest({
        userAnswers,
        timeSpentSeconds: 600 - secondsRemaining,
        enableNegativeMarking
      });
      setExamResult(res);
      setStage('results');
      confetti({ particleCount: 70, spread: 60 });
      refreshUser();
    } catch (e) {
      alert('Error scoring test.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      
      {/* ================= STAGE 1: CONFIGURATION ================= */}
      {stage === 'config' && (
        <div className="space-y-8">
          
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/30 text-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-[2px] mx-auto mb-4 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Brain className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Aptitude & Reasoning Exam Simulator</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
              Standardized campus aptitude testing across Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation, and Analytical Reasoning.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <h2 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Configure Test Parameters</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              {/* Category */}
              <div>
                <label className="block font-bold text-slate-300 mb-2">Select Domain</label>
                <div className="space-y-1.5">
                  {[
                    'All',
                    'Quantitative Aptitude',
                    'Logical Reasoning',
                    'Verbal Ability',
                    'Data Interpretation',
                    'Analytical Reasoning'
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`w-full p-2.5 rounded-xl border text-left font-semibold transition ${
                        category === cat
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'glass-card border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty & Options */}
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-2">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        className={`py-2 rounded-xl border font-semibold text-center transition ${
                          difficulty === diff
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'glass-card border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableNegativeMarking}
                      onChange={(e) => setEnableNegativeMarking(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-bold text-slate-200">Enable Negative Marking (-0.25 penalty)</span>
                  </label>
                  <p className="text-[11px] text-slate-400 pl-7 leading-relaxed">
                    Standard negative marking mirrors TCS, Infosys, and Cognizant placement scoring rules.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Time Limit: <strong>10:00 Minutes</strong> &bull; 10 Questions</span>
              <button
                onClick={handleStartExam}
                disabled={loading}
                className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-indigo-600/30 transition flex items-center space-x-2"
              >
                <span>{loading ? 'Starting...' : 'Start Aptitude Test'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ================= STAGE 2: EXAM SIMULATOR ================= */}
      {stage === 'exam' && currentQ && (
        <div className="space-y-6">
          
          {/* Header Strip with Timer */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-extrabold text-xs">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-slate-300 font-semibold">{currentQ.category}</span>
            </div>

            {/* Countdown Timer */}
            <div className={`px-4 py-1.5 rounded-xl font-mono text-xs font-extrabold flex items-center space-x-2 border ${
              secondsRemaining < 120 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                : 'bg-slate-900 text-cyan-400 border-slate-800'
            }`}>
              <Clock className="w-4 h-4" />
              <span>Time Left: {formatTimer(secondsRemaining)}</span>
            </div>

            <button
              onClick={handleSubmitTest}
              className="px-4 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-500 shadow-md transition"
            >
              Submit Exam
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Question Card (8 cols) */}
            <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {currentQ.topic || currentQ.category} &bull; {currentQ.difficulty}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-2 leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {(currentQ.options || []).map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ.id, oIdx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center space-x-3 transition ${
                      userAnswers[currentQ.id] === oIdx
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      userAnswers[currentQ.id] === oIdx ? 'bg-white text-indigo-700' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              {/* Bottom Nav Controls */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleMarkReview(currentQ.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    markedForReview.has(currentQ.id) 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {markedForReview.has(currentQ.id) ? '★ Marked for Review' : '☆ Mark for Review'}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => currentIndex > 0 && setCurrentIndex(prev => prev - 1)}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 rounded-xl text-xs font-semibold glass-panel border border-slate-800 text-slate-300 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => currentIndex < questions.length - 1 && setCurrentIndex(prev => prev + 1)}
                    disabled={currentIndex === questions.length - 1}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>

            {/* Question Navigation Palette (4 cols) */}
            <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Question Palette</h4>
              
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isMarked = markedForReview.has(q.id);
                  const isCurrent = currentIndex === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-xl font-bold text-xs flex items-center justify-center transition border ${
                        isCurrent
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50'
                          : ''
                      } ${
                        isMarked
                          ? 'bg-amber-500/30 text-amber-300 border-amber-500/50'
                          : isAnswered
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></span>
                  <span>Unanswered</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================= STAGE 3: RESULTS & EXPLANATIONS ================= */}
      {stage === 'results' && examResult && (
        <div className="space-y-8 animate-in zoom-in-95">
          
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/40 text-center relative">
            <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Test Results & Analytics</h2>
            <p className="text-xs text-slate-300 mt-1">
              Time Spent: {Math.floor(examResult.summary.timeSpentSeconds / 60)}m {examResult.summary.timeSpentSeconds % 60}s &bull; +{examResult.summary.xpEarned} XP Earned
            </p>

            {/* Scorecard KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 max-w-3xl mx-auto">
              <div className="glass-panel p-3.5 rounded-2xl text-center">
                <p className="text-2xl font-extrabold text-white">{examResult.summary.score} / {examResult.summary.maxScore}</p>
                <p className="text-[11px] text-slate-400">Final Score</p>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl text-center">
                <p className="text-2xl font-extrabold text-emerald-400">{examResult.summary.accuracyPct}%</p>
                <p className="text-[11px] text-slate-400">Accuracy Rate</p>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl text-center">
                <p className="text-2xl font-extrabold text-cyan-400">{examResult.summary.correctCount}</p>
                <p className="text-[11px] text-slate-400">Correct Answers</p>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl text-center">
                <p className="text-2xl font-extrabold text-rose-400">{examResult.summary.incorrectCount}</p>
                <p className="text-[11px] text-slate-400">Incorrect</p>
              </div>
            </div>
          </div>

          {/* Question-by-Question Explanations */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Detailed Mathematical & Logical Explanations
            </h3>

            {(examResult.results || []).map((res, idx) => (
              <div 
                key={idx}
                className={`glass-panel p-6 rounded-2xl border text-xs space-y-3 ${
                  res.isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    Q{idx + 1}: {res.question}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    res.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {res.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <p className="text-slate-400">Your Answer: <strong className={res.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{res.userAnswer !== null ? res.options[res.userAnswer] : 'Not Attempted'}</strong></p>
                  <p className="text-slate-400">Correct Answer: <strong className="text-emerald-400">{res.options[res.correctAnswer]}</strong></p>
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-line">
                  {res.explanation}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStage('config')}
            className="w-full py-3.5 rounded-2xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Configure Another Test</span>
          </button>

        </div>
      )}

    </div>
  );
}
