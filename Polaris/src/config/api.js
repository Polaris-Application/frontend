const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
    base: API_BASE_URL,
    signup: `${API_BASE_URL}/authentication/signup/`,
    login: `${API_BASE_URL}/authentication/login/`,
    getUser: `${API_BASE_URL}/authentication/get_user/`,
    logout: `${API_BASE_URL}/authentication/logout/`,
    locationData: `${API_BASE_URL}/mobile/list-location-data/`,
    RSRPOverTime: `${API_BASE_URL}/mobile/rsrp-over-time/`,
    RSRPvsRSRQ: `${API_BASE_URL}/mobile/scatter-data/`,
    tests: `${API_BASE_URL}/tests/user/`,
    networkData: `${API_BASE_URL}/mobile/network-type-usage/`,
    afrcnUsage: `${API_BASE_URL}/mobile/arfcn-usage/`,
    histogram: `${API_BASE_URL}/mobile/histogram/`,
    generalInfo: `${API_BASE_URL}/tests/event-count/`
};

export default API_ENDPOINTS;
