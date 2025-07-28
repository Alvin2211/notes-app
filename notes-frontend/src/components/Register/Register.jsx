import React from 'react'
import './Register.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className='register_container'>
        <h2>Sign Up To Start Using EazyNotes</h2>
        <img src="" alt="" />
        <form action="" className='register_form'>
            <div className='input_container'>   
                <input type="text" className="user_input" placeholder='Enter your Name' />
                <input type="email" className='user_input' placeholder='Enter your Email' />
                <input type="password" className='user_input' placeholder='Enter Password' />
                <input type="password" className='user_input' placeholder='Confirm Password' />
            </div>
            <div className='terms_container'>   
                <input type="checkbox" id="terms" name="terms" />
                <label htmlFor="terms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</label>
            </div>    
            <button type="submit" className='Submit_btn'>Register</button>
        </form>
        <p className='login_prompt'>Already have an account? 
        <Link to="/login" className="login-link">Login</Link></p>

         
    </div>
  )
}

export default Register
