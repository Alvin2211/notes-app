import React from 'react';
import './landing_pg.css';
import { Link } from 'react-router-dom';

const to_register = () => {
  window.location.href = '/register'; 
};
const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className='logo-picture'>
          <img src="\eazynotes.png" alt="logo"  />
          <h1 className="logo">EazyNotes</h1>
        </div>
        
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <Link to="/login" className="login-link">Login</Link>
          <button className="register-btn" onClick={to_register}>Sign Up</button>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-text">
          <h2>Your Notes, Organized & Secure</h2>
          <p>EazyNotes helps you keep track of your thoughts anytime, anywhere.</p>
          <button onClick={to_register}>Get Started</button>
        </div>
        <img
          src="https://img.freepik.com/free-vector/hand-drawn-flat-design-notes-illustration_23-2149365025.jpg"
          alt="notes illustration"
          className="hero-image"
        />
      </section>
    </div>
  );
};

export default LandingPage;
