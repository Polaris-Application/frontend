const API_URL = '/api';

export const fetchUsers = async (email, password) => {
  const response = 
  await fetch(`${API_URL}/login`, {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: email,
        password: password,
    })
  })

  if(!response.ok){
    const errorMsg = data.message || JSON.stringify(data)
    throw new Error(errorMsg)
  }

  const data = await response.json()
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);

  return data;
};