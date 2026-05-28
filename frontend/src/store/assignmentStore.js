import { create } from 'zustand';
import * as assignmentService from '../services/assignmentService';

const useAssignmentStore = create((set, get) => ({
  assignments: [],
  isLoading: false,
  error: null,

  fetchAssignments: async (subjectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await assignmentService.getAssignments(subjectId);
      if (response.success) {
        set({ assignments: response.data, isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch assignments', isLoading: false });
    }
  },

  addAssignment: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await assignmentService.createAssignment(data);
      if (response.success) {
        set((state) => ({
          assignments: [...state.assignments, response.data],
          isLoading: false,
        }));
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to add assignment', isLoading: false });
      return { success: false, message: 'Failed to add assignment' };
    }
  },

  editAssignment: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await assignmentService.updateAssignment(id, data);
      if (response.success) {
        set((state) => ({
          assignments: state.assignments.map((asg) => (asg.id === id ? response.data : asg)),
          isLoading: false,
        }));
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to edit assignment', isLoading: false });
      return { success: false, message: 'Failed to edit assignment' };
    }
  },

  removeAssignment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await assignmentService.deleteAssignment(id);
      if (response.success) {
        set((state) => ({
          assignments: state.assignments.filter((asg) => asg.id !== id),
          isLoading: false,
        }));
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to delete assignment', isLoading: false });
      return { success: false, message: 'Failed to delete assignment' };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAssignmentStore;
