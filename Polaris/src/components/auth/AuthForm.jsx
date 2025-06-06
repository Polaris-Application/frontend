import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import ThemeToggle from '../theme/ThemeToggle';
import logo from '../../assets/polaris-logo.png';
import './AuthForm.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [headerText, setHeaderText] = useState('Login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    general: ''
  });
  const { login, signup, loading } = useAuthContext();

  const handleHeaderAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setHeaderText(isLogin ? 'Sign Up' : 'Login');
      setIsAnimating(false);
    }, 300); // Match this with the CSS animation duration
  };

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      general: ''
    };

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Additional validations for signup
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      const phoneRegex = /^[0-9]{11}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid 11-digit phone number';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const { success, error } = await (isLogin 
        ? login(formData.username, formData.password)
        : signup(
            formData.username, 
            formData.password, 
            formData.confirmPassword,
            formData.phoneNumber
          )
      );

      if (!success && error) {
        setErrors(prev => ({
          ...prev,
          general: error
        }));
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: 'An unexpected error occurred'
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }));
  };

  const toggleMode = () => {
    handleHeaderAnimation();
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      phoneNumber: ''
    });
    setErrors({
      username: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      general: ''
    });
  };

  return (
    <div className="auth-container">
      <ThemeToggle />
      <img src={logo} alt="Polaris Logo" className="logo" />
      <div className={`auth-card ${isLogin ? 'login' : 'signup'}`}>
        <div className="auth-header">
          <h2 className={isAnimating ? 'exit' : ''}>
            {headerText}
          </h2>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <div className="field-error">{errors.username}</div>}
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <div className={`form-group ${isLogin ? 'hidden' : ''}`}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
          </div>

          <div className={`form-group ${isLogin ? 'hidden' : ''}`}>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={errors.phoneNumber ? 'error' : ''}
            />
            {errors.phoneNumber && <div className="field-error">{errors.phoneNumber}</div>}
          </div>

          {errors.general && <div className="error-message">{errors.general}</div>}

          <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="toggle-mode" onClick={toggleMode}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthForm; 