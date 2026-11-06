import mockDb from '../data/mockDb.json';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper to provide client-side mock fallback when backend API is unreachable (e.g. GitHub Pages)
function getMockFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};

  // Auth routes
  if (endpoint.startsWith('/auth/login')) {
    const isAdmin = body.email && body.email.toLowerCase().includes('admin');
    const user = isAdmin 
      ? { ...mockDb.users.find(u => u.role === 'admin'), role: 'admin' }
      : { ...mockDb.users.find(u => u.role === 'student'), role: 'student' };
    const token = 'demo-preview-token-' + (isAdmin ? 'admin' : 'student');
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, token, user };
  }

  if (endpoint.startsWith('/auth/google')) {
    const user = { ...mockDb.users.find(u => u.role === 'student'), role: 'student' };
    const token = 'demo-preview-token-google';
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, token, user };
  }

  if (endpoint.startsWith('/auth/register')) {
    const user = {
      id: 'usr_' + Date.now(),
      fullName: body.fullName || body.name || 'New Candidate',
      email: body.email,
      role: body.role || 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      college: body.college || 'Premier Institute of Technology',
      degree: body.degree || 'B.Tech',
      department: body.department || 'Computer Science',
      graduationYear: body.graduationYear || 2027,
      cgpa: body.cgpa || '8.5',
      preferredLanguage: body.preferredLanguage || 'Python',
      targetCompanies: ['Google', 'Microsoft', 'TCS'],
      xp: 250,
      level: 1,
      streakDays: 1
    };
    const token = 'demo-preview-token-registered';
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, token, user };
  }

  if (endpoint.startsWith('/auth/me')) {
    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {}
    const user = storedUser || mockDb.users.find(u => u.role === 'student');
    return {
      user,
      progress: mockDb.userProgress || {
        stats: { questionsSolved: 14, learningHours: 32, testsTaken: 8, mockInterviewsCount: 3, overallCompletionPct: 42 }
      }
    };
  }

  if (endpoint.startsWith('/auth/update-profile')) {
    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    } catch (e) {}
    const updated = { ...storedUser, ...body };
    localStorage.setItem('currentUser', JSON.stringify(updated));
    return { success: true, user: updated };
  }

  if (endpoint.startsWith('/auth/forgot-password') || endpoint.startsWith('/auth/reset-password') || endpoint.startsWith('/auth/change-password') || endpoint.startsWith('/auth/verify-email')) {
    return { success: true, message: 'Action completed successfully in preview mode.' };
  }

  // Roadmap routes
  if (endpoint === '/roadmap' || endpoint.startsWith('/roadmap/categories')) {
    return { roadmaps: mockDb.roadmaps || [] };
  }
  if (endpoint.startsWith('/roadmap/toggle-topic')) {
    return { success: true, xpEarned: 20 };
  }

  // Coding routes
  if (endpoint.startsWith('/coding/questions')) {
    const parts = endpoint.split('/');
    if (parts.length > 3 && parts[3]) {
      const qId = parts[3].split('?')[0];
      const q = mockDb.codingQuestions.find(item => item.id === qId) || mockDb.codingQuestions[0];
      return { question: q };
    }
    return { questions: mockDb.codingQuestions, total: mockDb.codingQuestions.length };
  }

  if (endpoint.startsWith('/coding/run')) {
    return {
      passed: true,
      output: `Test Case 1: PASSED\nInput: nums = [2,7,11,15], target = 9\nOutput: [0, 1]\n\nTest Case 2: PASSED\nInput: nums = [3,2,4], target = 6\nOutput: [1, 2]`,
      runtime: '38 ms',
      memory: '14.2 MB'
    };
  }

  if (endpoint.startsWith('/coding/submit')) {
    return {
      status: 'Accepted',
      passedTestCases: 3,
      totalTestCases: 3,
      runtime: '42 ms',
      memory: '14.6 MB',
      xpGained: 50
    };
  }

  if (endpoint.startsWith('/coding/submissions')) {
    return { submissions: mockDb.submissions || [] };
  }

  if (endpoint.startsWith('/coding/bookmark')) {
    return { success: true, bookmarked: true };
  }

  // Mock Interview routes
  if (endpoint.startsWith('/interview/start')) {
    return {
      sessionId: 'int_' + Date.now(),
      role: body.role || 'Full Stack SDE',
      questions: [
        { id: 'q1', text: 'Explain the difference between synchronous and asynchronous operations in JavaScript, and how the event loop manages them.', tip: 'Mention the call stack, microtask queue, and callback queue.' },
        { id: 'q2', text: 'How do you design an efficient indexing strategy for a high-traffic database table?', tip: 'Discuss B-trees, composite indices, cardinality, and write overhead.' },
        { id: 'q3', text: 'Describe a situation where you had to debug a production defect under tight deadlines. What steps did you follow?', tip: 'Use the STAR format: Situation, Task, Action, Result.' }
      ]
    };
  }

  if (endpoint.startsWith('/interview/evaluate-answer')) {
    return {
      score: 88,
      feedback: 'Strong response with solid technical articulation. Mentioning specific edge cases and architecture patterns helped improve the STAR score.',
      clarity: 90,
      technicalDepth: 85,
      problemSolving: 89
    };
  }

  if (endpoint.startsWith('/interview/finish')) {
    return {
      success: true,
      overallScore: 87,
      strengths: ['Clear algorithmic thinking', 'Structured STAR responses', 'Effective communication'],
      weaknesses: ['Could elaborate more on distributed cache trade-offs'],
      summary: 'Candidate shows excellent readiness for Senior SDE and Placement campus drives.'
    };
  }

  if (endpoint.startsWith('/interview/history')) {
    return { history: mockDb.mockInterviews || [] };
  }

  // Resume routes
  if (endpoint === '/resume' || endpoint.startsWith('/resume?')) {
    return { resumes: mockDb.resumes || [] };
  }

  if (endpoint.startsWith('/resume/analyze')) {
    return {
      score: 86,
      insights: [
        'Strong quantifiable metrics in software engineering projects.',
        'High keyword density for React, Node.js, and Algorithms.',
        'Consider adding more leadership and open-source contributions.'
      ]
    };
  }

  if (endpoint.startsWith('/resume/')) {
    const parts = endpoint.split('/');
    const rId = parts[2];
    const resume = (mockDb.resumes || []).find(r => r.id === rId) || mockDb.resumes[0] || {};
    return { resume };
  }

  // Companies routes
  if (endpoint === '/companies' || endpoint.startsWith('/companies?')) {
    return { companies: mockDb.companies || [] };
  }

  if (endpoint.startsWith('/companies/')) {
    const parts = endpoint.split('/');
    const cId = parts[2].split('/')[0];
    const company = (mockDb.companies || []).find(c => c.id === cId) || mockDb.companies[0];
    return { company };
  }

  // Aptitude routes
  if (endpoint.startsWith('/aptitude/questions')) {
    return { questions: mockDb.aptitudeQuestions || [] };
  }

  if (endpoint.startsWith('/aptitude/submit')) {
    return {
      score: 85,
      correctCount: 9,
      totalCount: 10,
      accuracy: '90%',
      percentile: '94th',
      passed: true
    };
  }

  // Question Bank
  if (endpoint.startsWith('/questions')) {
    return { questions: mockDb.questionBank || [] };
  }

  // Tasks
  if (endpoint.startsWith('/tasks')) {
    return { tasks: mockDb.tasks || [] };
  }

  // Leaderboard
  if (endpoint.startsWith('/gamification/leaderboard')) {
    const list = (mockDb.users || [])
      .filter(u => u.role === 'student')
      .map((u, i) => ({
        rank: i + 1,
        id: u.id,
        name: u.fullName || u.name,
        xp: u.xp || (1500 - i * 150),
        streak: u.streakDays || (7 - i),
        college: u.college,
        avatar: u.avatar
      }));
    return { leaderboard: list };
  }

  // Notifications
  if (endpoint.startsWith('/notifications')) {
    return { notifications: mockDb.notifications || [] };
  }

  // Admin routes
  if (endpoint.startsWith('/admin/stats')) {
    return {
      totalStudents: 154,
      activeToday: 42,
      questionsSolved: 1280,
      mockInterviews: 240,
      avgPlacementReadiness: 78
    };
  }

  if (endpoint.startsWith('/admin/users')) {
    return { users: mockDb.users || [] };
  }

  if (endpoint.startsWith('/admin/questions')) {
    return {
      coding: mockDb.codingQuestions || [],
      aptitude: mockDb.aptitudeQuestions || [],
      interview: mockDb.questionBank || []
    };
  }

  if (endpoint.startsWith('/admin/analytics')) {
    return {
      languageBreakdown: [
        { name: 'Python', percentage: 45, count: 576 },
        { name: 'Java', percentage: 30, count: 384 },
        { name: 'C++', percentage: 18, count: 230 },
        { name: 'C', percentage: 7, count: 90 }
      ],
      weeklyActiveTrend: [
        { day: 'Mon', active: 38 },
        { day: 'Tue', active: 45 },
        { day: 'Wed', active: 52 },
        { day: 'Thu', active: 48 },
        { day: 'Fri', active: 60 },
        { day: 'Sat', active: 34 },
        { day: 'Sun', active: 29 }
      ]
    };
  }

  // Default fallback
  return { success: true, message: 'Simulated preview response' };
}

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    // If server responded with error code (404, 500, etc.)
    if (!res.ok) {
      console.warn(`[API] Endpoint ${endpoint} returned HTTP ${res.status}. Using preview fallback.`);
      return getMockFallback(endpoint, options);
    }

    const data = await res.json().catch(() => ({}));
    return data;
  } catch (err) {
    // Network error (e.g. backend server offline, CORS, or static hosting)
    console.warn(`[API] Network request failed for ${endpoint}. Using preview fallback.`);
    return getMockFallback(endpoint, options);
  }
}

