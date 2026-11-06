import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Video, Award, Calendar, Clock, ChevronDown, ChevronUp, 
  CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Printer, BookOpen, ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export default function InterviewHistoryPage({ setActivePage }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getInterviewHistory();
      setHistory(res.interviews || []);
      if (res.interviews && res.interviews.length > 0) {
        setExpandedId(res.interviews[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => setActivePage('interview')}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to AI Mock Interview Arena</span>
          </button>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Video className="w-4 h-4" />
            <span>Session Archives & Performance Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Mock Interview History</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Review detailed AI evaluations, scoring breakdowns, recorded answers, and tailored growth tips from your previous mock interview sessions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchHistory}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 glass-panel border border-slate-700 hover:bg-slate-800 transition flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 glass-panel border border-slate-700 hover:bg-slate-800 transition flex items-center space-x-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => setActivePage('interview')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start New Interview</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading your interview records...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Video className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Mock Interviews Completed Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Experience realistic technical and HR interview rounds with interactive AI feedback. Complete your first session to unlock deep performance metrics.
          </p>
          <button
            onClick={() => setActivePage('interview')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition"
          >
            Take Your First Mock Interview
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => {
            const isExpanded = expandedId === item.id;
            const scoreColor = item.overallScore >= 80 ? 'text-emerald-400' : item.overallScore >= 60 ? 'text-amber-400' : 'text-rose-400';

            return (
              <div 
                key={item.id}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition-all duration-200"
              >
                {/* Accordion Header */}
                <div 
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/30 transition"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-white text-base">{item.role || 'Full Stack Developer'}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.interviewType || 'Technical Interview'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(item.completedAt || item.startedAt).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.answers?.length || 0} Questions Evaluated</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Overall AI Score</p>
                      <p className={`text-2xl font-black ${scoreColor}`}>{item.overallScore}%</p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-800 bg-slate-950/40 space-y-6">
                    
                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                        <h4 className="font-extrabold text-emerald-400 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Key Strengths Identified</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                          {(item.strengths || ['Good clarity and confidence in explanation']).map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                        <h4 className="font-extrabold text-amber-400 flex items-center space-x-1.5">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Areas for Improvement</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                          {(item.weaknesses || ['Incorporate specific real-world metrics and edge-case handling']).map((w, idx) => (
                            <li key={idx}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Question by Question Review */}
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-white text-sm">Question & Response Breakdown</h4>
                      <div className="space-y-3">
                        {(item.answers || []).map((ans, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-400">Question {idx + 1}</span>
                              <span className="font-extrabold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                                Score: {ans.score}%
                              </span>
                            </div>
                            <p className="font-semibold text-white">{ans.question}</p>
                            
                            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                              <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Your Submitted Response:</p>
                              <p className="italic">{ans.userAnswer || 'No response recorded'}</p>
                            </div>

                            {ans.tips && (
                              <p className="text-cyan-400 text-[11px]">
                                <span className="font-semibold">AI Tip:</span> {ans.tips}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
