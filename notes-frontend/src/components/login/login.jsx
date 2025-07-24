import React from 'react';
import './login.css';

const Login = () => {
  return (
    <>
      <div className='body_wrapper'>
        <div className='login_container'>
          <h2>Login Page</h2>
          <form action="" className='login_form'>
            <div className='input_container'>
              <input type="text" className="user_input" placeholder='Enter your Email' />
              <input type="password" className='user_input' placeholder='Enter Password' />
              <button type="submit" className='Submit_btn'>Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
