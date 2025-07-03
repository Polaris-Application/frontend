import { authFetch } from '../../hooks/authFetch';
import { API_ENDPOINTS } from '../../config/api';

// Fetches location data from the backend API (authenticated)
export const fetchAFRCNUsage = async (network_type) => {
  const response = await authFetch(`${API_ENDPOINTS.afrcnUsage}${network_type ? `?network_type=${network_type}` : ""}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch RSRPOverTime data');
  }
  return response.json();
};
