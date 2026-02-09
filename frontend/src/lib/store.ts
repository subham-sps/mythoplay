import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  ageGroup: string;
  isNatkhatGannuMember: boolean;
  isEligibleForGifts: boolean;
  totalScore: number;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: User, token: string) => void;
  setAdmin: (admin: Admin, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      admin: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      setUser: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, isAdmin: false, admin: null });
      },
      setAdmin: (admin, token) => {
        localStorage.setItem('token', token);
        set({ admin, token, isAuthenticated: true, isAdmin: true, user: null });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, admin: null, token: null, isAuthenticated: false, isAdmin: false });
      },
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'mythoplay-auth',
      partialize: (state) => ({
        user: state.user,
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);

interface QuizState {
  currentQuiz: any | null;
  answers: string[];
  currentQuestion: number;
  startTime: number | null;
  setQuiz: (quiz: any) => void;
  setAnswer: (index: number, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  resetQuiz: () => void;
  startQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuiz: null,
  answers: [],
  currentQuestion: 0,
  startTime: null,
  setQuiz: (quiz) =>
    set({
      currentQuiz: quiz,
      answers: new Array(quiz.questions?.length || 0).fill(''),
      currentQuestion: 0,
      startTime: null,
    }),
  setAnswer: (index, answer) =>
    set((state) => {
      const newAnswers = [...state.answers];
      newAnswers[index] = answer;
      return { answers: newAnswers };
    }),
  nextQuestion: () =>
    set((state) => ({
      currentQuestion: Math.min(
        state.currentQuestion + 1,
        (state.currentQuiz?.questions?.length || 1) - 1
      ),
    })),
  prevQuestion: () =>
    set((state) => ({
      currentQuestion: Math.max(state.currentQuestion - 1, 0),
    })),
  goToQuestion: (index) => set({ currentQuestion: index }),
  resetQuiz: () =>
    set({ currentQuiz: null, answers: [], currentQuestion: 0, startTime: null }),
  startQuiz: () => set({ startTime: Date.now() }),
}));

