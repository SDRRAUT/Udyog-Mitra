// store/auth.ts - Zustand auth store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAccessToken } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  role: string;
  departmentId?: string;
  districtId?: string;
  department?: { name: string; code: string; color?: string };
  district?: { name: string };
  entrepreneurProfile?: any;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user }),
      setAccessToken: (token) => {
        setAccessToken(token);
        set({ accessToken: token });
      },
      login: (user, token) => {
        setAccessToken(token);
        set({ user, accessToken: token, isAuthenticated: true });
      },
      logout: () => {
        setAccessToken('');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'udyog-marg-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAccessToken(state.accessToken);
        }
      },
    },
  ),
);
