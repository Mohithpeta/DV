import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Trackers = () => {
  return (
    <StyledTrackers>
      <h2>Trackers</h2>
      <div className="widget-area">
        <Link to="/BloodPressureChart" className="Trackers-widget">Blood Pressure</Link>
        <Link to="/WeightChart" className="Trackers-widget">Weight</Link>
        <Link to="" className="Trackers-widget">Steps</Link>
        <Link to="/spo2" className="Trackers-widget">SpO2</Link>
        <Link to="" className="Trackers-widget">PPG</Link>
      </div>
    </StyledTrackers>
  );
};

const StyledTrackers = styled.div`
  .widget-area {
    display: flex;
    flex-direction: column;
    gap: 15px;
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
`;

export default Trackers;
