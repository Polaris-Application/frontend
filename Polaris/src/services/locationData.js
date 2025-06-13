import { authFetch } from '../hooks/authFetch';
import { API_ENDPOINTS } from '../config/api';

// Fetches location data from the backend API (authenticated)
export const fetchLocationData = async () => {
  const response = await authFetch(API_ENDPOINTS.locationData);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch location data');
  }
  return response.json();
};
