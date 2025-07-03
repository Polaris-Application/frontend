import { authFetch } from '../../hooks/authFetch';
import { API_ENDPOINTS } from '../../config/api';

// Fetches location data from the backend API (authenticated)
export const fetchHistogramData = async (mode) => {
  const response = await authFetch(`${API_ENDPOINTS.histogram}${mode ? `?${mode}=true` : ""}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch location data');
  }
  return response.json();
};
