import { create } from 'zustand';
import * as storage from '../utils/storage';
import { TOKEN_KEY, USER_KEY } from '../constants/config';
import * as authService from '../services/authService';

const useAuthStore = create((set, get) => ({
  user:        null,
  token:       null,
  isLoading:   true,   // true on initial app load
  isLoggedIn:  false,
  error:       null,

  // ─── Bootstrap: load persisted session ─────────────────────────────────────
  loadSession: async () => {
    try {
      const token    = await storage.getItem(TOKEN_KEY);
      const userJson = await storage.getItem(USER_KEY);

      if (token && userJson) {
        set({
          token,
          user: JSON.parse(userJson),
          isLoggedIn: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  // ─── Register ───────────────────────────────────────────────────────────────
  register: async (formData) => {
    set({ error: null });
    try {
      const response = await authService.register(formData);
      const { token, ...user } = response.data;

      await storage.setItem(TOKEN_KEY, token);
      await storage.setItem(USER_KEY, JSON.stringify(user));

      set({ token, user, isLoggedIn: true });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      set({ error: message });
      return { success: false, message };
    }
  },

  // ─── Login ──────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    set({ error: null });
    try {
      const response = await authService.login(email, password);
      const { token, ...user } = response.data;

      await storage.setItem(TOKEN_KEY, token);
      await storage.setItem(USER_KEY, JSON.stringify(user));

      set({ token, user, isLoggedIn: true });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Check your credentials.';
      set({ error: message });
      return { success: false, message };
    }
  },

  // ─── Logout ─────────────────────────────────────────────────────────────────
  logout: async () => {
    try { await authService.logout(); } catch {}  // fire-and-forget
    await storage.deleteItem(TOKEN_KEY);
    await storage.deleteItem(USER_KEY);
    set({ user: null, token: null, isLoggedIn: false, error: null });
  },

  // ─── Update profile locally ─────────────────────────────────────────────────
  setUser: async (updatedUser) => {
    await storage.setItem(USER_KEY, JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // ─── Clear error ────────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
