import React, { useState, useEffect } from 'react';
import { 
  Trophy, Medal, Flame, Award, Sparkles, Star, 
  Crown, TrendingUp, CheckCircle2, Lock, Shield
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGamification() {
      try {
        setLoading(true);
        const res = await api.getLeaderboard();
        setLeaderboard(res.leaderboard || []);
        setBadges(res.badges || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchGamification();
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300 fill-slate-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600 fill-amber-600" />;
    return <span className="font-extrabold text-slate-400 text-xs">#{rank}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4" />
            <span>Campus Placement Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Leaderboard & Achievements</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Compete with students across colleges, unlock milestone badges, maintain learning streaks, and boost your campus ranking.
          </p>
        </div>

        {/* Current User Standing Card */}
        {user && (
          <div className="glass-panel p-4 rounded-2xl border border-indigo-500/40 min-w-[220px] text-center">
            <p className="text-xs text-slate-400 font-semibold uppercase">Your Current Score</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">{user.xp || 0} XP</p>
            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-amber-400 mt-1">
              <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
              <span>{user.streakDays || 1} Day Streak &bull; Level {user.level || 1}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Leaderboard (7 cols) & Badges + Rules (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Rankings Table (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-base">Top Performing Students</h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
              Live Standings
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {leaderboard.map((student) => {
              const isCurrentUser = user && user.id === student.id;

              return (
                <div 
                  key={student.id}
                  className={`py-3.5 px-3 rounded-2xl flex items-center justify-between transition ${
                    isCurrentUser ? 'bg-indigo-950/40 border border-indigo-500/30' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-7 flex items-center justify-center">
                      {getRankBadge(student.rank)}
                    </div>
                    <img
                      src={student.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(student.fullName)}`}
                      alt={student.fullName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <p className={`text-xs sm:text-sm font-bold ${isCurrentUser ? 'text-indigo-300 font-extrabold' : 'text-white'}`}>
                          {student.fullName}
                        </p>
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-[10px] font-bold text-white">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-[240px]">
                        {student.college}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-extrabold text-sm text-cyan-400">{student.xp} XP</p>
                    <p className="text-[10px] text-slate-400">
                      Level {student.level} &bull; {student.streakDays}d streak
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Milestone Badges & XP Scoring System (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Milestone Badges */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Achievement Badges</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {badges.map((b) => (
                <div 
                  key={b.id}
                  className={`p-3.5 rounded-2xl border transition text-center ${
                    b.isUnlocked 
                      ? 'bg-indigo-950/30 border-indigo-500/40 text-slate-200' 
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-slate-800/80">
                    {b.isUnlocked ? (
                      <Award className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <p className="font-bold text-white text-xs">{b.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">{b.desc}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    b.isUnlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    +{b.xpReward} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* XP Earning Rules */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400">
              How to Earn XP Points
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span>Solve a Coding Challenge</span>
                <span className="font-bold text-emerald-400">+50 to +100 XP</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span>Complete an AI Mock Interview</span>
                <span className="font-bold text-indigo-400">+100 XP</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span>Master a Roadmap Topic</span>
                <span className="font-bold text-cyan-400">+30 XP</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span>Complete an Aptitude Test</span>
                <span className="font-bold text-amber-400">+40 XP</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span>Daily Login Streak</span>
                <span className="font-bold text-rose-400">+20 XP</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
