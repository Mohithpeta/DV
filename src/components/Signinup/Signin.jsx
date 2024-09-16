import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";
import WidgetsPage from "../WidgetsPage/WidgetsHomePage.jsx";


const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signin', formData);
      console.log('Response:', response.data);
      // Handle successful response here (e.g., redirect, show a message, etc.)
    } catch (error) {
      console.error('Error:', error);
      // Handle error here (e.g., show an error message)
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="hero">
          <form onSubmit={handleSubmit} className="form">
            <div className="logo">DeepVital</div>
            <input
              type="tel"
              name="email"
              id="email"
              required
              className="input"
              placeholder="Phone Number"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              id="password"
              required
              className="input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <Link to="/widgetspage" className="input submit" >Log in</Link>
            <div className="or">or</div>
            <p className="signup">
              Don&apos;t have an account? <Link to="/Signup">SignUp</Link>
            </p>
          </form>
        </div>
      </div>
    </StyledWrapper>
  );
};






const StyledWrapper = styled.div`
  /* Full viewport height and horizontal centering */
  .container {
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 20px; /* Add padding for responsiveness */
  }

  /* Centering the form container and setting max width */
  .hero {
    width: 100%;
    max-width: 500px; /* Adjust this value as needed */
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center; /* Center form inside hero */
  }

  /* Center the form content */
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    width: 100%; /* Full width of the container */
  }

  .input {
    padding: 1rem 1.2rem;
    margin: 1rem 0; /* Adjusted margin for better spacing */
    border-radius: 2rem;
    display: block;
    width: 80%; /* Adjust to fit within the container */
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
