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
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({
    email: '',
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
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      general: ''
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
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
        ? login(formData.email, formData.password)
        : signup(
            formData.email, 
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
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: ''
    });
    setErrors({
      email: '',
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
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
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
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default AuthForm; 