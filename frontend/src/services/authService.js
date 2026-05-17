import api from './api';

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = async (data) => {
  const response = await api.post('/api/auth/register', data);
  return response.data; // { success, message, data: { token, name, email, ... } }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

// ─── Get current user ─────────────────────────────────────────────────────────
export const getMe = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

// ─── Update profile ───────────────────────────────────────────────────────────
export const updateProfile = async (updates) => {
  const response = await api.put('/api/auth/profile', updates);
  return response.data;
};

// ─── Change password ──────────────────────────────────────────────────────────
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/api/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = async () => {
  await api.post('/api/auth/logout');
};
