import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  googleLogin: (token: string, ageGroup?: string) =>
    api.post('/auth/google', { token, ageGroup }),
  adminLogin: (email: string, password: string) =>
    api.post('/auth/admin/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

// Quiz APIs
export const quizAPI = {
  getQuizzes: (params?: { category?: string; ageGroup?: string }) =>
    api.get('/quizzes', { params }),
  getQuiz: (id: string) => api.get(`/quizzes/${id}`),
  submitQuiz: (id: string, data: { answers: string[]; timeTaken?: number }) =>
    api.post(`/quizzes/${id}/submit`, data),
  getHistory: () => api.get('/quizzes/history/me'),
};

// Leaderboard APIs
export const leaderboardAPI = {
  getLeaderboard: (params?: { period?: string; category?: string; ageGroup?: string }) =>
    api.get('/leaderboard', { params }),
  getCategories: () => api.get('/leaderboard/categories'),
  getMyStats: () => api.get('/leaderboard/my-stats'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateAgeGroup: (ageGroup: string) =>
    api.patch('/user/profile/age-group', { ageGroup }),
  getAchievements: () => api.get('/user/achievements'),
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/dashboard/stats'),
  // Quizzes
  getQuizzes: () => api.get('/admin/quizzes'),
  createQuiz: (data: any) => api.post('/admin/quizzes', data),
  updateQuiz: (id: string, data: any) => api.put(`/admin/quizzes/${id}`, data),
  deleteQuiz: (id: string) => api.delete(`/admin/quizzes/${id}`),
  // Questions
  getQuestions: (quizId: string) => api.get(`/admin/quizzes/${quizId}/questions`),
  addQuestion: (quizId: string, data: any) => api.post(`/admin/quizzes/${quizId}/questions`, data),
  // Users
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateMembership: (id: string, isNatkhatGannuMember: boolean) =>
    api.patch(`/admin/users/${id}/membership`, { isNatkhatGannuMember }),
  updateGiftEligibility: (id: string, isEligibleForGifts: boolean) =>
    api.patch(`/admin/users/${id}/gift-eligibility`, { isEligibleForGifts }),
  // Admins
  createAdmin: (data: { name: string; email: string; password: string }) =>
    api.post('/admin/admins', data),
};

export default api;

