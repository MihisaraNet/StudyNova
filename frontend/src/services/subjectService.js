import api from './api';

export const getSubjects = async (semester) => {
  const url = semester ? `/api/subjects?semester=${encodeURIComponent(semester)}` : '/api/subjects';
  const response = await api.get(url);
  return response.data;
};

export const getSubject = async (id) => {
  const response = await api.get(`/api/subjects/${id}`);
  return response.data;
};

export const createSubject = async (data) => {
  const response = await api.post('/api/subjects', data);
  return response.data;
};

export const updateSubject = async (id, data) => {
  const response = await api.put(`/api/subjects/${id}`, data);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await api.delete(`/api/subjects/${id}`);
  return response.data;
};
