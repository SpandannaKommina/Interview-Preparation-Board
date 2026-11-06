import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, X, Sparkles, Flame, Video, Award, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function NotificationModal({ isOpen, onClose, setActivePage }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = async () => {
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
    if (isOpen) {
      fetchNotifs();
    }
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? ({ ...n, read: true }) : n));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'streak': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'interview': return <Video className="w-4 h-4 text-brand-purple" />;
      case 'test': return <Award className="w-4 h-4 text-emerald-400" />;
      default: return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-sm sm:max-w-md mt-16 glass-panel rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-brand-purple" />
            <h3 className="font-semibold text-slate-100">Notifications</h3>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {notifications.filter(n => !n.read).length} new
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-slate-400 hover:text-indigo-400 flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-800/60 transition"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/50">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading alerts...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && handleMarkSingleRead(n.id)}
                className={`p-4 transition cursor-pointer flex items-start space-x-3 hover:bg-slate-800/40 ${!n.read ? 'bg-indigo-950/20' : ''}`}
              >
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${!n.read ? 'text-slate-100 font-semibold' : 'text-slate-300'}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center">
          <button
            onClick={() => {
              if (setActivePage) setActivePage('notifications');
              onClose();
            }}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
          >
            Open Full Notification Center →
          </button>
        </div>
      </div>
    </div>
  );
}
