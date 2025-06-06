import { authFetch } from '../hooks/authFetch'
import { API_ENDPOINTS } from '../config/api';

export const getCurrentUser = async (username) => {
  const queryParams = new URLSearchParams({ username });
  const url = `${API_ENDPOINTS.getUser}?${queryParams}`;

  const response = await authFetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve user data');
  }

  const data = await response.json();
  return data.user;
};