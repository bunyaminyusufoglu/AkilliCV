export const API_BASE_URL = 'http://localhost:5189/api';

export const API_ENDPOINTS = {
    AUTH: {
        PROFILE: `${API_BASE_URL}/Auth/profile`,
        LOGIN: `${API_BASE_URL}/Auth/login`,
        REGISTER: `${API_BASE_URL}/Auth/register`,
    },
    USER_PROFILE: {
        GET_PROFILE: `${API_BASE_URL}/UserProfile/getProfile`,
        CREATE_PROFILE: `${API_BASE_URL}/UserProfile/createProfile`,
        UPDATE_PROFILE: `${API_BASE_URL}/UserProfile/updateProfile`,
    },
    CV_ANALYSIS: {
        VIEW: `${API_BASE_URL}/AI/users`,
    },
    JOBS: {
        LIST: `${API_BASE_URL}/JobSearch/list`,
        SEARCH: `${API_BASE_URL}/JobSearch/search`,
        APPLY: `${API_BASE_URL}/JobSearch/apply`,
    }
}; 