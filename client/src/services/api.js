const BASE_URL = '/api';

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
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
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
