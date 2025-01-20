const API_BASE_URL = 'http://localhost:5062/api/v1/';

export const API_ENDPOINTS = {
  USERS: {
    BASE: `${API_BASE_URL}users`,
    CURRENT_LOGGED_USER: `${API_BASE_URL}users/user`,
    SIGN_IN: `${API_BASE_URL}users/sign-in`,
    SIGN_UP: `${API_BASE_URL}users/sign-up`,
    RESET_PASSWORD: `${API_BASE_URL}users/forgot-password`,
  },
  PETS: {
    BASE: `${API_BASE_URL}pets`,
  },
  HEALTH_RECORDS: {
    BASE: `${API_BASE_URL}health-records`,
  },
  ADMIN: {
    BASE: `${API_BASE_URL}admin`,
    BROWSE_USERS: `${API_BASE_URL}admin/users`,
    DELETE_USER: (userId: string) => createUrl(
      `${API_BASE_URL}admin/users/{{userId}}`,
      { userId }
    ),
  }
};

const createUrl = (template: string, params: Record<string, string>) => {
  let url = template;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`{{${key}}}`, value);
  }
  return url;
};


