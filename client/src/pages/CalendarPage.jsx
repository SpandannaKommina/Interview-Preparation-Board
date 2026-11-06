import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
  CheckCircle2, Clock, Video, Building2, BookOpen, AlertCircle, X, Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function CalendarPage({ setActivePage }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Coding');
  const [newPriority, setNewPriority] = useState('High');
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch tasks
  const loadTasks = async () => {
    try {
      const res = await api.getTasks();
      setTasks(res.tasks || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Calendar calculations
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Add event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newTitle) return;

    setLoading(true);
    try {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      await api.createTask({
        title: newTitle,
        category: newCategory,
        dueDate: dateStr,
        priority: newPriority
      });
      setNewTitle('');
      setModalOpen(false);
      loadTasks();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const eventsForDay = tasks.filter(t => t.dueDate === selectedDateStr);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span>Interactive Placement Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Interview & Study Calendar</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Organize daily coding targets, schedule AI mock interview dry runs, track on-campus hiring drive deadlines, and stay on streak.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActivePage('planner')}
            className="px-4 py-2 rounded-xl text-xs font-semibold glass-panel border border-slate-700 text-slate-300 hover:text-white transition"
          >
            Study Planner View
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Goal</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Selected Day Agendas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Month Calendar Grid (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl glass-panel border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl glass-panel border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} className="py-1">{d}</div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-2 text-xs">
            {/* Blank cells for starting day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="h-16 sm:h-20 rounded-xl bg-slate-900/30 border border-transparent"></div>
            ))}

            {/* Days in current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayTasks = tasks.filter(t => t.dueDate === dateStr);
              const isSelected = selectedDay === dayNum;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`h-16 sm:h-20 p-2 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${isToday ? 'px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black' : isSelected ? 'text-indigo-400' : 'text-slate-300'}`}>
                      {dayNum}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    )}
                  </div>

                  {dayTasks.length > 0 && (
                    <div className="truncate text-[10px] text-slate-400">
                      {dayTasks.length} {dayTasks.length === 1 ? 'event' : 'events'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda (1 col) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Day Schedule</p>
                <h3 className="text-lg font-extrabold text-white">
                  {monthNames[month]} {selectedDay}, {year}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Event list for day */}
            <div className="mt-4 space-y-3">
              {eventsForDay.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>No study tasks scheduled for this day.</p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    + Add a target
                  </button>
                </div>
              ) : (
                eventsForDay.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition ${
                      t.completed ? 'bg-slate-900/40 border-slate-800 opacity-60' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.priority === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {t.category}
                      </span>
                      {t.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className={`font-semibold text-white ${t.completed ? 'line-through text-slate-400' : ''}`}>
                      {t.title}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2 text-xs">
            <h4 className="font-extrabold text-indigo-300 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Today</span>
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Aim for at least 3 solved coding problems and 1 mock interview session each day to maintain your 6-day streak!
            </p>
          </div>
        </div>

      </div>

      {/* Add Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Schedule New Goal / Event</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target / Event Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Amazon Behavioral Mock Interview round"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Coding">Coding</option>
                    <option value="Mock Interview">Mock Interview</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Hiring Drive">Hiring Drive</option>
                    <option value="Resume">Resume</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Scheduled for: <span className="font-bold text-white">{monthNames[month]} {selectedDay}, {year}</span>
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add to Calendar'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
