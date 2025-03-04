import React, { useState, useRef } from 'react';
import axios from 'axios';
import './NavigationPage.css'; // Import your CSS file
import mapImage from './images/map.png';
import homeIcon from './images/home.png';
import { sendAlertEmail } from "./emailService";
import navigationIcon from './images/navigation.jpg';
import profileIcon from './images/profile.png';
import otherAlertsIcon from "./images/other_alerts.png"; // Replace with actual image path
import { startVideoRecording } from "./recordvideo.js";
import safetyIcon from "./images/safety.png"; // Replace with actual image path

import { Link } from 'react-router-dom'; 

const NavigationPage = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([
    { id: '1', name: 'Location 1', x: 1000, y: 369 },
    { id: '2', name: 'Location 2', x: 200, y: 150 },
    { id: '3', name: 'Location 3', x: 350, y: 200 }
  ]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const handleLocationChange = (e) => {
    const selectedId = e.target.value;
    const location = locations.find(loc => loc.id === selectedId);
    setSelectedLocation(selectedId);
    setCurrentLocation(location);
  };

  const handleSetLocation = async () => {
    try {
      if (selectedLocation) {
        const response = await axios.post('http://localhost:5000/api/set-location', {
          locationId: selectedLocation
        });
        alert('Location set successfully');
      } else {
        alert('Please select a location');
      }
    } catch (error) {
      console.error('Error setting location:', error);
      alert('Failed to set location.');
    }
  };

  return (
    <div className="navigation-page">
      <div className="map-container">
        <img
          src={mapImage} // Replace with your map image path
          alt="Map"
          className="map-image"
        />
        {currentLocation && (
          <div
            className="map-tracker"
            style={{
              top: `${currentLocation.y}px`,
              left: `${currentLocation.x}px`
            }}
          >
            <div className="tracker-dot"></div>
          </div>
        )}
      </div>
      <div className="controls">
        <select onChange={handleLocationChange} value={selectedLocation}>
          <option value="">Select a Location</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
        <button onClick={handleSetLocation}>Set Location</button>
      </div>
    
<div className="navbar">
  <div className="nav-item">
    <Link to="/" className="nav-link">
      <img src={homeIcon} alt="Home" className="contact-image" />
      <span className="nav-text">Home</span>
    </Link>
  </div>

  <div className="nav-item">
    <Link to="/navigation" className="nav-link">
      <img src={navigationIcon} alt="Navigation" className="contact-image" />
      <span className="nav-text">Navigation</span>
    </Link>
  </div>

  <div className="nav-item">
    <Link to="/profile" className="nav-link">
      <img src={profileIcon} alt="Profile" className="contact-image" />
      <span className="nav-text">Profile</span>
    </Link>
  </div>

  <div className="nav-item">
    <Link to="/other-alerts" className="nav-link">
      <img src={otherAlertsIcon} alt="Other Alerts" className="contact-image" />
      <span className="nav-text">Other Alerts <span style={{ color: "red" }}>!</span></span>
    </Link>
  </div>

  <div className="nav-item">
    <Link to="/safetymeasures" className="nav-link">
      <img src={safetyIcon} alt="Safety Measures" className="contact-image" />
      <span className="nav-text">Safety Measures</span>
    </Link>
  </div>
</div>
    </div>
  );
};

export default NavigationPage;
