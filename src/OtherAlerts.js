import React, { useState } from "react";
import "./OtherAlerts.css";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import ModalComponent from "./ModalComponent";
import alertlogo from "./images/alertlogo.png";
import homeIcon from './images/home.png';
import { sendAlertEmail } from "./emailService";
import navigationIcon from './images/navigation.jpg';
import profileIcon from './images/profile.png';
import otherAlertsIcon from "./images/other_alerts.png"; // Replace with actual image path
import safetyIcon from "./images/safety.png"; //
import { useNavigate } from "react-router-dom";

const initialAlerts = [
  { type: "Eve Teasing Alert", icon: "🚨", sendEmail: true },
  { type: "Medical Alert",  icon: "🚑", sendEmail: true },
  { type: "Safe Zone Nearby", icon: "🛡️" },
  { type: "Self-Defense Workshop",  icon: "🥋" },
  { type: "Women's Helpline", icon: "📞" }
];

const hardcodedSafeZones = {
  "SRM": [
    { name: "SRM University", address: "Kattankulathur, Chennai" },
    { name: "SRM Hostel", address: "Near Potheri Station" }
  ],
  "IIT": [
    { name: "IIT Madras", address: "Guindy, Chennai" },
    { name: "IIT Research Park", address: "Taramani, Chennai" }
  ],
  "Anna": [
    { name: "Anna University", address: "Guindy, Chennai" }
  ]
};

const hardcodedWorkshops = [
  "Women's Safety & Self-Defense - Chennai", 
  "Self-Defense Training - Bangalore", 
  "Martial Arts for Women - Delhi",
  "Karate Workshop - Mumbai"
];

const OtherAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isAddAlert, setIsAddAlert] = useState(false);
  const [safeZoneSearch, setSafeZoneSearch] = useState("");
  const [safeZones, setSafeZones] = useState([]);
  
  const handleAlertClick = (selectedAlert) => {
    if (selectedAlert.type === "Safe Zone Nearby") {
      setCurrentAlert(selectedAlert);
      setIsModalOpen(true);
    } else if (selectedAlert.type === "Self-Defense Workshop") {
      setCurrentAlert({ type: "Self-Defense Workshop", details: hardcodedWorkshops.join("\n") });
      setIsModalOpen(true);
    } else if (selectedAlert.type === "Women's Helpline") {
      setCurrentAlert({ type: "Women's Helpline", details: "Call 1091 for women's helpline" });
      setIsModalOpen(true);
    } else {
      setCurrentAlert(selectedAlert);
      setIsAddAlert(false);
      setIsModalOpen(true);
    }
  };

  const handleAddAlertClick = () => {
    setCurrentAlert({ type: "", details: "", sendEmail: true });
    setIsAddAlert(true);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentAlert(null);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const alertDetails = {
      type: form.type.value,
      details: form.details.value,
      sendEmail: true,
    };

    try {
      await sendAlertEmail(alertDetails);
      setAlerts([...alerts, alertDetails]);
      handleModalClose();
    } catch (error) {
      console.error("Failed to send alert:", error);
      alert("There was an error processing the alert.");
    }
  };

  const handleSafeZoneSearch = () => {
    const result = hardcodedSafeZones[safeZoneSearch] || [];
    setSafeZones(result);
  };

  return (
    <div className="alert-container">
      <header>
        <button className="back-btn" onClick={() => navigate("/home")}>🏠</button>
        <h1>Other Alerts</h1>
        <FiBell className="bell-icon" />
      </header>
  <div className="image-container">
        <img src={alertlogo} alt="sihpic" className="sih-pic" />
        </div>

      <div className="alert-list">
        {alerts.map((alert, index) => (
          <div key={index} className="alert-card" onClick={() => handleAlertClick(alert)}>
            <div className="alert-info">
              <h2>{alert.type}</h2>
              <p>{alert.details}</p>
            </div>
            <span className="alert-icon">{alert.icon}</span>
          </div>
        ))}
      </div>

      <button className="add-alert-btn" onClick={handleAddAlertClick}>
        ADD ALERTS <span className="plus-icon">+</span>
      </button>

      {isModalOpen && (
        <ModalComponent isOpen={isModalOpen} onRequestClose={handleModalClose}>
          <h2>{currentAlert?.type}</h2>
          {currentAlert?.type === "Safe Zone Nearby" ? (
            <>
              <input
                type="text"
                placeholder="Enter your location"
                value={safeZoneSearch}
                onChange={(e) => setSafeZoneSearch(e.target.value)}
              />
              <button onClick={handleSafeZoneSearch}>Search</button>
              <ul>
                {safeZones.length > 0 ? (
                  safeZones.map((zone, index) => (
                    <li key={index}>{zone.name} - {zone.address}</li>
                  ))
                ) : (
                  <p>No safe zones found</p>
                )}
              </ul>
            </>
          ) : currentAlert?.type === "Eve Teasing Alert" || currentAlert?.type === "Medical Alert" || isAddAlert ? (
            <form onSubmit={handleFormSubmit}>
              <label>
                Alert Type:
                <input type="text" name="type" defaultValue={currentAlert?.type} required />
              </label>
              <label>
                Details:
                <textarea name="details" defaultValue={currentAlert?.details} required />
              </label>
              <button type="submit">Submit</button>
            </form>
          ) : (
            <p>{currentAlert?.details}</p>
          )}
        </ModalComponent>
      )}
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

export default OtherAlerts;

