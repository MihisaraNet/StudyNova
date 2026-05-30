import { create } from 'zustand';
import * as timetableService from '../services/timetableService';
import * as notificationUtils from '../utils/notificationUtils';

const useTimetableStore = create((set, get) => ({
  sessions: [],
  isLoading: false,
  error: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await timetableService.getSessions();
      if (response.success) {
        const sessions = response.data;
        set({ sessions, isLoading: false });
        
        // Sync scheduled push notifications on the local device
        await notificationUtils.syncAllReminders(sessions);
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch study sessions', isLoading: false });
    }
  },

  addSession: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await timetableService.createSession(data);
      if (response.success) {
        const newSession = response.data;
        set((state) => ({
          sessions: [...state.sessions, newSession],
          isLoading: false,
        }));
        
        // Schedule notification reminder if enabled
        if (newSession.reminderEnabled) {
          await notificationUtils.scheduleStudySessionReminder(newSession);
        }
        
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to add study session', isLoading: false });
      return { success: false, message: 'Failed to add study session' };
    }
  },

  editSession: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await timetableService.updateSession(id, data);
      if (response.success) {
        const updatedSession = response.data;
        set((state) => ({
          sessions: state.sessions.map((sess) => (sess.id === id ? updatedSession : sess)),
          isLoading: false,
        }));
        
        // Reschedule/update local notification
        if (updatedSession.reminderEnabled) {
          await notificationUtils.scheduleStudySessionReminder(updatedSession);
        } else {
          await notificationUtils.cancelStudySessionReminder(updatedSession.id);
        }
        
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to edit study session', isLoading: false });
      return { success: false, message: 'Failed to edit study session' };
    }
  },

  removeSession: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await timetableService.deleteSession(id);
      if (response.success) {
        set((state) => ({
          sessions: state.sessions.filter((sess) => sess.id !== id),
          isLoading: false,
        }));
        
        // Cancel local notification reminder
        await notificationUtils.cancelStudySessionReminder(id);
        
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to delete study session', isLoading: false });
      return { success: false, message: 'Failed to delete study session' };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useTimetableStore;
