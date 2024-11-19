const API_BASE_URL = 'http://localhost:5062/api/v1/';

export const API_ENDPOINTS = {
  USERS: {
    BASE: `${API_BASE_URL}users`,
    SIGN_IN: `${API_BASE_URL}users/sign-in`,
    SIGN_UP: `${API_BASE_URL}users/sign-up`,
  },
  PETS: {
    BASE: `${API_BASE_URL}pets`,
  },
  HEALTH_RECORDS: {
    BASE: `${API_BASE_URL}health-records`,
  }
};


