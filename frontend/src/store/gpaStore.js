import { create } from 'zustand';
import * as gpaService from '../services/gpaService';

const useGpaStore = create((set) => ({
  gpaData: null,
  isLoading: false,
  error: null,

  fetchGPA: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await gpaService.getGPA();
      if (response.success) {
        set({ gpaData: response.data, isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch GPA data', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useGpaStore;
