import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Signin from './components/Signinup/Signin'; 
import Signup from './components/Signinup/Signup';// Import SignIn component
import WidgetsPage from './components/WidgetsPage/WidgetsPage.jsx';
import BloodPressureChart from './components/WidgetsPage/Trackers/BPChart.jsx';
import TrackersPage from './components/WidgetsPage/TrackersPage.jsx';
import SpO2Chart from './components/WidgetsPage/Trackers/spo2.jsx';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/widgetspage" element={<WidgetsPage />} />
        <Route path="/TrackersPage" element={<TrackersPage />} />
        <Route path="/BloodPressureChart" element={<BloodPressureChart />} />
        <Route path="/spo2" element={<SpO2Chart />} />
        {/* Add more routes here if needed */}
      </Routes>
    </Router>
  );
};

export default App;
