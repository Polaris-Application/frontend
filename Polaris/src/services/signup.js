const API_URL = '/api';

export const fetchUsers = async (email, password, confirm_password, phone_number) => {
  const response = 
  await fetch(`${API_URL}/signup`, {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: email,
        password1: password,
        password2: confirm_password,
        phone_number: phone_number
    })
  })

  if (!response.ok) {
    try{
        const errorData = await response.json();
        errorMsg = errorData.detail || JSON.stringify(errorData);
    } catch {}
    throw new Error(errorMsg)
  }
  return response.json();
};