import React, { useState, useEffect } from 'react';
import { 
  Code, Play, Send, Bookmark, CheckCircle2, XCircle, RotateCcw, 
  Terminal, Sparkles, Filter, Search, ChevronRight, Check, AlertCircle, Clock, Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CodingPage({ setActivePage }) {
  const { user, refreshUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'solution' | 'submissions'
  const [outputTab, setOutputTab] = useState('testcases'); // 'testcases' | 'result'
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, solved: 0, easy: 0, medium: 0, hard: 0 });
  const [submissions, setSubmissions] = useState([]);

  // Fetch Questions
  const loadQuestions = async () => {
    try {
      const res = await api.getCodingQuestions();
      setQuestions(res.questions || []);
      setStats(res.stats || { total: 0, solved: 0, easy: 0, medium: 0, hard: 0 });
      if (res.questions && res.questions.length > 0 && !selectedQuestion) {
        selectQuestion(res.questions[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const selectQuestion = async (q) => {
    try {
      const res = await api.getCodingQuestion(q.id);
      setSelectedQuestion(res.question);
      // Set initial code template for selected language
      const initialCode = res.question.templates?.[language] || `# Write your solution for ${res.question.title}`;
      setCode(initialCode);
      setTestResult(null);
      setOutputTab('testcases');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (selectedQuestion?.templates?.[newLang]) {
      setCode(selectedQuestion.templates[newLang]);
    }
  };

  const handleResetCode = () => {
    if (selectedQuestion?.templates?.[language]) {
      setCode(selectedQuestion.templates[language]);
    }
  };

  const handleToggleBookmark = async () => {
    if (!selectedQuestion) return;
    try {
      const res = await api.toggleBookmarkCode(selectedQuestion.id);
      setSelectedQuestion(prev => ({ ...prev, isBookmarked: res.isBookmarked }));
      setQuestions(prev => prev.map(q => q.id === selectedQuestion.id ? { ...q, isBookmarked: res.isBookmarked } : q));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunCode = async () => {
    if (!selectedQuestion) return;
    setRunLoading(true);
    setOutputTab('result');
    try {
      const res = await api.runCode({
        questionId: selectedQuestion.id,
        language,
        code
      });
      setTestResult(res);
    } catch (err) {
      setTestResult({
        status: 'Runtime Error',
        allPassed: false,
        results: [{ testIndex: 1, error: err.message, passed: false }]
      });
    } finally {
      setRunLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!selectedQuestion) return;
    setSubmitLoading(true);
    setOutputTab('result');
    try {
      const res = await api.submitCode({
        questionId: selectedQuestion.id,
        language,
        code
      });
      setTestResult(res);
      if (res.status === 'Accepted') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
        refreshUser();
        loadQuestions();
      }
    } catch (err) {
      setTestResult({
        status: 'Submission Error',
        allPassed: false,
        results: [{ testIndex: 1, error: err.message, passed: false }]
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Filtered question bank list
  const filteredQuestions = questions.filter(q => {
    const matchesDiff = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
    const matchesSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 animate-in fade-in">
      
      {/* Top Banner / Question Quick Picker Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Questions Count & Difficulty Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <span className="font-extrabold text-white text-sm">Placement Coding IDE</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold">Solved:</span>
            <span className="text-emerald-400 font-extrabold">{stats.solved}/{stats.total}</span>
          </div>

          {/* Difficulty filter buttons */}
          <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  filterDifficulty === diff
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Search question */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problem title..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

      </div>

      {/* Main Split-Screen IDE: Left (Problem / Testcases) & Right (Code Editor & Runner) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[700px]">
        
        {/* Left Pane: Question Description (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl border border-slate-800 flex flex-col overflow-hidden">
          
          {/* Question Selector Carousel / Drawer */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                selectedQuestion?.difficulty === 'Easy' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : selectedQuestion?.difficulty === 'Medium'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {selectedQuestion?.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{selectedQuestion?.topic}</span>
            </div>

            <div className="flex items-center space-x-2">
              {setActivePage && selectedQuestion && (
                <button
                  onClick={() => setActivePage('coding-question', { questionId: selectedQuestion.id })}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold glass-panel border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-600/20 transition flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Editorial & Analysis</span>
                </button>
              )}

              <button
                onClick={handleToggleBookmark}
                className={`p-1.5 rounded-lg border transition ${
                  selectedQuestion?.isBookmarked 
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Bookmark problem"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Problem Switcher Strip */}
          <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center space-x-2 overflow-x-auto text-xs">
            {filteredQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => selectQuestion(q)}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center space-x-1.5 whitespace-nowrap transition ${
                  selectedQuestion?.id === q.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {q.isSolved && <Check className="w-3 h-3 text-emerald-400" />}
                <span>{q.title}</span>
              </button>
            ))}
          </div>

          {/* Question Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-300">
            {selectedQuestion ? (
              <>
                <div>
                  <h2 className="text-xl font-extrabold text-white mb-2">{selectedQuestion.title}</h2>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(selectedQuestion.companies || []).map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/50 text-[10px] font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                  <p className="whitespace-pre-line leading-relaxed text-slate-300">
                    {selectedQuestion.description}
                  </p>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-indigo-400">
                    Examples
                  </h3>
                  <div className="space-y-3">
                    {(selectedQuestion.examples || []).map((ex, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1">
                        <p><strong className="text-slate-400">Input:</strong> <span className="text-cyan-300">{ex.input}</span></p>
                        <p><strong className="text-slate-400">Output:</strong> <span className="text-emerald-300">{ex.output}</span></p>
                        {ex.explanation && (
                          <p className="text-slate-400 text-[10px] font-sans pt-1 border-t border-slate-800/80">
                            <strong>Explanation:</strong> {ex.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                {selectedQuestion.constraints && (
                  <div>
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-amber-400">
                      Constraints
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px]">
                      {selectedQuestion.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-slate-400">Select a problem to begin.</div>
            )}
          </div>
        </div>

        {/* Right Pane: Code Editor + Runner Console (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Editor Header: Language selector, Reset code, Run & Submit */}
          <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Language:</span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="python">Python 3</option>
                <option value="cpp">C++ (GCC)</option>
                <option value="java">Java (OpenJDK)</option>
                <option value="c">C (Clang)</option>
              </select>

              <button
                type="button"
                onClick={handleResetCode}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                title="Reset code template"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Run & Submit buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleRunCode}
                disabled={runLoading || submitLoading}
                className="px-4 py-1.5 rounded-xl font-bold text-xs text-slate-200 glass-panel border border-slate-700 hover:bg-slate-800 transition flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>{runLoading ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitCode}
                disabled={runLoading || submitLoading}
                className="px-5 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitLoading ? 'Evaluating...' : 'Submit Solution'}</span>
              </button>
            </div>

          </div>

          {/* Code Editor Area */}
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden flex flex-col flex-1 min-h-[380px]">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px] text-indigo-400">solution.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'c'}</span>
              <span className="text-[10px]">Autosaved &bull; Tab: 4 Spaces</span>
            </div>

            {/* Code Textarea with line numbers feeling */}
            <div className="relative flex-1 bg-slate-950 flex font-mono text-xs">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                className="w-full h-full p-4 bg-transparent text-slate-100 font-mono text-[13px] leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-indigo-500/30"
                placeholder="Write your code here..."
              ></textarea>
            </div>
          </div>

          {/* Test Case / Execution Output Console */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 min-h-[200px] flex flex-col">
            <div className="flex items-center space-x-4 border-b border-slate-800 pb-2 text-xs font-bold">
              <button
                onClick={() => setOutputTab('testcases')}
                className={`pb-1 transition ${outputTab === 'testcases' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-white'}`}
              >
                Sample Testcases
              </button>
              <button
                onClick={() => setOutputTab('result')}
                className={`pb-1 transition ${outputTab === 'result' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
              >
                Execution Result
              </button>
            </div>

            {/* Console Content */}
            <div className="py-3 flex-1 overflow-y-auto text-xs">
              {outputTab === 'testcases' ? (
                <div className="space-y-2">
                  {(selectedQuestion?.testCases || []).map((tc, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] flex items-center justify-between">
                      <div>
                        <span className="text-slate-500">Case {idx + 1}: </span>
                        <span className="text-cyan-300">{tc.input}</span>
                      </div>
                      <span className="text-emerald-400">&rarr; {tc.expectedOutput}</span>
                    </div>
                  ))}
                </div>
              ) : testResult ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {testResult.allPassed ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold text-sm flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accepted</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 font-extrabold text-sm flex items-center space-x-1">
                          <XCircle className="w-4 h-4" />
                          <span>{testResult.status || 'Wrong Answer'}</span>
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-semibold">
                        ({testResult.testsPassed || 0}/{testResult.totalTests || 0} Testcases Passed)
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1"><Clock className="w-3.5 h-3.5 text-indigo-400" /><span>{testResult.runtimeMs || 35} ms</span></span>
                      <span className="flex items-center space-x-1"><Cpu className="w-3.5 h-3.5 text-cyan-400" /><span>{testResult.memoryKb || 14200} KB</span></span>
                    </div>
                  </div>

                  {testResult.message && (
                    <p className="text-xs text-emerald-400 font-semibold">{testResult.message}</p>
                  )}

                  {/* Individual Test Results */}
                  <div className="space-y-2 mt-2">
                    {(testResult.results || []).map((r, i) => (
                      <div key={i} className={`p-3 rounded-xl border text-[11px] font-mono ${r.passed ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-rose-950/20 border-rose-800/40 text-rose-300'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold">Testcase #{r.testIndex}: {r.passed ? 'Passed' : 'Failed'}</span>
                          <span className="text-xs">{r.passed ? '✅' : '❌'}</span>
                        </div>
                        {r.input && <p className="text-slate-400">Input: <span className="text-white">{r.input}</span></p>}
                        {r.expectedOutput && <p className="text-slate-400">Expected: <span className="text-emerald-400">{r.expectedOutput}</span></p>}
                        {r.actualOutput && <p className="text-slate-400">Actual: <span className={r.passed ? 'text-emerald-400' : 'text-rose-400'}>{r.actualOutput}</span></p>}
                        {r.error && <p className="text-rose-400 whitespace-pre-wrap mt-1">{r.error}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-center py-6">
                  Click <strong className="text-slate-300">Run Code</strong> to test sample cases or <strong className="text-slate-300">Submit Solution</strong> to run against all hidden test cases.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
