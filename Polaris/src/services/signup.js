import { API_ENDPOINTS } from '../config/api';

export const fetchUsers = async (username, password, confirm_password, phone_number) => {
  const response = 
  await fetch(API_ENDPOINTS.signup, {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: username,
        password1: password,
        password2: confirm_password,
        phone_number: phone_number
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    let errorMsg;
    if (typeof data === 'object' && data !== null) {
      const firstField = Object.keys(data)[0];
      errorMsg = data[firstField][0];
    } else {
      errorMsg = data.detail || JSON.stringify(data);
    }
    throw new Error(errorMsg);
  }
  
  return data;
};