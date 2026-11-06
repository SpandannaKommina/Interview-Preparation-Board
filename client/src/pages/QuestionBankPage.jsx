import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Search, Filter, Bookmark, CheckCircle2, 
  ChevronDown, ChevronUp, Sparkles, Star, Tag, Check
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function QuestionBankPage({ setActivePage }) {
  const { refreshUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const query = `category=${category}&difficulty=${difficulty}&search=${search}`;
      const res = await api.getQuestionBank(query);
      setQuestions(res.questions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty, search]);

  const handleToggleMaster = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await api.toggleMasterQuestion(id);
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, isMastered: res.isMastered } : q));
      refreshUser();
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['All', 'Technical', 'HR', 'DBMS', 'OOPs', 'Operating Systems'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Curated Interview Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Interview Question Bank & Answers</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Comprehensive, real-world technical and HR interview questions asked at Amazon, Google, Microsoft, TCS, and Infosys.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        {/* Categories */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white glass-panel border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords or concepts..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

      </div>

      {/* Questions Accordion List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Searching question catalog...</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No matching questions found.</div>
        ) : (
          questions.map((q) => {
            const isExpanded = expandedId === q.id;

            return (
              <div 
                key={q.id}
                className={`glass-panel rounded-2xl border transition overflow-hidden ${
                  q.isMastered ? 'border-emerald-500/30' : 'border-slate-800'
                }`}
              >
                {/* Header Strip */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="p-5 flex items-start justify-between cursor-pointer hover:bg-slate-800/40 transition gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {q.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        q.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : q.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {q.difficulty}
                      </span>
                      {(q.companyTags || []).map((c, i) => (
                        <span key={i} className="text-[10px] text-slate-400 font-semibold bg-slate-800/80 px-2 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 pt-1">
                    <button
                      onClick={(e) => handleToggleMaster(q.id, e)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                        q.isMastered
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'glass-panel border border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title="Mark question mastered"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{q.isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Answer */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-800/80 bg-slate-950/60 text-xs space-y-4 animate-in fade-in">
                    <div>
                      <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-[11px] mb-2">
                        Comprehensive Answer & Architectural Reasoning
                      </h4>
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-line text-xs font-sans">
                        {q.answer}
                      </div>
                    </div>

                    {q.keyConcepts && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-slate-400 font-bold text-[11px]">Key Concepts:</span>
                        {q.keyConcepts.map((kc, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold">
                            #{kc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
