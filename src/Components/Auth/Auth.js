import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

function Auth({ setIsLoggedIn }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if(isSignUp)
    {
    if ( formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match!";
    }
  }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const url = isSignUp
      ? "http://localhost:5000/api/signup"
      : "http://localhost:5000/api/login";

    const payload = isSignUp
      ? {
          name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email,
          password: formData.password,
        }
      : { email: formData.email, password: formData.password };

      try {
        const response = await axios.post(url, payload);
      
        if (isSignUp) {
          toggleForm();
        } else {
          const userId = response.data.user.id;
          const userRole = response.data.user.role;
          localStorage.setItem("userId", userId);
          localStorage.setItem("Role", userRole);
      
          setIsLoggedIn(true);
          navigate("/dashboard");
        }
      } catch (err) {
        if (err.response) {
          const backendErrors = err.response.data.errors || err.response.data.message;
      
          if (Array.isArray(backendErrors)) {
            const errorMessages = backendErrors.reduce(
              (acc, message, index) => ({
                ...acc,
                [`error-${index}`]: message,
              }),
              {}
            );
            setErrors(errorMessages);
          } else if (typeof backendErrors === "string") {
            setServerMessage(backendErrors);
          }
        } else {
          setServerMessage("Something went wrong. Please try again.");
        }
      }
      
  };

  const toggleForm = () => {
    setIsSignUp((prevState) => !prevState);
    setFormData({
      name: "",
      phone_number: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setServerMessage("");
  };

  return (
    <div className="all">
      <div className="app-container">
        <div className="form-container">
          <h2 className="brand">
            Stock<span className="highlight">Wise</span>
          </h2>

          <form className="form" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
                {errors.name && <div className="error">{errors.name}</div>}
              </div>
            )}

            {isSignUp && (
              <div className="input-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  id="phone_number"
                  type="number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
                {errors.phone_number && (
                  <div className="error">{errors.phone_number}</div>
                )}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              {errors.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>

            {isSignUp && (
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                />
               
              </div>
            )}
            {serverMessage && <div className="error">{serverMessage}</div>}

            {Object.keys(errors).map((key) => (
              <div className="error" key={key}>
                {errors[key]}
              </div>
            ))}

            <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
          </form>

          <div className="toggle-container">
            <span>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button onClick={toggleForm}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

