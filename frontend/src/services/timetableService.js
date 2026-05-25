import api from './api';

export const getSessions = async () => {
  const response = await api.get('/api/timetable');
  return response.data;
};

export const createSession = async (data) => {
  const response = await api.post('/api/timetable', data);
  return response.data;
};

export const updateSession = async (id, data) => {
  const response = await api.put(`/api/timetable/${id}`, data);
  return response.data;
};

export const deleteSession = async (id) => {
  const response = await api.delete(`/api/timetable/${id}`);
  return response.data;
};
