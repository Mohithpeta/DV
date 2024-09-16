import React, { useState } from 'react';
import styled from 'styled-components';
import logoDV from './assets/logoDV.png';
import { Link } from 'react-router-dom';
import MedInfoVideos from './MedInfoPage';
import Trackers from './Trackers';  // Import the new Trackers component

const WidgetsPage = () => {
  const [selectedOption, setSelectedOption] = useState('Trackers');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'Trackers':
        return <Trackers />;  // Use the Trackers component
      case 'Med Info':
        return <MedInfoVideos />;
      case 'My Online Consults':
        return <h2>My Online Consults Content</h2>;
      case 'Lab Tests':
        return <h2>Lab Tests Content</h2>;
      case 'Medicine':
        return <h2>Medicine Content</h2>;
      default:
        return <h2>Please select an option</h2>;
    }
  };

  return (
    <StyledWrapper>
      <div className="sidebar">
        <div className="logo">
          <img src={logoDV} alt="Company Logo" className="logo-image" />
          <h1 className="company-name">DeepVital</h1>
        </div>
        <div className="widget-container">
          {['Trackers', 'Med Info', 'My Online Consults', 'Lab Tests', 'Medicine'].map(option => (
            <div
              key={option}
              className={`widget ${selectedOption === option ? 'active' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
      <div className="content-area">
        {renderContent()}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f0f0;
  width: 100vw;

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

  .widget-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 20px;
  }

  .widget {
    padding: 20px;
    margin: 5px 0;
    width: 100%;
    border: none;
    border-radius: 5px;
    background-color: #93BFF6;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
  }

  .widget:hover {
    background-color: #4D76B3;
    transform: translateY(-5px);
  }

  .widget.active {
    background-color: #4D76B3;
    font-weight: bold;
  }

  .content-area {
    flex: 1;
    padding: 20px;
  }
`;

export default WidgetsPage;
