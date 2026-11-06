import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Mic, MicOff, Volume2, VolumeX, Play, RotateCcw, 
  Send, Sparkles, CheckCircle2, AlertCircle, Clock, Award, 
  ArrowRight, ArrowLeft, RefreshCw, BarChart2, Lightbulb, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function InterviewPage({ setActivePage }) {
  const { refreshUser } = useAuth();
  
  // Stages: 'config' | 'interview' | 'feedback' | 'report'
  const [stage, setStage] = useState('config');
  
  // Setup Config
  const [interviewType, setInterviewType] = useState('Technical Interview');
  const [role, setRole] = useState('Full Stack Developer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [questionCount, setQuestionCount] = useState(3);
  
  // Active Interview Session State
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [evaluations, setEvaluations] = useState({});
  const [finalReport, setFinalReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Timers
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);

  // Audio / Speech State
  const [isRecording, setIsRecording] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (stage === 'interview') {
      interval = setInterval(() => {
        setTotalSeconds(prev => prev + 1);
        setQuestionSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage]);

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentAnswer(prev => prev + ' ' + transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Text to Speech
  const speakQuestion = (text) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. Please type your answer.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Start Interview
  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await api.startInterview({
        interviewType,
        role,
        difficulty,
        questionCount
      });
      setSessionId(res.sessionId);
      setQuestions(res.questions || []);
      setCurrentIndex(0);
      setCurrentAnswer('');
      setEvaluations({});
      setTotalSeconds(0);
      setQuestionSeconds(0);
      setStage('interview');

      // Speak first question
      if (res.questions && res.questions[0]) {
        setTimeout(() => speakQuestion(res.questions[0].question), 500);
      }
    } catch (err) {
      alert(err.message || 'Failed to start interview.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Answer for Current Question
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert('Please speak or type your answer before submitting.');
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setLoading(true);
    try {
      const res = await api.evaluateAnswer({
        sessionId,
        questionIndex: currentIndex,
        answer: currentAnswer
      });

      setEvaluations(prev => ({
        ...prev,
        [currentIndex]: res.evaluation
      }));

      // If last question, finish interview
      if (currentIndex === questions.length - 1) {
        handleFinishInterview();
      } else {
        // Move to next question
        setCurrentIndex(prev => prev + 1);
        setCurrentAnswer('');
        setQuestionSeconds(0);
        setTimeout(() => {
          if (questions[currentIndex + 1]) {
            speakQuestion(questions[currentIndex + 1].question);
          }
        }, 500);
      }
    } catch (err) {
      alert(err.message || 'Evaluation error.');
    } finally {
      setLoading(false);
    }
  };

  // Finish Interview
  const handleFinishInterview = async () => {
    setLoading(true);
    try {
      const res = await api.finishInterview({ sessionId });
      setFinalReport(res.report);
      setStage('report');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to finish interview.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in space-y-6">
      
      {/* ===================== STAGE 1: CONFIGURATION ===================== */}
      {stage === 'config' && (
        <div className="space-y-8">
          
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/30 text-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 p-[2px] mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Video className="w-7 h-7 text-brand-electric" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white">AI Mock Interview Room</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
              Experience authentic placement interviews. Answer with speech or text, receive real-time scoring, STAR method breakdown, and model answers.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Configure Your Interview Simulation</span>
              </h2>
              {setActivePage && (
                <button
                  onClick={() => setActivePage('interview-history')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold glass-panel border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center space-x-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Interview Archives</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              {/* Interview Type */}
              <div>
                <label className="block font-bold text-slate-300 mb-2">Interview Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Technical Interview',
                    'HR Interview',
                    'Coding Interview',
                    'Behavioral Interview',
                    'Company-specific Interview'
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInterviewType(type)}
                      className={`p-3 rounded-xl border text-left font-semibold transition ${
                        interviewType === type
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'glass-card border-slate-700/80 text-slate-300 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Role */}
              <div>
                <label className="block font-bold text-slate-300 mb-2">Target Job Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Full Stack Developer">Full Stack Developer (React & Node.js)</option>
                  <option value="SDE 1">SDE 1 (Data Structures, Algorithms & Systems)</option>
                  <option value="Data Analyst">Data Analyst (SQL, Python & Modeling)</option>
                  <option value="Cloud/DevOps Engineer">Cloud / DevOps Engineer</option>
                  <option value="QA / SDET">QA Automation / SDET</option>
                </select>

                {/* Difficulty */}
                <div className="mt-4">
                  <label className="block font-bold text-slate-300 mb-2">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        className={`py-2.5 rounded-xl border font-semibold text-center transition ${
                          difficulty === diff
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'glass-card border-slate-700/80 text-slate-300 hover:text-white'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div className="mt-4">
                  <label className="block font-bold text-slate-300 mb-2">Number of Questions</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 5, 8].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuestionCount(num)}
                        className={`py-2 rounded-xl border font-semibold text-center transition ${
                          questionCount === num
                            ? 'bg-cyan-600 text-white border-cyan-500'
                            : 'glass-card border-slate-700/80 text-slate-300 hover:text-white'
                        }`}
                      >
                        {num} Questions
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Launch Button */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                AI Evaluator Status: <strong className="text-emerald-400">Online & Ready</strong>
              </span>

              <button
                type="button"
                onClick={handleStartInterview}
                disabled={loading}
                className="px-8 py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition flex items-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Initializing Interview Room...' : 'Enter Interview Room'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ===================== STAGE 2: LIVE INTERVIEW ROOM ===================== */}
      {stage === 'interview' && currentQ && (
        <div className="space-y-6">
          
          {/* Top Status Bar: Question Progress, Timers, Audio toggles */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-extrabold text-xs">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-slate-300 font-semibold">{currentQ.category}</span>
            </div>

            <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
              <div className="flex items-center space-x-1.5" title="Time on this question">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Q: {formatTime(questionSeconds)}</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center space-x-1.5" title="Total interview duration">
                <span>Total: {formatTime(totalSeconds)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-2 rounded-xl border transition ${
                  speechEnabled ? 'bg-slate-800 text-cyan-400 border-slate-700' : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
                title={speechEnabled ? 'Mute AI voice' : 'Enable AI voice'}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => speakQuestion(currentQ.question)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-panel border border-slate-700 hover:bg-slate-800 text-slate-300"
              >
                Replay Question
              </button>
            </div>

          </div>

          {/* AI Interviewer Avatar & Question Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 relative">
            <div className="flex items-start space-x-4">
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] shadow-lg ${isSpeaking ? 'animate-pulse' : ''}`}>
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-brand-electric" />
                  </div>
                </div>
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping"></span>
                )}
              </div>

              <div className="flex-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-purple">
                  AI Interviewer Panelist
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1 leading-snug">
                  "{currentQ.question}"
                </h3>
                {currentQ.hint && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Interviewer Context:</strong> {currentQ.hint}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Response Workspace */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-xs">Your Answer</span>
                <span className="text-[11px] text-slate-400">
                  ({currentAnswer.trim().split(/\s+/).filter(Boolean).length} words)
                </span>
              </div>

              {/* Voice Input Toggle Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30' 
                    : 'glass-panel border border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-rose-400" />}
                <span>{isRecording ? 'Listening (Click to Stop)...' : 'Speak Answer'}</span>
              </button>
            </div>

            {/* Answer Text Area */}
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              rows={6}
              placeholder="Speak using the microphone above or type your structured answer here... (Tip: Use STAR method for behavioral questions, state Big-O for technical questions)"
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:border-indigo-500 selection:bg-indigo-500/30 resize-none font-sans"
            ></textarea>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  if (currentIndex > 0) {
                    setCurrentIndex(prev => prev - 1);
                    setCurrentAnswer('');
                  }
                }}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold glass-panel border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40"
              >
                Previous Question
              </button>

              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={loading || !currentAnswer.trim()}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Evaluating Response...' : currentIndex === questions.length - 1 ? 'Submit & Finalize Report' : 'Submit & Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ===================== STAGE 3: FINAL REPORT SCORECARD ===================== */}
      {stage === 'report' && finalReport && (
        <div className="space-y-8 animate-in zoom-in-95">
          
          {/* Celebration Header */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/40 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-[2px] mx-auto mb-4 shadow-xl shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <Award className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Interview Performance Evaluation</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {finalReport.role} &bull; {finalReport.interviewType} &bull; +100 XP Awarded
            </p>

            {/* Big Score Gauge */}
            <div className="mt-6 inline-flex items-center space-x-3 px-6 py-3 rounded-2xl glass-panel border border-emerald-500/30">
              <span className="text-4xl font-extrabold text-white">{finalReport.score}</span>
              <span className="text-sm font-bold text-emerald-400">/ 100 Overall Score</span>
            </div>
          </div>

          {/* 4 Dimension Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-semibold">Technical Accuracy</p>
              <p className="text-2xl font-extrabold text-cyan-400 mt-1">{finalReport.breakdown.accuracy}%</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${finalReport.breakdown.accuracy}%` }}></div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-semibold">Clarity & Articulation</p>
              <p className="text-2xl font-extrabold text-indigo-400 mt-1">{finalReport.breakdown.clarity}%</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${finalReport.breakdown.clarity}%` }}></div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-semibold">Problem Solving</p>
              <p className="text-2xl font-extrabold text-purple-400 mt-1">{finalReport.breakdown.problemSolving}%</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: `${finalReport.breakdown.problemSolving}%` }}></div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-semibold">Completeness</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">{finalReport.breakdown.completeness}%</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${finalReport.breakdown.completeness}%` }}></div>
              </div>
            </div>

          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demonstrated Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {finalReport.strengths.map((str, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">&bull;</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Key Improvement Areas</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {finalReport.weaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">&bull;</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Actionable Recommendations */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-indigo-400">
              Interviewer Panel Actionable Verdict
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {finalReport.recommendations}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStage('config')}
              className="px-6 py-3 rounded-xl font-bold text-xs text-slate-200 glass-panel border border-slate-700 hover:bg-slate-800 transition flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Take Another Mock Session</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
