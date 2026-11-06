import React, { useState } from 'react';
import { 
  Settings, User, Lock, Key, Bell, Shield, Moon, Sun, 
  CheckCircle2, AlertCircle, Save, Sparkles, Terminal, Sliders, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export default function SettingsPage({ setActivePage }) {
  const { user, refreshUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'security' | 'integrations' | 'preferences'

  // Account form
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'Python');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 45);
  const [dailySolvedGoal, setDailySolvedGoal] = useState(user?.dailySolvedGoal || 3);

  // Security form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // API Integrations
  const [judge0ApiKey, setJudge0ApiKey] = useState(localStorage.getItem('JUDGE0_API_KEY') || '');
  const [aiApiKey, setAiApiKey] = useState(localStorage.getItem('AI_INTERVIEW_API_KEY') || '');
  const [aiProvider, setAiProvider] = useState(localStorage.getItem('AI_PROVIDER') || 'Built-in Intelligent Engine');

  // Messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.updateProfile({
        fullName,
        preferredLanguage,
        dailyGoalMinutes: Number(dailyGoalMinutes),
        dailySolvedGoal: Number(dailySolvedGoal)
      });
      setMessage(res.message || 'Settings saved successfully!');
      if (refreshUser) refreshUser();
    } catch (err) {
      setError(err.message || 'Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.changePassword({ currentPassword, newPassword });
      setMessage(res.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKeys = (e) => {
    e.preventDefault();
    localStorage.setItem('JUDGE0_API_KEY', judge0ApiKey);
    localStorage.setItem('AI_INTERVIEW_API_KEY', aiApiKey);
    localStorage.setItem('AI_PROVIDER', aiProvider);
    setMessage('API configurations updated and stored safely in local browser storage.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration & Account Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Settings</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Customize your learning goals, security credentials, external code judge integrations, and appearance themes.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Account: <strong className="text-white">{user?.email}</strong>
          </span>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs & Form Body */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="glass-panel p-3 rounded-2xl border border-slate-800 space-y-1 h-fit">
          {[
            { id: 'account', label: 'General & Goals', icon: User },
            { id: 'security', label: 'Password & Security', icon: Lock },
            { id: 'integrations', label: 'AI & Judge0 Keys', icon: Key },
            { id: 'preferences', label: 'Appearance & UI', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMessage(''); setError(''); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-3 transition ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Content (3 cols) */}
        <div className="md:col-span-3 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Tab 1: Account & Daily Goals */}
          {activeTab === 'account' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6 text-xs">
              <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">
                General Profile & Daily Targets
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Preferred Coding Language</label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="C">C</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Daily Goal (Minutes of Learning)</label>
                  <input
                    type="number"
                    min="15"
                    max="300"
                    value={dailyGoalMinutes}
                    onChange={(e) => setDailyGoalMinutes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Daily Target (Problems Solved)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={dailySolvedGoal}
                    onChange={(e) => setDailySolvedGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loading ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Security & Change Password */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6 text-xs">
              <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">
                Change Security Password
              </h3>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">New Password (Min 6 chars)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: API Keys & External Integrations */}
          {activeTab === 'integrations' && (
            <form onSubmit={handleSaveApiKeys} className="space-y-6 text-xs">
              <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">
                Judge0 & AI Service Configuration
              </h3>

              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-slate-300 leading-relaxed space-y-1">
                <p className="font-bold text-indigo-300">Intelligent Offline Engine Active:</p>
                <p>
                  By default, the platform includes a built-in semantic evaluator and isolated Python sandbox runner. If you have an external Judge0 RapidAPI key or OpenAI/Gemini API key, you can enter them below to enable remote sandbox execution.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">AI Engine Provider</label>
                  <select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Built-in Intelligent Engine">Built-in Intelligent Engine (Heuristic NLP & STAR Evaluation)</option>
                    <option value="Gemini API">Google Gemini API</option>
                    <option value="OpenAI GPT-4o">OpenAI API (GPT-4o)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">AI API Key (Optional)</label>
                  <input
                    type="password"
                    value={aiApiKey}
                    onChange={(e) => setAiApiKey(e.target.value)}
                    placeholder="Enter API Key (sk-... or AIza...)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">If empty, the platform seamlessly uses the built-in intelligent evaluation engine.</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Judge0 API Key (Optional)</label>
                  <input
                    type="password"
                    value={judge0ApiKey}
                    onChange={(e) => setJudge0ApiKey(e.target.value)}
                    placeholder="Enter RapidAPI Judge0 Key"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">When configured, code is dispatched to Judge0 sandbox clusters.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition flex items-center space-x-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save API Configurations</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 4: Preferences & Danger Zone */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 text-xs">
              <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">
                Interface Preferences & Session
              </h3>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <p className="font-bold text-white">Application Theme</p>
                  <p className="text-[11px] text-slate-400">Toggle between Dark Navy and Light theme modes</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-xl glass-panel border border-slate-700 text-slate-200 hover:text-white flex items-center space-x-2"
                >
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  <span>{theme === 'dark' ? 'Dark Navy Theme' : 'Light Theme'}</span>
                </button>
              </div>

              {/* Danger Zone */}
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-4">
                <h4 className="font-extrabold text-rose-400 text-sm">Danger Zone</h4>
                <p className="text-slate-300">
                  End your current session across devices or sign out of your placement board account.
                </p>
                <button
                  onClick={logout}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition"
                >
                  Sign Out of Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
