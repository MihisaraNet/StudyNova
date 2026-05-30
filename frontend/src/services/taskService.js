import api from './api';

export const getTasks = async (subjectId) => {
  const url = subjectId ? `/api/tasks?subjectId=${encodeURIComponent(subjectId)}` : '/api/tasks';
  const response = await api.get(url);
  return response.data;
};

export const getTask = async (id) => {
  const response = await api.get(`/api/tasks/${id}`);
  return response.data;
};

export const createTask = async (data) => {
  const response = await api.post('/api/tasks', data);
  return response.data;
};

export const updateTask = async (id, data) => {
  const response = await api.put(`/api/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data;
};
