import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Fetch current user if token exists
  const fetchCurrentUser = async () => {
    if (!token) {
      setUser(null);
      setProgress(null);
      setLoading(false);
      return;
    }

    if (token === 'demo-preview-token') {
      setUser((prev) => prev || {
        id: 'student_001',
        name: 'Swapnika (Demo Student)',
        email: 'student@interviewprep.com',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Swapnika',
        college: 'Premier Institute of Technology',
        targetCompany: 'Google & TCS',
        graduationYear: 2026,
        bio: 'Passionate computer science scholar preparing for product and tier-1 service company interviews.'
      });
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      setUser(res.user);
      setProgress(res.progress);
    } catch (err) {
      console.warn('Session verification failed:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      const res = await api.login(credentials);
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      // Offline / Static Preview fallback (e.g. GitHub Pages)
      if (!err.message || err.message.includes('fetch') || err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const role = credentials.email?.includes('admin') ? 'admin' : 'student';
        const demoUser = {
          id: role === 'admin' ? 'admin_001' : 'student_001',
          name: role === 'admin' ? 'Admin Officer' : 'Swapnika (Demo Student)',
          email: credentials.email || (role === 'admin' ? 'admin@interviewprep.com' : 'student@interviewprep.com'),
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`,
          college: 'Premier Institute of Technology',
          targetCompany: 'Google & TCS',
          graduationYear: 2026,
          bio: 'Passionate computer science scholar preparing for interviews.'
        };
        const demoToken = 'demo-preview-token';
        localStorage.setItem('token', demoToken);
        setToken(demoToken);
        setUser(demoUser);
        return { success: true, user: demoUser, token: demoToken };
      }
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      if (!err.message || err.message.includes('fetch') || err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const demoUser = {
          id: 'student_' + Date.now(),
          name: userData.name || 'New Student',
          email: userData.email,
          role: 'student',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(userData.name || 'Student'),
          college: userData.college || 'Premier Institute of Technology',
          targetCompany: userData.targetCompany || 'TCS & Infosys',
          graduationYear: userData.graduationYear || 2026,
        };
        const demoToken = 'demo-preview-token';
        localStorage.setItem('token', demoToken);
        setToken(demoToken);
        setUser(demoUser);
        return { success: true, user: demoUser, token: demoToken };
      }
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const res = await api.googleLogin();
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      if (!err.message || err.message.includes('fetch') || err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const demoUser = {
          id: 'student_001',
          name: 'Swapnika (Google Student)',
          email: 'student@interviewprep.com',
          role: 'student',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser',
          college: 'Premier Institute of Technology',
          targetCompany: 'Google & TCS',
          graduationYear: 2026,
          bio: 'Passionate computer science scholar.'
        };
        const demoToken = 'demo-preview-token';
        localStorage.setItem('token', demoToken);
        setToken(demoToken);
        setUser(demoUser);
        return { success: true, user: demoUser, token: demoToken };
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProgress(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    setUser(res.user);
    return res;
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const res = await api.getMe();
        setUser(res.user);
        setProgress(res.progress);
      } catch (e) {}
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        progress,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
