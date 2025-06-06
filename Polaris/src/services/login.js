import { API_ENDPOINTS } from '../config/api';

export const fetchUsers = async (username, password) => {
  const response = 
  await fetch(API_ENDPOINTS.login, {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: username,
        password: password,
    })
  });

  const data = await response.json();

  if(!response.ok) {
    let errorMsg;
    if (typeof data === 'object' && data !== null) {
      const firstField = Object.keys(data)[0];
      errorMsg = data[firstField][0];
    } else {
      errorMsg = data.detail || JSON.stringify(data);
    }
    throw new Error(errorMsg);
  }

  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);

  return data;
};