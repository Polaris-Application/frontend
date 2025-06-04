import { authFetch } from '../hooks/authFetch';
const API_URL = '/api';

export const logoutUser = async () => {
  const response = await authFetch(`${API_URL}/get_user`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  return await response.json(); 
};