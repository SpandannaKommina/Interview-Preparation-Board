import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Code2, CheckCircle2, Bookmark, Share2, Sparkles, 
  Terminal, Cpu, Clock, HelpCircle, Building2, Play, Check, ChevronRight, Layers
} from 'lucide-react';
import { api } from '../services/api';

export default function CodingQuestionDetailsPage({ setActivePage, questionId }) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'editorial' | 'complexity' | 'companies'
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        // Default to code_01 if none passed
        const targetId = questionId || 'code_01';
        const res = await api.getCodingQuestion(targetId);
        setQuestion(res.question);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId]);

  if (loading || !question) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading problem details and editorial...</p>
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActivePage('coding')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Back to Coding IDE & Problem List</span>
        </button>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => setActivePage('coding')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Open in Interactive IDE</span>
          </button>
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Title & Badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${difficultyColors[question.difficulty] || 'bg-slate-800 text-slate-300'}`}>
                {question.difficulty}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {question.topic}
              </span>
              {question.isSolved && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Solved</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {question.title}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Asked By Top Tech</p>
              <div className="flex items-center space-x-1 mt-1 justify-end">
                {question.companies?.slice(0, 3).map((comp, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 space-x-2 text-xs">
          <button
            onClick={() => setActiveTab('problem')}
            className={`pb-3 px-3 font-bold border-b-2 transition ${
              activeTab === 'problem'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Problem Description
          </button>
          <button
            onClick={() => setActiveTab('editorial')}
            className={`pb-3 px-3 font-bold border-b-2 transition ${
              activeTab === 'editorial'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Optimal Solution & Code
          </button>
          <button
            onClick={() => setActiveTab('complexity')}
            className={`pb-3 px-3 font-bold border-b-2 transition ${
              activeTab === 'complexity'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Complexity Analysis
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`pb-3 px-3 font-bold border-b-2 transition ${
              activeTab === 'companies'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Company Tagging & Rounds
          </button>
        </div>

        {/* Tab 1: Problem Description */}
        {activeTab === 'problem' && (
          <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 whitespace-pre-line text-sm text-slate-200 leading-relaxed">
              {question.description}
            </div>

            {/* Examples */}
            {question.examples && question.examples.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-white text-sm flex items-center space-x-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Sample Inputs & Outputs</span>
                </h3>
                <div className="grid gap-3">
                  {question.examples.map((ex, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono space-y-1.5">
                      <p className="text-slate-400 font-bold text-[11px]">Example {i + 1}:</p>
                      <p><span className="text-indigo-400 font-semibold">Input:</span> {ex.input}</p>
                      <p><span className="text-emerald-400 font-semibold">Output:</span> {ex.output}</p>
                      {ex.explanation && (
                        <p className="text-slate-400 font-sans text-[11px] pt-1 italic">
                          <span className="font-semibold text-slate-300">Explanation:</span> {ex.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraints */}
            {question.constraints && (
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <h4 className="font-extrabold text-amber-300 text-xs flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Constraints & Bounds</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
                  {question.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Editorial & Optimal Solution */}
        {activeTab === 'editorial' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {['python', 'java', 'cpp', 'c'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                      selectedLanguage === lang
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleCopyCode(question.templates?.[selectedLanguage] || '')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold glass-panel border border-slate-700 text-slate-300 hover:text-white transition flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Solution'}</span>
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-4">
              <pre className="font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed">
                <code>{question.templates?.[selectedLanguage] || '# Solution template unavailable for this language'}</code>
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
              <h4 className="font-extrabold text-indigo-300">Algorithmic Strategy:</h4>
              <p className="text-slate-300 leading-relaxed">
                This problem is optimized using hash table caching and single-pass traversal. Instead of evaluating all pairs in quadratic O(N²) time, storing elements in a hash map guarantees constant time O(1) lookups.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Complexity Analysis */}
        {activeTab === 'complexity' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <Clock className="w-4 h-4" />
                <span>Time Complexity: O(N)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                We traverse the list containing N elements exactly once. Each lookup in the hash table takes O(1) average time. Hence, the overall time complexity is linear O(N).
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-purple-400 font-bold">
                <Cpu className="w-4 h-4" />
                <span>Space Complexity: O(N)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                The extra space required depends on the number of items stored in the hash map, which stores at most N elements in the worst case.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Companies */}
        {activeTab === 'companies' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300 leading-relaxed">
              This problem has been frequently asked during technical rounds for SDE-1, Associate Software Engineer, and Specialist Programmer roles at:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(question.companies || ['Google', 'Amazon', 'Microsoft', 'TCS Prime']).map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-white">{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
