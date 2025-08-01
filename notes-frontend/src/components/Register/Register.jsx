import React, { useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, agreed } = formData;

    if (!agreed) {
      alert("Please agree to the terms.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // for cookie support
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful!");
        window.location.href = '/login';  
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className='register_container'>
      <h2>Sign Up To Start Using EazyNotes</h2>
      {/* <img src="\eazynotes.png" alt="" /> */}
      <form onSubmit={handleSubmit} className='register_form'>
        <div className='input_container'>
          <input type="text" name="name" className="user_input" placeholder='Enter your Name' onChange={handleChange} required />
          <input type="email" name="email" className='user_input' placeholder='Enter your Email' onChange={handleChange} required />
          <input type="password" name="password" className='user_input' placeholder='Enter Password' onChange={handleChange} required />
          <input type="password" name="confirmPassword" className='user_input' placeholder='Confirm Password' onChange={handleChange} required />
        </div>
        <div className='terms_container'>
          <input type="checkbox" id="terms" name="agreed" onChange={handleChange} required />
          <label htmlFor="terms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</label>
        </div>
        <button type="submit" className='Submit_btn'>Register</button>
      </form>
      <p className='login_prompt'>Already have an account? 
        <Link to="/login" className="login-link">Login</Link><br />
        <Link to="/" className="login-link">Home</Link>
      </p>
    </div>
  );
};

export default Register;
