import React from 'react';
import styled from 'styled-components';
import logoDV from './assets/logoDV.png';
import { Link } from 'react-router-dom';

const TrackersPage = () => {
  return (
    <StyledWrapper>
      <div className="sidebar">
        <div className="logo">
          <img src={logoDV} alt="Company Logo" className="logo-image" />
          <h1 className="company-name">DeepVital</h1>
        </div>
        <div className="button-container">
        <Link to="/TrackersPage" className="tracker">Trackers</Link>
          <Link to="/MedInfo" className="tracker">Med Info</Link>
          <Link to="/MYOnlineConsults" className="tracker">My Online Consults</Link>
          <Link to="/LabTests" className="tracker">Lab Tests</Link>
          <Link to="/Medicine" className="tracker">Medicine</Link>
        </div>
      </div>
      <div className="widget-area">
        <Link to="/BloodPressureChart" className="widget">Blood Pressure</Link>
        <Link to="" className="widget">Weight</Link>
        <Link to="" className="widget">Steps</Link>
        <Link to="/spo2" className="widget">SpO2</Link>
        <Link to="" className="widget">PPG</Link>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  height: 100vh; /* Full viewport height */
  background-color: #f0f0f0;
  width: 100vw; /* Full viewport width */

  .sidebar {
    width: 300px;
    background-color: #7DF4B5;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  .logo {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }

  .logo-image {
    width: 50px;
    height: auto;
  }

  .company-name {
    margin-left: 10px;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 20px;
  }

  .sidebar-button {
    padding: 10px;
    margin: 5px 0;
    width: 100%;
    border: none;
    border-radius: 5px;
    background-color: #93BFF6;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .sidebar-button:hover {
    background-color: #4D76B3;
  }

  .widget-area {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    align-content: flex-start;
  }

  .widget {
    flex: 1 1 calc(50% - 40px); /* Adjusts to half of the available width minus the gap */
    text-align: center;
    padding-right: 80px;
    padding-left: 80px;
    padding-top: 100px;
    padding-bottom: 100px;
    margin: 10px;
    border-radius: 10px;
    background-color: #93BFF6;
    color: #fff;
    font-size: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
  }



  .tracker{
  flex: 1 1 calc(50% - 40px); /* Adjusts to half of the available width minus the gap */
    text-align: center;
    padding: 20px;
    margin: 20px;
    gap: 20px;
    border-radius: 10px;
    background-color: #93BFF6;
    color: #fff;
    font-size: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
  }
    .tracker:hover{
     transform: translateY(-10px)}

  .widget:hover {
    transform: translateY(-10px);
  }

  @media (max-width: 768px) {
    .widget {
      flex: 1 1 100%; /* Full width on smaller screens */
    }
  }
`;

export default TrackersPage;
