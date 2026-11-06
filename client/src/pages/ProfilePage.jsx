import React, { useState } from 'react';
import { 
  User, Mail, School, GraduationCap, Code, Building2, 
  Lock, Save, CheckCircle2, AlertCircle, Shield, Sparkles, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export default function ProfilePage({ setActivePage }) {
  const { user, updateProfile, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [college, setCollege] = useState(user?.college || '');
  const [degree, setDegree] = useState(user?.degree || 'B.Tech');
  const [department, setDepartment] = useState(user?.department || 'Computer Science');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || 2027);
  const [cgpa, setCgpa] = useState(user?.cgpa || '8.8');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'Python');
  const [targetCompanies, setTargetCompanies] = useState(user?.targetCompanies?.join(', ') || 'Google, Amazon, TCS');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || 'Data Structures, Python, React, SQL');
  const [bio, setBio] = useState(user?.bio || '');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 45);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdMessage, setPwdMessage] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await updateProfile({
        fullName,
        college,
        degree,
        department,
        graduationYear: parseInt(graduationYear, 10),
        cgpa,
        preferredLanguage,
        targetCompanies: targetCompanies.split(',').map(s => s.trim()).filter(Boolean),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        bio,
        dailyGoalMinutes: parseInt(dailyGoalMinutes, 10)
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMessage('');
    setPwdError('');

    if (newPassword !== confirmNewPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await api.changePassword({ currentPassword, newPassword });
      setPwdMessage(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPwdMessage(''), 3000);
    } catch (err) {
      setPwdError(err.message || 'Password update failed.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await api.verifyEmail();
      refreshUser();
      alert('Email verified successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.fullName || 'Student')}`}
            alt={user?.fullName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-400 shadow-xl"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user?.fullName}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              {user?.isEmailVerified ? (
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Email Verified</span>
                </span>
              ) : (
                <button
                  onClick={handleVerifyEmail}
                  className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/20 transition"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>Verify Email</span>
                </button>
              )}
              <span className="text-xs text-indigo-400 font-semibold">{user?.xp || 0} XP (Lvl {user?.level || 1})</span>
            </div>
          </div>
        </div>

        {/* Right side controls: Theme toggle & Settings button */}
        <div className="flex flex-wrap items-center gap-3">
          {setActivePage && (
            <button
              onClick={() => setActivePage('settings')}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold glass-panel border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 transition flex items-center space-x-1.5"
            >
              <span>Settings & Integrations</span>
            </button>
          )}

          <div className="flex items-center space-x-3 glass-panel p-2.5 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-300 font-medium">Theme:</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 text-white"
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile Form & Password Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Settings (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Academic & Profile Information</span>
          </h2>

          {message && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Degree</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Current CGPA / Percentage</label>
                <input
                  type="text"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="e.g. 8.8 / 10"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                >
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Target Companies (Comma separated)</label>
              <input
                type="text"
                value={targetCompanies}
                onChange={(e) => setTargetCompanies(e.target.value)}
                placeholder="e.g. Google, Amazon, TCS Prime, Infosys"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Technical Skills</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, Python, Data Structures, SQL"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Bio / Aspirations</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Password & Security (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Change Password</span>
            </h3>

            {pwdMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{pwdMessage}</span>
              </div>
            )}

            {pwdError && (
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{pwdError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <button
                type="submit"
                disabled={pwdLoading}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                {pwdLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Account Security Info Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2 text-xs text-slate-400">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Account Security Status</span>
            </h4>
            <p className="text-[11px] leading-relaxed">
              Passwords are cryptographically salted and hashed using Bcrypt. Session tokens use JSON Web Tokens with automated revocation.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
