import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Code, Video, Brain, FileText, CheckCircle2, Clock, 
  Flame, Award, TrendingUp, Calendar, ChevronRight, Play, BookOpen, Target, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function DashboardPage({ setActivePage }) {
  const { user, progress, refreshUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic greeting based on current time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [lbRes, tasksRes, intRes] = await Promise.all([
          api.getLeaderboard().catch(() => ({ leaderboard: [] })),
          api.getTasks().catch(() => ({ tasks: [] })),
          api.getInterviewHistory().catch(() => ({ history: [] }))
        ]);
        setLeaderboard(lbRes.leaderboard || []);
        setTasks(tasksRes.tasks || []);
        setInterviews(intRes.history || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const stats = progress?.stats || {
    questionsSolved: 14,
    learningHours: 32,
    testsTaken: 8,
    mockInterviewsCount: 3,
    overallCompletionPct: 42
  };

  const dailyGoalTarget = user?.dailySolvedGoal || 3;
  const dailyGoalCurrent = Math.min(dailyGoalTarget, 2); // Sample current progress
  const dailyGoalPct = Math.round((dailyGoalCurrent / dailyGoalTarget) * 100);

  // Weekly activity simulation bars
  const weeklyData = [
    { day: 'Mon', problems: 4, height: '65%' },
    { day: 'Tue', problems: 6, height: '90%' },
    { day: 'Wed', problems: 3, height: '45%' },
    { day: 'Thu', problems: 5, height: '75%' },
    { day: 'Fri', problems: 7, height: '100%' },
    { day: 'Sat', problems: 2, height: '30%' },
    { day: 'Sun', problems: dailyGoalCurrent, height: `${dailyGoalPct}%` }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Top Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-transparent blur-[80px] pointer-events-none"></div>

        <div className="flex items-center space-x-4 sm:space-x-5 z-10">
          <div className="relative">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.fullName || 'Student')}`}
              alt={user?.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400 shadow-xl"
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-indigo-600 text-[10px] font-extrabold text-white">
              Lvl {user?.level || 1}
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {greeting}, {user?.fullName || 'Student'}!
              </h1>
              <span className="text-xl">🚀</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Targeting: <span className="text-indigo-400 font-semibold">{user?.targetCompanies?.join(', ') || 'Top Tech Giants'}</span> &bull; {user?.department || 'Computer Science'}
            </p>
            <div className="flex items-center space-x-3 mt-2 text-xs">
              <span className="flex items-center space-x-1 text-amber-400 font-bold">
                <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
                <span>{user?.streakDays || 1} Day Streak</span>
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-indigo-300 font-bold">{user?.xp || 0} Total XP</span>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10 w-full md:w-auto">
          <button
            onClick={() => setActivePage('interview')}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-600/30 transition flex items-center justify-center space-x-1.5"
          >
            <Video className="w-3.5 h-3.5" />
            <span>AI Mock Interview</span>
          </button>
          <button
            onClick={() => setActivePage('coding')}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 glass-panel border border-slate-700 hover:bg-slate-800 transition flex items-center justify-center space-x-1.5"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Daily Coding</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Solved Problems */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{stats.questionsSolved}</p>
            <p className="text-xs text-slate-400">Coding Solved</p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+3 this week</p>
          </div>
        </div>

        {/* Learning Hours */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{stats.learningHours} hrs</p>
            <p className="text-xs text-slate-400">Total Learning</p>
            <p className="text-[10px] text-purple-400 font-semibold mt-0.5">Top 15% campus pace</p>
          </div>
        </div>

        {/* Prep Completion */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{stats.overallCompletionPct}%</p>
            <p className="text-xs text-slate-400">Roadmap Progress</p>
            <p className="text-[10px] text-indigo-400 font-semibold mt-0.5">Core CS + Programming</p>
          </div>
        </div>

        {/* Daily Goal Ring */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{dailyGoalCurrent}/{dailyGoalTarget}</p>
            <p className="text-xs text-slate-400">Daily Study Goal</p>
            <p className="text-[10px] text-amber-400 font-semibold mt-0.5">1 more to keep streak</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Weekly Activity Chart & Upcoming + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Activity Chart & Recent Tests */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Weekly Activity Bar Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-white text-base">Weekly Activity & Practice Output</h3>
                <p className="text-xs text-slate-400 mt-0.5">Problems solved and mock interview sessions over the last 7 days</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300">
                27 Problems this week
              </span>
            </div>

            {/* Simulated interactive bar chart */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition px-2 py-0.5 rounded bg-slate-800 text-[10px] text-white border border-slate-700 whitespace-nowrap pointer-events-none">
                    {d.problems} solved
                  </div>
                  {/* Bar */}
                  <div 
                    style={{ height: d.height }} 
                    className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-blue-600 via-indigo-600 to-cyan-400 group-hover:brightness-125 transition-all duration-300 shadow-md shadow-indigo-500/20"
                  ></div>
                  <span className="text-[11px] font-semibold text-slate-400 mt-2">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
              <span>Low Activity</span>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded bg-blue-600"></span>
                <span>Normal</span>
                <span className="w-3 h-3 rounded bg-cyan-400"></span>
                <span>Peak Performance</span>
              </div>
            </div>
          </div>

          {/* Quick Action Hubs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div 
              onClick={() => setActivePage('roadmap')}
              className="glass-card p-5 rounded-2xl cursor-pointer group flex items-start space-x-4 border border-slate-800"
            >
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-110 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition flex items-center justify-between">
                  <span>Continue Roadmap</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
                </h4>
                <p className="text-xs text-slate-400 mt-1">Next up: Dynamic Programming & Binary Trees</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setActivePage('resume')}
              className="glass-card p-5 rounded-2xl cursor-pointer group flex items-start space-x-4 border border-slate-800"
            >
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition flex items-center justify-between">
                  <span>ATS Resume Score</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
                </h4>
                <p className="text-xs text-slate-400 mt-1">Current Score: 88/100 (Strong ATS Match)</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>

          </div>

          {/* Recent Mock Interviews History */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Recent AI Mock Interview Sessions</h3>
              <div className="flex items-center space-x-3 text-xs">
                <button 
                  onClick={() => setActivePage('interview-history')}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  View Archives
                </button>
                <button 
                  onClick={() => setActivePage('interview')}
                  className="text-indigo-400 hover:underline font-semibold"
                >
                  Start New Session &rarr;
                </button>
              </div>
            </div>

            {interviews.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No interview sessions recorded yet. Try your first session now!
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {interviews.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{item.role} - {item.interviewType}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.totalQuestions} questions &bull; {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${item.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {item.score}% Score
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Study Planner Tasks & Achievements */}
        <div className="space-y-8">
          
          {/* Daily Study Planner Widget */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Study Planner</h3>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setActivePage('calendar')}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  Calendar Grid
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => setActivePage('planner')}
                  className="text-indigo-400 hover:underline font-semibold"
                >
                  Planner
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((task) => (
                <div 
                  key={task.id}
                  className={`p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                    task.completed 
                      ? 'bg-slate-900/40 border-slate-800/60 text-slate-500 line-through' 
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                    <span className="font-medium truncate max-w-[180px]">{task.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{task.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Badges Showcase */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Milestone Badges</h3>
              </div>
              <button
                onClick={() => setActivePage('leaderboard')}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                All Badges
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                <Flame className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-pulse" />
                <p className="text-xs font-bold text-white">6-Day Streak</p>
                <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Active</p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-center">
                <Code className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-white">First Milestone</p>
                <p className="text-[10px] text-indigo-400 font-semibold mt-0.5">Unlocked</p>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                <Video className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-white">Mock Ace</p>
                <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">Score &gt; 80%</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center opacity-60">
                <Award className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-300">Code Warrior</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">14/20 Solved</p>
              </div>
            </div>
          </div>

          {/* Recommended Topics */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <h3 className="font-bold text-white text-sm mb-3">Recommended Review</h3>
            <div className="space-y-2 text-xs">
              <div 
                onClick={() => setActivePage('roadmap')}
                className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white">B+ Tree Indexing</p>
                  <p className="text-[10px] text-slate-400">DBMS & SQL Architecture</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div 
                onClick={() => setActivePage('coding')}
                className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white">Sliding Window Maximum</p>
                  <p className="text-[10px] text-slate-400">Two Pointers & Deque</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
