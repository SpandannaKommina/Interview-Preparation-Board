import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Code, Video, FileText, CheckCircle2, 
  AlertCircle, Activity, Server, Database, Sparkles, RefreshCw, 
  Plus, Trash2, Edit3, Search, Filter, X, BarChart3, BookOpen, 
  TrendingUp, Send, Check, Layers, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPage({ initialTab = 'dashboard' }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab); // 'dashboard' | 'users' | 'questions' | 'content' | 'analytics'
  const [data, setData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [questionsData, setQuestionsData] = useState({ codingQuestions: [], interviewQuestions: [], aptitudeQuestions: [] });
  const [roadmapsList, setRoadmapsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & filter
  const [userSearch, setUserSearch] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');

  // Modals state
  const [addUserModal, setAddUserModal] = useState(false);
  const [addCodingModal, setAddCodingModal] = useState(false);
  const [addInterviewModal, setAddInterviewModal] = useState(false);
  const [addAptitudeModal, setAddAptitudeModal] = useState(false);
  const [announcementModal, setAnnouncementModal] = useState(false);

  // Forms state
  const [newUserData, setNewUserData] = useState({ fullName: '', email: '', password: '', role: 'student', college: '', degree: 'B.Tech' });
  const [newCodingData, setNewCodingData] = useState({ title: '', difficulty: 'Medium', topic: 'Arrays & Strings', description: '', companies: 'Google, Amazon' });
  const [newInterviewData, setNewInterviewData] = useState({ question: '', category: 'Technical Interview', role: 'Full Stack Developer', difficulty: 'Medium', answerGuideline: '' });
  const [newAptitudeData, setNewAptitudeData] = useState({ category: 'Quantitative Aptitude', question: '', opt0: '', opt1: '', opt2: '', opt3: '', correctAnswer: 0, explanation: '' });
  const [announcementData, setAnnouncementData] = useState({ title: '', message: '' });

  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, qRes, rmRes, anaRes] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getAdminUsers().catch(() => ({ users: [] })),
        api.getAdminQuestions().catch(() => ({ codingQuestions: [], interviewQuestions: [], aptitudeQuestions: [] })),
        api.getRoadmaps().catch(() => ({ roadmaps: [] })),
        api.getAdminAnalytics().catch(() => null)
      ]);

      if (statsRes) setData(statsRes);
      if (usersRes) setUsersList(usersRes.users || []);
      if (qRes) setQuestionsData(qRes);
      if (rmRes) setRoadmapsList(rmRes.roadmaps || []);
      if (anaRes) setAnalyticsData(anaRes.analytics || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-panel rounded-3xl text-center space-y-4">
        <Shield className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-white">Access Restricted</h2>
        <p className="text-xs text-slate-400">
          This portal requires Placement Administrator authorization. Please sign in with an administrator account (e.g. admin@interviewprep.com).
        </p>
      </div>
    );
  }

  // Handle Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    setActionMessage('');
    setActionError('');
    try {
      await api.createAdminUser(newUserData);
      setActionMessage('New candidate registered successfully!');
      setAddUserModal(false);
      setNewUserData({ fullName: '', email: '', password: '', role: 'student', college: '', degree: 'B.Tech' });
      fetchAdminData();
    } catch (err) {
      setActionError(err.message || 'Failed to create user.');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user account?')) return;
    try {
      await api.deleteAdminUser(userId);
      setActionMessage('User removed successfully.');
      fetchAdminData();
    } catch (err) {
      setActionError(err.message || 'Failed to delete user.');
    }
  };

  // Handle Add Coding Question
  const handleAddCoding = async (e) => {
    e.preventDefault();
    setActionMessage('');
    try {
      const companiesArr = newCodingData.companies.split(',').map(s => s.trim()).filter(Boolean);
      await api.createCodingQuestion({
        title: newCodingData.title,
        difficulty: newCodingData.difficulty,
        topic: newCodingData.topic,
        description: newCodingData.description,
        companies: companiesArr
      });
      setActionMessage('Coding problem published successfully!');
      setAddCodingModal(false);
      setNewCodingData({ title: '', difficulty: 'Medium', topic: 'Arrays & Strings', description: '', companies: 'Google, Amazon' });
      fetchAdminData();
    } catch (err) {
      setActionError(err.message || 'Failed to add coding question.');
    }
  };

  // Handle Delete Coding Question
  const handleDeleteCoding = async (id) => {
    if (!window.confirm('Delete this coding problem?')) return;
    try {
      await api.deleteCodingQuestion(id);
      setActionMessage('Coding problem deleted.');
      fetchAdminData();
    } catch (err) {
      setActionError(err.message || 'Failed to delete question.');
    }
  };

  // Handle Add Aptitude Question
  const handleAddAptitude = async (e) => {
    e.preventDefault();
    setActionMessage('');
    try {
      await api.createAptitudeQuestion({
        category: newAptitudeData.category,
        question: newAptitudeData.question,
        options: [newAptitudeData.opt0, newAptitudeData.opt1, newAptitudeData.opt2, newAptitudeData.opt3],
        correctAnswer: Number(newAptitudeData.correctAnswer),
        explanation: newAptitudeData.explanation
      });
      setActionMessage('Aptitude question added to test bank!');
      setAddAptitudeModal(false);
      setNewAptitudeData({ category: 'Quantitative Aptitude', question: '', opt0: '', opt1: '', opt2: '', opt3: '', correctAnswer: 0, explanation: '' });
      fetchAdminData();
    } catch (err) {
      setActionError(err.message || 'Failed to add aptitude question.');
    }
  };

  // Handle Broadcast Announcement
  const handleBroadcast = async (e) => {
    e.preventDefault();
    setActionMessage('');
    try {
      const res = await api.broadcastAnnouncement(announcementData);
      setActionMessage(res.message || 'Announcement broadcast successfully!');
      setAnnouncementModal(false);
      setAnnouncementData({ title: '', message: '' });
    } catch (err) {
      setActionError(err.message || 'Failed to broadcast announcement.');
    }
  };

  const stats = data?.stats || {
    totalUsers: usersList.length || 2,
    studentCount: 1,
    adminCount: 1,
    totalSubmissions: 45,
    passRate: 92,
    totalInterviews: 18,
    totalCodingQuestions: questionsData.codingQuestions?.length || 10,
    totalAptitudeQuestions: questionsData.aptitudeQuestions?.length || 12,
    totalRoadmaps: roadmapsList.length || 13,
    systemHealth: 'Optimal (100%)',
    apiStatus: 'Online (200 OK)'
  };

  const filteredUsers = usersList.filter(u => 
    u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.college?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>Placement Officer & Platform Administration Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Administration Command Center</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Manage student registrations, curate technical questions, broadcast campus recruitment bulletins, and monitor placement metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAnnouncementModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-amber-600/30 transition flex items-center space-x-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Bulletin</span>
          </button>

          <button
            onClick={fetchAdminData}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 glass-panel border border-slate-700 hover:bg-slate-800 transition flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Admin Sub-Pages Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs">
        {[
          { id: 'dashboard', label: 'Dashboard & Telemetry', icon: Activity },
          { id: 'users', label: 'User Management', icon: Users, count: usersList.length },
          { id: 'questions', label: 'Question Bank Management', icon: Code, count: (questionsData.codingQuestions?.length || 0) + (questionsData.aptitudeQuestions?.length || 0) },
          { id: 'content', label: 'Learning Roadmaps', icon: BookOpen, count: roadmapsList.length || 13 },
          { id: 'analytics', label: 'Placement Analytics', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActionMessage(''); setActionError(''); }}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition ${
                isActive
                  ? 'bg-gradient-to-r from-amber-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'glass-panel border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-900 text-[10px] text-slate-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD & TELEMETRY */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.totalUsers}</p>
                <p className="text-xs text-slate-400">Total Enrolled</p>
                <p className="text-[10px] text-emerald-400 font-bold mt-0.5">{stats.studentCount} Active Students</p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.totalInterviews}</p>
                <p className="text-xs text-slate-400">Mock Interviews</p>
                <p className="text-[10px] text-cyan-400 font-bold mt-0.5">AI Evaluated</p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.totalCodingQuestions}</p>
                <p className="text-xs text-slate-400">Coding Challenges</p>
                <p className="text-[10px] text-purple-400 font-bold mt-0.5">{stats.passRate}% Pass Rate</p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-400">100%</p>
                <p className="text-xs text-slate-400">System Telemetry</p>
                <p className="text-[10px] text-emerald-400 font-bold mt-0.5">13 Roadmaps Online</p>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => setActiveTab('users')}
              className="p-6 rounded-3xl glass-panel border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition space-y-2 group"
            >
              <Users className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition" />
              <h3 className="font-extrabold text-white text-base">Candidate Directory</h3>
              <p className="text-xs text-slate-400">Inspect student GPA, skill profiles, and completed roadmaps.</p>
            </div>

            <div 
              onClick={() => setActiveTab('questions')}
              className="p-6 rounded-3xl glass-panel border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition space-y-2 group"
            >
              <Code className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition" />
              <h3 className="font-extrabold text-white text-base">Question Management</h3>
              <p className="text-xs text-slate-400">Publish new LeetCode-style algorithms and aptitude tests.</p>
            </div>

            <div 
              onClick={() => setActiveTab('analytics')}
              className="p-6 rounded-3xl glass-panel border border-slate-800 hover:border-amber-500/50 cursor-pointer transition space-y-2 group"
            >
              <BarChart3 className="w-6 h-6 text-amber-400 group-hover:scale-110 transition" />
              <h3 className="font-extrabold text-white text-base">Telemetry & Analytics</h3>
              <p className="text-xs text-slate-400">Monitor language adoption, success metrics, and active streaks.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search candidate by name, email, or college..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => setAddUserModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register Candidate / Admin</span>
            </button>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                  <th className="pb-3 px-3">Candidate</th>
                  <th className="pb-3 px-3">Role</th>
                  <th className="pb-3 px-3">College & Degree</th>
                  <th className="pb-3 px-3">CGPA</th>
                  <th className="pb-3 px-3">XP & Level</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 flex items-center space-x-2.5">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.fullName)}`}
                        alt={u.fullName}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                      />
                      <div>
                        <p className="font-bold text-white">{u.fullName}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <p className="font-semibold">{u.degree} - {u.department}</p>
                      <p className="text-[10px] text-slate-500">{u.college}</p>
                    </td>
                    <td className="py-3 px-3 font-bold text-cyan-400">
                      {u.cgpa || 'N/A'}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-extrabold text-indigo-400">{u.xp || 0} XP</p>
                      <p className="text-[10px] text-slate-500">Lvl {u.level || 1} • {u.streakDays || 1}d Streak</p>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          title="Delete User"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QUESTION MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-extrabold text-white text-lg">Curated Technical & Aptitude Question Banks</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAddCodingModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Coding Question</span>
              </button>
              <button
                onClick={() => setAddAptitudeModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-600/30 flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Aptitude MCQ</span>
              </button>
            </div>
          </div>

          {/* Coding Problems Table */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm">Coding Challenges Pool ({questionsData.codingQuestions?.length || 0})</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="pb-3 px-3">Problem Title</th>
                    <th className="pb-3 px-3">Difficulty</th>
                    <th className="pb-3 px-3">Topic</th>
                    <th className="pb-3 px-3">Company Tags</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(questionsData.codingQuestions || []).map((q) => (
                    <tr key={q.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-3 font-bold text-white">{q.title}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          q.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                          q.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{q.topic}</td>
                      <td className="py-3 px-3 text-slate-400">
                        {Array.isArray(q.companies) ? q.companies.slice(0, 3).join(', ') : q.companies}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteCoding(q.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Aptitude Questions Table */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm">Aptitude & Reasoning MCQs ({questionsData.aptitudeQuestions?.length || 0})</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Question Excerpt</th>
                    <th className="pb-3 px-3">Correct Option</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(questionsData.aptitudeQuestions || []).map((q) => (
                    <tr key={q.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-3 font-semibold text-cyan-400">{q.category}</td>
                      <td className="py-3 px-3 text-white max-w-md truncate">{q.question}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">
                        {q.options?.[q.correctAnswer] || `Option ${q.correctAnswer + 1}`}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete aptitude question?')) {
                              await api.deleteAptitudeQuestion(q.id);
                              fetchAdminData();
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LEARNING ROADMAPS */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-white text-lg">Curriculum Categories ({roadmapsList.length} Tracks)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmapsList.map((rm) => (
              <div key={rm.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {rm.category}
                  </span>
                  <span className="text-xs font-bold text-cyan-400">
                    {rm.topics?.length || 0} Topics
                  </span>
                </div>
                <h4 className="font-extrabold text-white text-base">{rm.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{rm.description}</p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                  {(rm.topics || []).slice(0, 3).map((t, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PLACEMENT ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Programming Language Popularity */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Language Usage Share</span>
              </h4>
              <div className="space-y-3 text-xs">
                {[
                  { lang: 'Python', pct: 65, color: 'bg-yellow-500' },
                  { lang: 'Java', pct: 18, color: 'bg-orange-500' },
                  { lang: 'C++', pct: 12, color: 'bg-blue-500' },
                  { lang: 'C', pct: 5, color: 'bg-cyan-500' }
                ].map((l) => (
                  <div key={l.lang} className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-semibold">
                      <span>{l.lang}</span>
                      <span>{l.pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${l.color}`} style={{ width: `${l.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Percentiles */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Student Score Distribution</span>
              </h4>
              <div className="space-y-3 text-xs">
                {[
                  { tier: 'Top Tier (90% - 100%)', students: 12, pct: 40 },
                  { tier: 'Proficient (75% - 89%)', students: 15, pct: 45 },
                  { tier: 'Intermediate (60% - 74%)', students: 5, pct: 15 }
                ].map((t, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-semibold">
                      <span>{t.tier}</span>
                      <span className="text-emerald-400">{t.students} Candidates</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${t.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Activity */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Weekly Coding & Mock Runs</span>
              </h4>
              <div className="flex items-end justify-between h-36 pt-4 gap-2 text-[10px] text-slate-400">
                {[
                  { day: 'M', val: 50 },
                  { day: 'T', val: 75 },
                  { day: 'W', val: 60 },
                  { day: 'T', val: 90 },
                  { day: 'F', val: 80 },
                  { day: 'S', val: 100 },
                  { day: 'S', val: 85 }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div 
                      className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-cyan-400 hover:opacity-80 transition"
                      style={{ height: `${bar.val}%` }}
                    ></div>
                    <span>{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 1: ADD USER */}
      {addUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-white text-base">Register Candidate / Officer</h3>
              <button onClick={() => setAddUserModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input required type="text" value={newUserData.fullName} onChange={e => setNewUserData({...newUserData, fullName: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input required type="email" value={newUserData.email} onChange={e => setNewUserData({...newUserData, email: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
                <input required type="password" minLength={6} value={newUserData.password} onChange={e => setNewUserData({...newUserData, password: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role</label>
                  <select value={newUserData.role} onChange={e => setNewUserData({...newUserData, role: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white">
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Degree</label>
                  <input type="text" value={newUserData.degree} onChange={e => setNewUserData({...newUserData, degree: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">College / University</label>
                <input type="text" value={newUserData.college} onChange={e => setNewUserData({...newUserData, college: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition mt-2">
                Create User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CODING QUESTION */}
      {addCodingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 w-full max-w-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-white text-base">Publish Coding Challenge</h3>
              <button onClick={() => setAddCodingModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddCoding} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Problem Title</label>
                <input required type="text" value={newCodingData.title} onChange={e => setNewCodingData({...newCodingData, title: e.target.value})} placeholder="e.g. Invert Binary Tree" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
                  <select value={newCodingData.difficulty} onChange={e => setNewCodingData({...newCodingData, difficulty: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Topic</label>
                  <input required type="text" value={newCodingData.topic} onChange={e => setNewCodingData({...newCodingData, topic: e.target.value})} placeholder="e.g. Trees" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Tags (comma separated)</label>
                <input type="text" value={newCodingData.companies} onChange={e => setNewCodingData({...newCodingData, companies: e.target.value})} placeholder="Google, Amazon, TCS" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Problem Description</label>
                <textarea required rows={4} value={newCodingData.description} onChange={e => setNewCodingData({...newCodingData, description: e.target.value})} placeholder="Given the root of a binary tree, invert the tree, and return its root." className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition mt-2">
                Publish Problem
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD APTITUDE QUESTION */}
      {addAptitudeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 w-full max-w-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-white text-base">Add Aptitude Assessment MCQ</h3>
              <button onClick={() => setAddAptitudeModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddAptitude} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select value={newAptitudeData.category} onChange={e => setNewAptitudeData({...newAptitudeData, category: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white">
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="Logical Reasoning">Logical Reasoning</option>
                  <option value="Verbal Ability">Verbal Ability</option>
                  <option value="Data Interpretation">Data Interpretation</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question Text</label>
                <textarea required rows={2} value={newAptitudeData.question} onChange={e => setNewAptitudeData({...newAptitudeData, question: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Option 1" value={newAptitudeData.opt0} onChange={e => setNewAptitudeData({...newAptitudeData, opt0: e.target.value})} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
                <input required placeholder="Option 2" value={newAptitudeData.opt1} onChange={e => setNewAptitudeData({...newAptitudeData, opt1: e.target.value})} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
                <input required placeholder="Option 3" value={newAptitudeData.opt2} onChange={e => setNewAptitudeData({...newAptitudeData, opt2: e.target.value})} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
                <input required placeholder="Option 4" value={newAptitudeData.opt3} onChange={e => setNewAptitudeData({...newAptitudeData, opt3: e.target.value})} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Correct Answer Index</label>
                <select value={newAptitudeData.correctAnswer} onChange={e => setNewAptitudeData({...newAptitudeData, correctAnswer: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white">
                  <option value={0}>Option 1 is correct</option>
                  <option value={1}>Option 2 is correct</option>
                  <option value={2}>Option 3 is correct</option>
                  <option value={3}>Option 4 is correct</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Explanation</label>
                <textarea rows={2} value={newAptitudeData.explanation} onChange={e => setNewAptitudeData({...newAptitudeData, explanation: e.target.value})} placeholder="Step-by-step formula or reasoning" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition mt-2">
                Save Aptitude Question
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: BROADCAST ANNOUNCEMENT */}
      {announcementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-white text-base">Broadcast Campus Bulletin</h3>
              <button onClick={() => setAnnouncementModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bulletin Title</label>
                <input required type="text" value={announcementData.title} onChange={e => setAnnouncementData({...announcementData, title: e.target.value})} placeholder="e.g. Google Summer SDE Hiring Drive Opens" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Announcement Details</label>
                <textarea required rows={4} value={announcementData.message} onChange={e => setAnnouncementData({...announcementData, message: e.target.value})} placeholder="Include eligibility criteria, online test timeline, and link to register." className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 transition mt-2">
                Broadcast to All Registered Students
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
