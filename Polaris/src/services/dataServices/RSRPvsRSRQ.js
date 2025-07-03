import { authFetch } from '../../hooks/authFetch';
import { API_ENDPOINTS } from '../../config/api';

// Fetches location data from the backend API (authenticated)
export const fetchRSRPvsRSRQ = async () => {
  const response = await authFetch(API_ENDPOINTS.RSRPvsRSRQ);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch RSRPvsRSRQ data');
  }
  return response.json();
};
