import React, { useState, useEffect } from 'react';
import { 
  Map, CheckCircle2, Circle, ChevronDown, ChevronUp, Copy, Check, 
  Code2, Cpu, Coffee, Terminal, Binary, Database, Sliders, Network, Brain, Sparkles, BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RoadmapPage({ setActivePage }) {
  const { refreshUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [overallStats, setOverallStats] = useState({ totalTopics: 0, completedTopics: 0, completionPct: 0 });
  const [activeTab, setActiveTab] = useState('All');
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await api.getRoadmaps();
      setCategories(res.categories || []);
      setCompletedTopics(res.completedTopics || []);
      setOverallStats(res.stats || { totalTopics: 0, completedTopics: 0, completionPct: 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleToggleTopic = async (topicId, e) => {
    e.stopPropagation();
    try {
      const res = await api.toggleRoadmapTopic(topicId);
      setCompletedTopics(res.completedTopics || []);
      setOverallStats(prev => ({
        ...prev,
        completedTopics: res.completedTopics.length,
        completionPct: res.overallCompletionPct
      }));
      refreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyCode = (id, code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const tabOptions = ['All', ...new Set(categories.map(c => c.category || 'General'))];

  const filteredCategories = activeTab === 'All' 
    ? categories 
    : categories.filter(c => c.category === activeTab);

  const getCategoryIcon = (id) => {
    switch(id) {
      case 'prog_c': return <Code2 className="w-5 h-5" />;
      case 'prog_cpp': return <Cpu className="w-5 h-5" />;
      case 'prog_java': return <Coffee className="w-5 h-5" />;
      case 'prog_python': return <Terminal className="w-5 h-5" />;
      case 'cs_dsa': return <Binary className="w-5 h-5" />;
      case 'cs_dbms': return <Database className="w-5 h-5" />;
      case 'cs_os': return <Sliders className="w-5 h-5" />;
      case 'cs_networks': return <Network className="w-5 h-5" />;
      case 'cs_oops': return <Binary className="w-5 h-5" />;
      case 'cs_sql': return <Database className="w-5 h-5" />;
      case 'prep_aptitude': return <Brain className="w-5 h-5" />;
      case 'prep_logical': return <Sparkles className="w-5 h-5" />;
      case 'prep_verbal': return <BookOpen className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header & Stats Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-3 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Structured Placement Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus & SDE Placement Curriculum</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Follow our battle-tested placement roadmap covering Programming, Data Structures, Algorithms, Core Computer Science, and Aptitude.
          </p>
        </div>

        {/* Overall Completion Metric Card */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-700/80 min-w-[220px] text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Overall Progress</p>
          <p className="text-3xl font-extrabold text-white mt-1">{overallStats.completionPct}%</p>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${overallStats.completionPct}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-indigo-400 font-medium mt-1.5">
            {completedTopics.length} of {overallStats.totalTopics} topics mastered
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white glass-panel border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="space-y-8">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading curriculum roadmap...</div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-2xl bg-gradient-to-tr ${cat.color} text-white shadow-lg`}>
                    {getCategoryIcon(cat.id)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-extrabold text-white">{cat.title}</h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {cat.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                  </div>
                </div>

                {/* Progress bar per category */}
                <div className="flex items-center space-x-3 min-w-[180px]">
                  <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all" 
                      style={{ width: `${cat.completionPct}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-300">{cat.completionPct}%</span>
                </div>
              </div>

              {/* Topics List */}
              <div className="space-y-3 pt-2">
                {(cat.topics || []).map((top) => {
                  const isCompleted = completedTopics.includes(top.id);
                  const isExpanded = expandedTopic === top.id;

                  return (
                    <div 
                      key={top.id}
                      className={`rounded-2xl border transition overflow-hidden ${
                        isCompleted 
                          ? 'bg-slate-900/40 border-slate-800/80' 
                          : 'glass-card border-slate-800'
                      }`}
                    >
                      {/* Topic Title Bar */}
                      <div 
                        onClick={() => setExpandedTopic(isExpanded ? null : top.id)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={(e) => handleToggleTopic(top.id, e)}
                            className="text-slate-400 hover:scale-110 transition flex-shrink-0"
                            title={isCompleted ? 'Mark as uncompleted' : 'Mark as completed (+30 XP)'}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-600 hover:text-indigo-400" />
                            )}
                          </button>
                          <div>
                            <h3 className={`text-sm font-bold ${isCompleted ? 'text-slate-300 line-through opacity-80' : 'text-white'}`}>
                              {top.title}
                            </h3>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {(top.subtopics || []).map((sub, sIdx) => (
                                <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400">
                                  {sub}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-slate-400">
                          <span className="text-[11px] font-semibold hidden sm:inline">
                            {isExpanded ? 'Hide Details' : 'View Notes & Code'}
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Expanded Content: Explanation, Code Example, Practice Questions */}
                      {isExpanded && (
                        <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-5 text-xs animate-in fade-in">
                          
                          {/* Conceptual Explanation */}
                          <div>
                            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1.5 text-indigo-400">
                              Core Explanation
                            </h4>
                            <p className="text-slate-300 leading-relaxed text-xs">
                              {top.explanation}
                            </p>
                          </div>

                          {/* Code Example */}
                          {top.codeExample && (
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-400">
                                  Syntax & Implementation Example
                                </h4>
                                <button
                                  onClick={(e) => handleCopyCode(top.id, top.codeExample, e)}
                                  className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 px-2 py-1 rounded bg-slate-800/80 border border-slate-700"
                                >
                                  {copiedCodeId === top.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy Code</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto font-mono text-[12px] text-cyan-200 leading-relaxed">
                                <code>{top.codeExample}</code>
                              </pre>
                            </div>
                          )}

                          {/* Practice Interview Questions */}
                          {top.practiceQuestions && top.practiceQuestions.length > 0 && (
                            <div>
                              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-amber-400">
                                Interview Practice Questions
                              </h4>
                              <div className="space-y-2">
                                {top.practiceQuestions.map((pq, qIdx) => (
                                  <div key={qIdx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                                    <p className="font-bold text-slate-200">Q: {pq.q}</p>
                                    <p className="text-slate-400 mt-1 leading-relaxed pl-3 border-l-2 border-indigo-500/50">
                                      {pq.a}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick Completion Footer */}
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">
                              Status: <strong className={isCompleted ? 'text-emerald-400' : 'text-slate-300'}>{isCompleted ? 'Completed (+30 XP)' : 'In Progress'}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleToggleTopic(top.id, e)}
                              className={`px-4 py-1.5 rounded-xl font-bold text-xs transition ${
                                isCompleted
                                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                              }`}
                            >
                              {isCompleted ? 'Mark as Incomplete' : 'Mark Completed (+30 XP)'}
                            </button>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
