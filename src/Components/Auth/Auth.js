// App.js

import React, { useState } from 'react';
import './Auth.css';

function Auth() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
    });
    const [errors, setErrors] = useState({
      email: '',
      password: '',
      confirmPassword: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const validateForm = () => {
      let isValid = true;
      const newErrors = {};
  
      // Email Validation
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email.';
        isValid = false;
      }
  
      // Password Validation
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.';
        isValid = false;
      }
  
      // Confirm Password Validation (Only for Sign Up)
      if (isSignUp && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
        isValid = false;
      }
  
      setErrors(newErrors);
      return isValid;
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (validateForm()) {
        // Handle successful form submission (can be replaced with API call)
        alert(`${isSignUp ? 'Sign Up' : 'Sign In'} successful!`);
      }
    };
  
    const toggleForm = () => {
      setIsSignUp((prevState) => !prevState);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({
        email: '',
        password: '',
        confirmPassword: '',
      });
    };
  
    return (
        <div className='all'>
      <div className="app-container">
        <div className="form-container">
          <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
  
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
  
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            {errors.password && <div className="error">{errors.password}</div>}
  
            {isSignUp && (
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            )}
            {isSignUp && errors.confirmPassword && (
              <div className="error">{errors.confirmPassword}</div>
            )}
  
            <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          </form>
  
          <div className="toggle-container">
            <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
            <button onClick={toggleForm}>{isSignUp ? 'Sign In' : 'Sign Up'}</button>
          </div>
        </div>
      </div>
      </div>
    );
  }
  
  export default Auth;