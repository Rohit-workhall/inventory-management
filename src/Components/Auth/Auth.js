import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

function Auth({ setIsLoggedIn }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation for sign-up
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match!" });
        return;
      }
    }

    const url = isSignUp ? 'http://localhost:5000/api/signup' : 'http://localhost:5000/api/login';
    const payload = isSignUp
      ? { 
          name: formData.name, 
          phone_number: formData.phone_number, 
          email: formData.email, 
          password: formData.password 
        }
      : { email: formData.email, password: formData.password };

    try {
      const response = await axios.post(url, payload);
      setServerMessage(response.data.message);

      if (isSignUp) {
        toggleForm(); // Redirect to login after successful sign-up
      } else {
        const userId = response.data.user.id; 
        const userRole = response.data.user.role; 
        localStorage.setItem('userId', userId);
        localStorage.setItem('Role', userRole);

        setIsLoggedIn(true); // Update parent state
        navigate('/dashboard'); // Redirect to dashboard
      }
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      setServerMessage(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Something went wrong. Please try again."
      );
    }
  };

  const toggleForm = () => {
    setIsSignUp((prevState) => !prevState);
    setFormData({
      name: '',
      phone_number: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    setServerMessage('');
  };

  return (
    <div className="all">
      <div className="app-container">
        <div className="form-container">
          <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

          {serverMessage && <div className="error">{serverMessage}</div>}

          <form className="form" onSubmit={handleSubmit}>
            {isSignUp && (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
            )}

            {isSignUp && (
              <input
                type="number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />
            )}

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