import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle2, Clock, Check, Trash2, Sparkles, 
  ArrowLeft, Filter, AlertCircle, Award, Video, Code, BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export default function NotificationsPage({ setActivePage }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'announcements' | 'achievements'

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      setNotifications(res.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'announcements') return n.type === 'announcement' || n.type === 'welcome';
    if (filter === 'achievements') return n.type === 'streak' || n.type === 'badge' || n.type === 'achievement';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'streak':
      case 'badge':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'interview':
        return <Video className="w-5 h-5 text-indigo-400" />;
      case 'coding':
        return <Code className="w-5 h-5 text-cyan-400" />;
      case 'announcement':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => setActivePage('dashboard')}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Placement Alerts & Bulletins</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Notifications Center</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Stay updated with hiring announcements, mock interview scorecards, coding streak milestones, and platform news.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 glass-panel border border-slate-700 hover:bg-slate-800 transition flex items-center space-x-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'announcements', label: 'Announcements & Drives' },
          { id: 'achievements', label: 'Achievements & Streaks' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              filter === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'glass-panel border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Bell className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-extrabold text-white text-base">No Notifications Found</h3>
          <p className="text-xs text-slate-400">You are all caught up on all placement bulletins and updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl glass-panel border transition flex items-start justify-between gap-4 ${
                notif.read ? 'border-slate-800/80 bg-slate-900/40' : 'border-indigo-500/40 bg-indigo-950/20 shadow-lg shadow-indigo-950/30'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex-shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-white text-sm">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{notif.message}</p>
                  <p className="text-[10px] text-slate-500 pt-1">
                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  title="Mark as read"
                  className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition flex-shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
