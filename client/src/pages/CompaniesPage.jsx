import React, { useState, useEffect } from 'react';
import { 
  Building2, CheckCircle2, ChevronRight, HelpCircle, BookOpen, 
  Award, Clock, ArrowRight, Play, Sparkles, AlertCircle, FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CompaniesPage({ setActivePage }) {
  const { refreshUser } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('process'); // 'process' | 'tech' | 'hr' | 'aptitude' | 'test'
  const [loading, setLoading] = useState(true);

  // Mini Mock Test State
  const [testActive, setTestActive] = useState(false);
  const [testAnswers, setTestAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoading(true);
        const res = await api.getCompanies();
        setCompanies(res.companies || []);
        if (res.companies && res.companies.length > 0) {
          loadCompanyDetails(res.companies[0].id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, []);

  const loadCompanyDetails = async (id) => {
    try {
      const res = await api.getCompany(id);
      setSelectedCompany(id);
      setCompanyDetails(res.company);
      setActiveTab('process');
      setTestActive(false);
      setTestResult(null);
      setTestAnswers({});
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestOptionSelect = (qIdx, optIdx) => {
    setTestAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleTestSubmit = async () => {
    if (!companyDetails) return;
    setTestLoading(true);

    // Mock evaluation for 3 questions
    let score = 0;
    const totalQ = 3;
    if (testAnswers[0] !== undefined) score++;
    if (testAnswers[1] !== undefined) score++;
    if (testAnswers[2] !== undefined) score++;

    try {
      const res = await api.submitCompanyMock(companyDetails.id, {
        score,
        totalQuestions: totalQ,
        answers: testAnswers
      });
      setTestResult(res);
      confetti({ particleCount: 70, spread: 60 });
      refreshUser();
    } catch (e) {
      console.error(e);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Building2 className="w-4 h-4" />
          <span>Tier-1 & IT Giant Recruitment Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Company-Wise Placement Preparation</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Master the exact recruitment patterns, selection rounds, technical criteria, and sample questions for top hiring companies.
        </p>
      </div>

      {/* 10 Companies Horizontal Strip */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 text-xs">
        {companies.map((comp) => (
          <button
            key={comp.id}
            onClick={() => loadCompanyDetails(comp.id)}
            className={`p-3 rounded-2xl glass-panel border flex items-center space-x-3 whitespace-nowrap transition flex-shrink-0 ${
              selectedCompany === comp.id
                ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg'
                : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
              {comp.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="font-bold text-white text-xs leading-tight">{comp.name.split(' ')[0]}</p>
              <p className="text-[10px] text-slate-400">{comp.totalRounds} Rounds</p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Company Detail View */}
      {companyDetails && (
        <div className="space-y-6">
          
          {/* Company Overview Header Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">{companyDetails.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Actively Hiring
                </span>
              </div>
              
              {/* Cadres & Packages */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {(companyDetails.cadres || []).map((cadre, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-indigo-300 text-xs font-bold">
                    {cadre}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligibility Quick Pill */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-700 text-xs space-y-1 min-w-[240px]">
              <p className="font-bold text-slate-200">Eligibility Criteria:</p>
              <p className="text-slate-400 text-[11px]">&bull; CGPA: <strong className="text-white">{companyDetails.eligibility?.cgpa}</strong></p>
              <p className="text-slate-400 text-[11px]">&bull; Backlogs: <strong className="text-white">{companyDetails.eligibility?.backlogs}</strong></p>
              <p className="text-slate-400 text-[11px]">&bull; Branches: <strong className="text-white">{companyDetails.eligibility?.branches}</strong></p>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-xs font-bold">
            {[
              { id: 'process', label: 'Selection Process & Rounds' },
              { id: 'tech', label: `Technical Questions (${(companyDetails.technicalQuestions || []).length})` },
              { id: 'aptitude', label: 'Company Aptitude' },
              { id: 'hr', label: 'HR & Behavioral' },
              { id: 'tips', label: 'Preparation Tips' },
              { id: 'test', label: 'Practice Mock Test' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white glass-panel border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Selection Process & Rounds */}
          {activeTab === 'process' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
              {(companyDetails.selectionProcess || []).map((round, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-3xl border border-slate-800 relative space-y-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-extrabold text-white">{round.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{round.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Technical Questions */}
          {activeTab === 'tech' && (
            <div className="space-y-4 animate-in fade-in">
              {(companyDetails.technicalQuestions || []).map((tq, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-white text-sm">Q{idx + 1}: {tq.q}</p>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-300 leading-relaxed font-mono text-[11px]">
                    {tq.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Aptitude Questions */}
          {activeTab === 'aptitude' && (
            <div className="space-y-4 animate-in fade-in">
              {(companyDetails.aptitudeQuestions || []).map((aq, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-white text-sm">Aptitude Q{idx + 1}: {aq.q}</p>
                  <p className="text-emerald-400 font-semibold pl-3 border-l-2 border-emerald-500">
                    Solution: {aq.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: HR Questions */}
          {activeTab === 'hr' && (
            <div className="space-y-4 animate-in fade-in">
              {(companyDetails.hrQuestions || []).map((hq, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-white text-sm">HR Interview Q{idx + 1}: {hq.q}</p>
                  <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/50 text-indigo-200 leading-relaxed text-xs">
                    <strong>Winning Model Answer:</strong> {hq.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: Preparation Tips */}
          {activeTab === 'tips' && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 animate-in fade-in text-xs">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider text-amber-400">
                Toppers' Playbook for {companyDetails.name}
              </h3>
              <ul className="space-y-3 text-slate-300">
                {(companyDetails.prepTips || []).map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB 6: Company Practice Mock Test */}
          {activeTab === 'test' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {companyDetails.name} Placement Simulation Mock Test
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">3 Sample Questions &bull; Timed Exam Pattern</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-extrabold text-xs">
                  +60 XP Reward
                </span>
              </div>

              {testResult ? (
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 text-center space-y-3">
                  <Award className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Test Completed!</h4>
                  <p className="text-xs text-emerald-300">{testResult.message}</p>
                  <button
                    onClick={() => {
                      setTestResult(null);
                      setTestAnswers({});
                    }}
                    className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    Retake Test
                  </button>
                </div>
              ) : (
                <div className="space-y-6 text-xs">
                  {/* Q1 */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <p className="font-bold text-white">1. Which data structure guarantees O(1) average lookup and insertion time?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Binary Search Tree', 'Hash Map', 'Linked List', 'AVL Tree'].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleTestOptionSelect(0, i)}
                          className={`p-2.5 rounded-xl border text-left font-semibold transition ${
                            testAnswers[0] === i ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 border-slate-700 text-slate-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <p className="font-bold text-white">2. What is the primary difference between processes and threads?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Threads have separate address spaces',
                        'Processes share heap memory',
                        'Threads share process address space',
                        'There is no difference'
                      ].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleTestOptionSelect(1, i)}
                          className={`p-2.5 rounded-xl border text-left font-semibold transition ${
                            testAnswers[1] === i ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 border-slate-700 text-slate-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q3 */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <p className="font-bold text-white">3. What is the worst-case time complexity of Quick Sort?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['O(N log N)', 'O(N^2)', 'O(N)', 'O(log N)'].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleTestOptionSelect(2, i)}
                          className={`p-2.5 rounded-xl border text-left font-semibold transition ${
                            testAnswers[2] === i ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 border-slate-700 text-slate-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleTestSubmit}
                    disabled={testLoading}
                    className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition"
                  >
                    {testLoading ? 'Scoring Test...' : 'Submit Answers & Calculate Score'}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
