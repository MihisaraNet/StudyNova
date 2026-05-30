import api from './api';

export const getAISuggestions = async () => {
  const response = await api.get('/api/ai/suggest');
  return response.data;
};
