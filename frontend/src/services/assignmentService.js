import api from './api';

export const getAssignments = async (subjectId) => {
  const url = subjectId ? `/api/assignments?subjectId=${encodeURIComponent(subjectId)}` : '/api/assignments';
  const response = await api.get(url);
  return response.data;
};

export const getAssignment = async (id) => {
  const response = await api.get(`/api/assignments/${id}`);
  return response.data;
};

export const createAssignment = async (data) => {
  const response = await api.post('/api/assignments', data);
  return response.data;
};

export const updateAssignment = async (id, data) => {
  const response = await api.put(`/api/assignments/${id}`, data);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await api.delete(`/api/assignments/${id}`);
  return response.data;
};
