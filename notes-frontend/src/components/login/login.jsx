// import React from 'react';
// import './login.css';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   return (
//     <>
//       <div className='body_wrapper'>
//         <div className='login_container'>
//           <h2>Login Page</h2>
//           <form action="" className='login_form'>
//             <div className='input_container'>
//               <input type="email" className="user_input" placeholder='Enter your Email' required />
//               <input type="password" className='user_input' placeholder='Enter Password' required/>
//               <button type="submit" className='Submit_btn'>Login</button>
//             </div>
//           </form>
//           <p className='register_prompt'>Don't have an account? 
//             <a href="/register" className="register-link">Register</a>
//           </p>
//           <p className='home_prompt'>Go back to 
//             <Link to="/" className="home-link">Home</Link> 
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/login", {
        method: 'POST',
        credentials: 'include', // to send cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        navigate('/user-portal', { state: {name:data.user.name} }); 
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Something went wrong. Try again.');
    }
  };

  return (
    <div className="body_wrapper">
      <div className="login_container">
        <h2>Login</h2>
        <form className="login_form" onSubmit={handleLogin}>
          <input
            type="email"
            className="user_input"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="user_input"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="Submit_btn">Login</button>
        </form>
        <p className="register_prompt">
          Don't have an account?
          <Link to="/register" className="register-link"> Register</Link>
        </p>
        <p className="home_prompt">
          Go back to
          <Link to="/" className="home-link"> Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
