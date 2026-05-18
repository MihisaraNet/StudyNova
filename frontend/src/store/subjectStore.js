import { create } from 'zustand';
import * as subjectService from '../services/subjectService';

const useSubjectStore = create((set, get) => ({
  subjects: [],
  isLoading: false,
  error: null,

  fetchSubjects: async (semester) => {
    set({ isLoading: true, error: null });
    try {
      const response = await subjectService.getSubjects(semester);
      if (response.success) {
        set({ subjects: response.data, isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch subjects', isLoading: false });
    }
  },

  addSubject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await subjectService.createSubject(data);
      if (response.success) {
        set((state) => ({
          subjects: [...state.subjects, response.data],
          isLoading: false,
        }));
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to add subject', isLoading: false });
      return { success: false, message: 'Failed to add subject' };
    }
  },

  editSubject: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await subjectService.updateSubject(id, data);
      if (response.success) {
        set((state) => ({
          subjects: state.subjects.map((sub) => (sub.id === id ? response.data : sub)),
          isLoading: false,
        }));
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to edit subject', isLoading: false });
      return { success: false, message: 'Failed to edit subject' };
    }
  },

  removeSubject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await subjectService.deleteSubject(id);
      if (response.success) {
        set((state) => ({
          subjects: state.subjects.filter((sub) => sub.id !== id),
          isLoading: false,
        }));
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to delete subject', isLoading: false });
      return { success: false, message: 'Failed to delete subject' };
    }
  },
  
  clearError: () => set({ error: null }),
}));

export default useSubjectStore;
