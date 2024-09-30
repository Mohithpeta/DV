import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users', formData);
      console.log('Response:', response.data);
      navigate('/WidgetsPage');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGoogleSuccess = async (response) => {
    console.log('Google response:', response);
    try {
      // Send the token to your backend for verification and sign-in
      const res = await axios.post('http://localhost:5000/api/auth/google/login', {
        idToken: response.credential // Use idToken from Google response
      });

      const { accessToken } = res.data;
      localStorage.setItem('accessToken', accessToken);

      navigate('/WidgetsPage');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google Sign-In error:', error);
  };

  return (
    <GoogleOAuthProvider clientId='890897044907-mbdfr89gjjk8jv2firng89p7bn7vf7hn.apps.googleusercontent.com'>
      <StyledWrapper>
        <div className='container'>
          <div className='hero'>
            <form onSubmit={handleSubmit} className='form'>
              <div className='logo'>DeepVital</div>
              <input
                type='email'
                name='email'
                id='email'
                required
                className='input'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type='password'
                name='password'
                id='password'
                required
                className='input'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
              />
              <input type='submit' value='Log in' className='input submit' />
              <div className='or'>or</div>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                style={{ marginTop: '20px' }}
              />
              <div className='or'>or</div>
              <p className='signup'>
                Don&apos;t have an account? <Link to='/Signup'>Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </StyledWrapper>
    </GoogleOAuthProvider>
  );
};

const StyledWrapper = styled.div`
  .container {
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 20px;
  }

  .hero {
    width: 100%;
    max-width: 500px;
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    width: 100%;
  }

  .input {
    padding: 1rem 1.2rem;
    margin: 1rem 0;
    border-radius: 2rem;
    display: block;
    width: 80%;
    border: none;
    box-shadow: inset 6px 6px 8px rgba(97, 97, 97, 0.075),
      6px 6px 6px rgba(255, 255, 255, 0.781);
    outline: none;
    background-color: inherit;
    color: rgb(161, 161, 161);
    font-size: inherit;
    text-align: center;
  }

  .submit, .btn {
    margin-top: 20px;
    font-weight: bold;
    box-shadow: -3px -3px 5px white, 3px 3px 5px rgba(209, 209, 209, 0.705);
    color: rgb(112, 112, 112);
    cursor: pointer;
  }

  .btn {
    text-align: center;
    color: black;
  }

  .logo {
    font-size: 3rem;
    color: black;
    font-weight: 600;
    margin-bottom: 30px;
  }

  ::placeholder {
    color: rgb(161, 161, 161);
  }

  .forgotten {
    text-align: center;
    font-size: .8rem;
    width: 80%;
    color: gray;
    margin: 15px 0;
  }

  a {
    color: inherit;
    font-weight: bold;
    text-decoration: none;
  }

  .or {
    position: relative;
    font-weight: bold;
    color: rgb(112, 112, 112);
    margin: 20px 0;
  }

  .or::before, .or::after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    top: 50%;
    margin: 0 6px;
    background-color: rgba(0, 0, 0, 0.479);
  }

  .or::before {
    right: 100%;
  }

  .or::after {
    left: 100%;
  }

  .signup {
    color: green;
    margin-top: 15px;
    font-size: 1rem;
  }
`;

export default Signin;