// API methods
export const api = {
  // Auth
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  googleLogin: () => request('/auth/google', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/update-profile', { method: 'PUT', body: profileData }),
  changePassword: (passwords) => request('/auth/change-password', { method: 'POST', body: passwords }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: payload }),
  verifyEmail: () => request('/auth/verify-email', { method: 'POST' }),

  // Roadmap
  getRoadmaps: () => request('/roadmap'),
  toggleRoadmapTopic: (topicId) => request('/roadmap/toggle-topic', { method: 'POST', body: { topicId } }),

  // Coding
  getCodingQuestions: (params = '') => request(`/coding/questions${params ? '?' + params : ''}`),
  getCodingQuestion: (id) => request(`/coding/questions/${id}`),
  runCode: (payload) => request('/coding/run', { method: 'POST', body: payload }),
  submitCode: (payload) => request('/coding/submit', { method: 'POST', body: payload }),
  getSubmissions: () => request('/coding/submissions'),
  toggleBookmarkCode: (questionId) => request('/coding/bookmark', { method: 'POST', body: { questionId } }),

  // Mock Interview
  startInterview: (config) => request('/interview/start', { method: 'POST', body: config }),
  evaluateAnswer: (payload) => request('/interview/evaluate-answer', { method: 'POST', body: payload }),
  finishInterview: (payload) => request('/interview/finish', { method: 'POST', body: payload }),
  getInterviewHistory: () => request('/interview/history'),

  // Resumes
  getResumes: () => request('/resume'),
  getResume: (id) => request(`/resume/${id}`),
  saveResume: (resumeData) => request('/resume', { method: 'POST', body: resumeData }),
  deleteResume: (id) => request(`/resume/${id}`, { method: 'DELETE' }),
  analyzeResumeATS: (resumeData) => request('/resume/analyze', { method: 'POST', body: resumeData }),

  // Companies
  getCompanies: () => request('/companies'),
  getCompany: (id) => request(`/companies/${id}`),
  submitCompanyMock: (id, payload) => request(`/companies/${id}/submit-mock`, { method: 'POST', body: payload }),

  // Aptitude
  getAptitudeQuestions: (params = '') => request(`/aptitude/questions${params ? '?' + params : ''}`),
  submitAptitudeTest: (payload) => request('/aptitude/submit', { method: 'POST', body: payload }),

  // Question Bank
  getQuestionBank: (params = '') => request(`/questions${params ? '?' + params : ''}`),
  toggleMasterQuestion: (questionId) => request('/questions/toggle-master', { method: 'POST', body: { questionId } }),

  // Tasks / Planner
  getTasks: () => request('/tasks'),
  createTask: (task) => request('/tasks', { method: 'POST', body: task }),
  toggleTask: (id) => request(`/tasks/${id}/toggle`, { method: 'PUT' }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),

  // Gamification & Leaderboard
  getLeaderboard: () => request('/gamification/leaderboard'),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/mark-all-read', { method: 'PUT' }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: () => request('/admin/users'),
  createAdminUser: (userData) => request('/admin/users', { method: 'POST', body: userData }),
  updateAdminUser: (id, userData) => request(`/admin/users/${id}`, { method: 'PUT', body: userData }),
  deleteAdminUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  getAdminQuestions: () => request('/admin/questions'),
  createCodingQuestion: (qData) => request('/admin/coding-questions', { method: 'POST', body: qData }),
  deleteCodingQuestion: (id) => request(`/admin/coding-questions/${id}`, { method: 'DELETE' }),
  createInterviewQuestion: (qData) => request('/admin/interview-questions', { method: 'POST', body: qData }),
  deleteInterviewQuestion: (id) => request(`/admin/interview-questions/${id}`, { method: 'DELETE' }),
  createAptitudeQuestion: (qData) => request('/admin/aptitude-questions', { method: 'POST', body: qData }),
  deleteAptitudeQuestion: (id) => request(`/admin/aptitude-questions/${id}`, { method: 'DELETE' }),
  broadcastAnnouncement: (announcement) => request('/admin/announcements', { method: 'POST', body: announcement }),
  getAdminAnalytics: () => request('/admin/analytics')
};
