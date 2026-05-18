import api from './api';

export const getGPA = async () => {
  try {
    const response = await api.get('/gpa');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};
