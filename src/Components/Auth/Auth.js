import React, { useState } from "react";
import Joi from "joi";
import axios from "axios";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

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

  const validationSchema = {
    name: Joi.string().min(3).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters long",
    }),
    phone_number: Joi.string()
      .length(10)
      .pattern(/^\d+$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number must contain only digits",
        "string.length": "Phone number must be exactly 10 digits",
      }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
      }),
    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
        )
      )
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must include uppercase, lowercase, number, and special character",
      }),
    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Confirm password is required",
      }),
  };    

    const handleValidation = () => {
      const schema = isSignUp
      ? Joi.object(validationSchema)
      : Joi.object({
          email: validationSchema.email,
          password: validationSchema.password,
        });
    
      // Validate the form data
      const { error } = schema.validate(formData, { 
        abortEarly: false, 
        stripUnknown: !isSignUp // Strip unknown fields in login mode
      });
    
      if (error) {
        const validationErrors = {};
        error.details.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
        return false;
      }
    
      setErrors({});
      return true;
    };
    

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!handleValidation()) {
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
      : {
          email: formData.email,
          password: formData.password,
        };
  
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Response from backend:", response.data);
  
      if (isSignUp) {
        toggleForm();
        notification.open({message:"SignUp Successfull", description:"Login to Continue"});
      } else {
        const { user } = response.data;
  
        // Ensure user object exists and has the necessary fields
        if (user && user.id) {
          localStorage.setItem("userId", user.id);
          localStorage.setItem("Role", user.role);
          setIsLoggedIn(true);
          notification.open({message:"Login Successfull"});
          navigate("/dashboard");
        } else {
          setServerMessage("Unexpected response from the server.");
        }
      }
    } catch (err) {
      console.error("Error from backend:", err.response);
  
      if (err.response) {
        const backendErrors =
          err.response.data.errors || err.response.data.message;
  
        if (Array.isArray(backendErrors)) {
          setServerMessage(backendErrors.join(", "));
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
                />
                {errors.name && <div className="error">{errors.name}</div>}
              </div>
            )}

            {isSignUp && (
              <div className="input-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  id="phone_number"
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
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
                />
                {errors.confirmPassword && (
                  <div className="error">{errors.confirmPassword}</div>
                )}
              </div>
            )}

            {serverMessage && <div className="error">{serverMessage}</div>}

            <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
          </form>

          <div className="toggle-container">
            <span>
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account?"}
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
