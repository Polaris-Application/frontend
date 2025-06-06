import { authFetch } from '../hooks/authFetch';
import { API_ENDPOINTS } from '../config/api';

export const logoutUser = async () => {
  const response = await authFetch(API_ENDPOINTS.logout, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  return await response.json(); 
};