import { useState, useEffect } from 'react';
import { fetchUsers as loginService } from '../services/login';
import { fetchUsers as signupService } from '../services/signup';
import { getCurrentUser } from '../services/getCurrentUser';
import { logoutUser } from '../services/logout';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const username = localStorage.getItem('username');
        if (accessToken && username) {
          //const userData = await getCurrentUser(username);
          setUser({ username: username});
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(username, password);
      localStorage.setItem('username', username);
      // const userData = await getCurrentUser(username);
      setUser({ username: username});
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, password, confirmPassword, phoneNumber) => {
    setLoading(true);
    setError(null);
    try {
      await signupService(username, password, confirmPassword, phoneNumber);
      // After successful signup, log the user in
      return await login(username, password);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('username');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout
  };
}; 