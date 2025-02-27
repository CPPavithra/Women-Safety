import React from "react";
import { Link } from "react-router-dom";
import homeIcon from './images/home.png';
import { sendAlertEmail } from "./emailService";
import navigationIcon from './images/navigation.jpg';
import profileIcon from './images/profile.png';
import otherAlertsIcon from "./images/other_alerts.png"; // Replace with actual image path
import safetyIcon from "./images/safety.png"; // Replace with actual image path
import "./NavBar.css"; // Import the CSS for styling

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-item">
        <Link to="/" className="nav-link">
          <img src={homeIcon} alt="Home" className="nav-icon" />
          <span className="nav-text">Home</span>
        </Link>
      </div>

      <div className="nav-item">
        <Link to="/navigation" className="nav-link">
          <img src={navigationIcon} alt="Navigation" className="nav-icon" />
          <span className="nav-text">Navigation</span>
        </Link>
      </div>

      <div className="nav-item">
        <Link to="/profile" className="nav-link">
          <img src={profileIcon} alt="Profile" className="nav-icon" />
          <span className="nav-text">Profile</span>
        </Link>
      </div>

      <div className="nav-item">
        <Link to="/other-alerts" className="nav-link">
          <img src={otherAlertsIcon} alt="Other Alerts" className="nav-icon" />
          <span className="nav-text">
            Other Alerts <span style={{ color: "red" }}>!</span>
          </span>
        </Link>
      </div>

      <div className="nav-item">
        <Link to="/safetymeasures" className="nav-link">
          <img src={safetyIcon} alt="Safety Measures" className="nav-icon" />
          <span className="nav-text">Safety Measures</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

