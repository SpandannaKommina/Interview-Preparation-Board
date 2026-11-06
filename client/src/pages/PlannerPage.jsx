import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle2, Circle, Plus, Trash2, Clock, 
  Sparkles, Check, AlertCircle, ArrowRight, Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PlannerPage({ setActivePage }) {
  const { user, refreshUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, progressPct: 0 });
  const [loading, setLoading] = useState(true);

  // New task modal / input state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Coding');
  const [newPriority, setNewPriority] = useState('High');
  const [newDueDate, setNewDueDate] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.getTasks();
      setTasks(res.tasks || []);
      setStats(res.stats || { total: 0, completed: 0, pending: 0, progressPct: 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.createTask({
        title: newTitle,
        category: newCategory,
        priority: newPriority,
        dueDate: newDueDate
      });
      setTasks(prev => [res.task, ...prev]);
      setNewTitle('');
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const res = await api.toggleTask(id);
      setTasks(prev => prev.map(t => t.id === id ? res.task : t));
      if (res.task.completed) {
        confetti({ particleCount: 40, spread: 50 });
      }
      fetchTasks();
      refreshUser();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Calendar className="w-4 h-4" />
            <span>Placement Timeline & Goal Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Daily Study Planner & Schedule</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Organize daily coding challenges, mock interviews, and syllabus deadlines to stay consistent and maintain your learning streak.
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end space-y-3">
          {setActivePage && (
            <button
              onClick={() => setActivePage('calendar')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 glass-panel border border-slate-700 hover:bg-slate-800 transition flex items-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open Monthly Calendar Grid &rarr;</span>
            </button>
          )}

          {/* Progress Pill */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-700/80 min-w-[200px] text-center">
            <p className="text-xs text-slate-400 font-semibold uppercase">Daily Goal Progress</p>
            <p className="text-3xl font-extrabold text-white mt-1">{stats.progressPct}%</p>
            <p className="text-[11px] text-emerald-400 font-bold mt-1">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Add Task & Tasks List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Add New Task (4 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Add Study Goal or Interview</span>
          </h3>

          <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Task Title / Goal</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Solve 3 Binary Tree Mediums"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="Coding">Coding Practice</option>
                  <option value="Core CS">Core CS (DBMS/OS)</option>
                  <option value="Mock Interview">Mock Interview</option>
                  <option value="Company Prep">Company Prep</option>
                  <option value="Aptitude">Aptitude Test</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Add Goal to Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Tasks View (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-sm">Scheduled Tasks & Deadlines</h3>
            <span className="text-xs text-slate-400 font-semibold">{tasks.length} Total</span>
          </div>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active goals yet. Add one to start earning bonus XP!
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                    task.completed
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                      : 'glass-card border-slate-700/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="text-slate-400 hover:scale-110 transition flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-indigo-400" />
                      )}
                    </button>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${task.completed ? 'line-through opacity-75' : 'text-white'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-800 font-semibold text-[10px]">
                          {task.category}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Due: {task.dueDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      task.priority === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
