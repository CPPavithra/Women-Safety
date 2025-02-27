
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HelpSignup.css";
import helpImage from "./images/help.png"; // Ensure this image exists in your project

const HelpSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    locationplace: "",
    helptype: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const passwordMinLength = 6;

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!phoneRegex.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!formData.locationplace.trim()) newErrors.locationplace = "Location is required";
    if (!formData.helptype.trim()) newErrors.helptype = "Help type is required";
    if (formData.password.length < passwordMinLength) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/help-signup", formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      alert(response.data.message);
      navigate("/helplogin"); // Redirect to help login page
    } catch (error) {
      setErrors({ general: error.response?.data.error || "Registration failed. Try again." });
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">💜 Help Registration 💜</h1>
      <div className="image-container">
        <img src={helpImage} alt="Help Logo" className="help-image" />
      </div>
      <form onSubmit={handleSubmit}>
        {["name", "email", "phone", "locationplace", "helptype", "password"].map((field) => (
          <div key={field} className="input-group">
            <label><b>{field.charAt(0).toUpperCase() + field.slice(1)}</b></label>
            <input 
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
            {errors[field] && <p className="error">{errors[field]}</p>}
          </div>
        ))}

        {errors.general && <p className="error">{errors.general}</p>}

        <button type="submit" className="submit-button">Register 💜</button>
      </form>
    </div>
  );
};

export default HelpSignup;

