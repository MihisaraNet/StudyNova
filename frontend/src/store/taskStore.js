import { create } from 'zustand';
import * as taskService from '../services/taskService';

const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (subjectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getTasks(subjectId);
      if (response.success) {
        set({ tasks: response.data, isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  addTask: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.createTask(data);
      if (response.success) {
        set((state) => ({
          tasks: [...state.tasks, response.data],
          isLoading: false,
        }));
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to add task', isLoading: false });
      return { success: false, message: 'Failed to add task' };
    }
  },

  editTask: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.updateTask(id, data);
      if (response.success) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
          isLoading: false,
        }));
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to edit task', isLoading: false });
      return { success: false, message: 'Failed to edit task' };
    }
  },

  removeTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.deleteTask(id);
      if (response.success) {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          isLoading: false,
        }));
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: 'Failed to delete task', isLoading: false });
      return { success: false, message: 'Failed to delete task' };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useTaskStore;
