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

    try {
      const res = await api.getMe();
      if (res && res.user) {
        setUser(res.user);
        setProgress(res.progress);
      } else {
        // Fallback to stored user or student
        const stored = localStorage.getItem('currentUser');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      }
    } catch (err) {
      console.warn('Session verification note:', err.message);
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          logout();
        }
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    if (res && res.token && res.user) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res && res.token && res.user) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const loginWithGoogle = async () => {
    const res = await api.googleLogin();
    if (res && res.token && res.user) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setToken(null);
    setUser(null);
    setProgress(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res && res.user) {
      setUser(res.user);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
    }
    return res;
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const value = {
    user,
    progress,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
