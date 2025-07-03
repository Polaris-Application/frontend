import { authFetch } from '../../hooks/authFetch';
import { API_ENDPOINTS } from '../../config/api';

// Fetches location data from the backend API (authenticated)
export const fetchTests = async (name, domain) => {
  const response = await authFetch(`${API_ENDPOINTS.tests}${name ? `?name=${name}` : ""}${domain ? `&domain=${domain}` : ""}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch test data');
  }
  return response.json();
};
