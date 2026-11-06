import React, { useState, useEffect } from 'react';
import { 
  Terminal, Map, Code, Video, FileText, Building2, Brain, 
  HelpCircle, Calendar, Trophy, Sun, Moon, Bell, Menu, X, 
  ChevronDown, LogOut, User, ShieldAlert, Sparkles, Flame, CheckCircle2, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationModal from './NotificationModal';
import { api } from '../services/api';

export default function Navbar({ activePage, setActivePage }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  // Poll notifications occasionally
  useEffect(() => {
    if (isAuthenticated) {
      api.getNotifications()
        .then(res => setUnreadCount(res.unreadCount || 0))
        .catch(() => {});
    }
  }, [isAuthenticated, activePage]);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Terminal, authRequired: true },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'coding', label: 'Coding IDE', icon: Code },
    { id: 'interview', label: 'AI Interview', icon: Video, highlight: true },
    { id: 'resume', label: 'Resume ATS', icon: FileText },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'aptitude', label: 'Aptitude Tests', icon: Brain },
    { id: 'questions', label: 'Question Bank', icon: HelpCircle },
    { id: 'planner', label: 'Planner', icon: Calendar, authRequired: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div 
              onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'landing')} 
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue via-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-electric group-hover:rotate-12 transition duration-200" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center space-x-1">
                  <span>INTERVIEW</span>
                  <span className="gradient-text-electric">PREP</span>
                </span>
                <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase -mt-1">
                  Board & Career Hub
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Priority Top Items) */}
            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                        : item.highlight
                        ? 'text-cyan-400 hover:text-white hover:bg-slate-800/70'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Streak, XP, Theme, Notifications, Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Gamification Stats Pill (if logged in) */}
              {isAuthenticated && user && (
                <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
                  <div className="flex items-center space-x-1 text-amber-400 font-semibold" title="Current Daily Streak">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
                    <span>{user.streakDays || 1}d</span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <div className="flex items-center space-x-1 text-indigo-400 font-bold" title="Total XP Earned">
                    <span>{user.xp || 0} XP</span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-[10px] text-indigo-300">
                      Lvl {user.level || 1}
                    </span>
                  </div>
                </div>
              )}

              {/* Dark/Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-800 transition"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>

              {/* Notification Bell */}
              {isAuthenticated && (
                <button
                  onClick={() => setNotifModalOpen(true)}
                  className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-800 transition"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Auth Buttons or User Avatar */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-1 pl-2 pr-2.5 rounded-xl border border-slate-700/70 bg-slate-800/70 hover:bg-slate-700/70 transition"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.fullName)}`}
                      alt={user.fullName}
                      className="w-7 h-7 rounded-lg object-cover border border-indigo-400/30"
                    />
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-xs font-semibold text-white leading-tight max-w-[100px] truncate">
                        {user.fullName}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel shadow-2xl border border-slate-700/80 p-2 py-2 text-xs divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-3 py-2">
                        <p className="font-semibold text-white text-sm truncate">{user.fullName}</p>
                        <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                        <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                          {user.role} Account
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => handleNavClick('dashboard')}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center space-x-2"
                        >
                          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Student Dashboard</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('profile')}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center space-x-2"
                        >
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Candidate Profile</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('interview-history')}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center space-x-2"
                        >
                          <Video className="w-3.5 h-3.5 text-purple-400" />
                          <span>Mock Interview Archives</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('calendar')}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center space-x-2"
                        >
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Interview Calendar</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('notifications')}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center space-x-2"
                        >
                          <Bell className="w-3.5 h-3.5 text-amber-400" />
                          <span>Notification Center</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('settings')}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center space-x-2"
                        >
                          <Settings className="w-3.5 h-3.5 text-blue-400" />
                          <span>Settings & API Keys</span>
                        </button>
                        {user.role === 'admin' && (
                          <button
                            onClick={() => handleNavClick('admin')}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-amber-950/40 flex items-center space-x-2"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>Admin Command Portal</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={logout}
                          className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/30 flex items-center space-x-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/70 transition"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleNavClick('register')}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden px-4 pt-2 pb-6 glass-panel border-b border-slate-800 space-y-1">
            <div className="grid grid-cols-2 gap-2 py-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 text-left transition ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 bg-slate-800/50 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {isAuthenticated && user && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="text-xs text-indigo-400 font-semibold"
                >
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="text-xs text-rose-400 font-semibold flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Notifications Drawer */}
      <NotificationModal 
        isOpen={notifModalOpen} 
        setActivePage={setActivePage}
        onClose={() => {
          setNotifModalOpen(false);
          setUnreadCount(0);
        }} 
      />
    </>
  );
}
