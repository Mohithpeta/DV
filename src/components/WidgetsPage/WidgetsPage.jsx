import React, { useState } from 'react';
import styled from 'styled-components';
import logoDV from './assets/logoDV.png';
import { Link } from 'react-router-dom';

const WidgetsPage = () => {
  const [selectedOption, setSelectedOption] = useState('Trackers');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'Trackers':
        return (
          <div>
            <h2>Trackers</h2>
            <div className="widget-area">
              <Link to="/BloodPressureChart" className="Trackers-widget">Blood Pressure</Link>
              <Link to="" className="Trackers-widget">Weight</Link>
              <Link to="" className="Trackers-widget">Steps</Link>
              <Link to="/spo2" className="Trackers-widget">SpO2</Link>
              <Link to="" className="Trackers-widget">PPG</Link>
            </div>
          </div>
        );
      case 'Med Info':
        return (
          <div className="med-info-content">
            <div className="grid-container">
              {[
                { src: 'image1.png', description: 'Description 1', link: '/article1' },
                { src: 'image2.png', description: 'Description 2', link: '/article2' },
                { src: 'image3.png', description: 'Description 3', link: '/article3' },
                { src: 'image4.png', description: 'Description 4', link: '/article4' },
                { src: 'image5.png', description: 'Description 5', link: '/article5' },
                { src: 'image6.png', description: 'Description 6', link: '/article6' },
              ].map((image, index) => (
                <div key={index} className="grid-item">
                  <Link to={image.link}>
                    <img src={image.src} alt={`MedInfo ${index + 1}`} className="image" />
                  </Link>
                  <p className="description">{image.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
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

  .widget-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 20px;
  }

  .widget {
    padding: 10px;
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

  @media (max-width: 768px) {
    .widget {
      flex: 1 1 100%; /* Full width on smaller screens */
    }
  }

  .Trackers-widget {
    padding: 50px;
    margin: 15px 0;
    width: 50vw;
    border: none;
    border-radius: 5px;
    background-color: #93BFF6;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .Trackers-widget:hover {
    transform: translateY(-5px);
  }

  .med-info-content {
    padding: 20px;

    .grid-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr); /* 2 columns */
      gap: 20px; /* Gap between grid items */
    }

    .grid-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .image {
      width: 100%;
      max-width: 450px; /* Maximum width */
      height: auto;
      max-height: 250px; /* Maximum height */
      border-radius: 8px;
      object-fit: cover; /* Ensure the image covers the area without distortion */
      margin-bottom: 10px;
    }

    .description {
      font-size: 0.9rem;
      color: #333;
      max-width: 450px; /* Ensure the description doesn't overflow */
      height: 100px; /* Fixed height for descriptions */
    }
  }

  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: 1fr; /* Single column on smaller screens */
    }

    .image {
      max-width: 100%; /* Full width for smaller screens */
    }

    .description {
      max-width: 100%; /* Full width for smaller screens */
    }
  }
`;

export default WidgetsPage;
