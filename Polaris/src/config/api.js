const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
    base: API_BASE_URL,
    signup: `${API_BASE_URL}/authentication/signup/`,
    login: `${API_BASE_URL}/authentication/Login/`,
    getUser: `${API_BASE_URL}/authentication/get_user/`,
    logout: `${API_BASE_URL}/authentication/Logout/`
};

export default API_ENDPOINTS; 
 