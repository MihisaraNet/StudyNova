import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_TIMEOUT, TOKEN_KEY } from '../constants/config';

// ─── Create Axios instance ────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ─── Request interceptor — attach JWT token ───────────────────────────────────
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // No token stored yet — skip
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle errors globally ───────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token expired — clear storage and redirect (handled by AuthContext)
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } else if (error.request) {
      // Network error — no response received
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

export default api;
