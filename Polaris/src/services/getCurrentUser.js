import { authFetch } from '../hooks/authFetch'
const API_URL = '/api';

export const getCurrentUser = async () => {
  const response = await authFetch(`${API_URL}/get_user`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve user data');
  }

  const data = await response.json();
  return data.user; 
};