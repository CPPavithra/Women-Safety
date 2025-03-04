import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './SOSbutton.css'; // Import the CSS file
import homeIcon from './images/home.png';
import { sendAlertEmail } from "./emailService";
import navigationIcon from './images/navigation.jpg';
import profileIcon from './images/profile.png';
import otherAlertsIcon from "./images/other_alerts.png"; // Replace with actual image path
import { startVideoRecording } from "./recordvideo.js";
import safetyIcon from "./images/safety.png"; // Replace with actual image path
import { Link } from 'react-router-dom'; 

// Path to the siren sound file (you can use any siren sound in .mp3 format)
import sirenSound from './siren.mp3';

// Dummy image paths (replace with actual paths)
import defaultProfilePic from './images/man.png';
import callIcon from './images/call.png';

const SOSButton = () => {
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Initialize the audio object once
    const newAudio = new Audio(sirenSound);
    setAudio(newAudio);

    // Clean up the audio object on component unmount
    return () => {
      newAudio.pause();
      newAudio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    // Fetch contact data when the component mounts
    const fetchContacts = async () => {
      try {
        const response = await axios.get('https://she-curity.onrender.com/api/get-profile');
        const data = response.data;

        // Set contacts from profile data
        setContacts(data.contacts || []);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        alert('Failed to fetch profile data.');
      }
    };

    fetchContacts();
  }, []);

 
const handleClick = async () => {
  if (!audio) return;

  setPlaying(!playing);
  if (!playing) {
    audio.play();
    alert("SOS! Help is on the way!");

    try {
startVideoRecording();
      // **Send Email Alert**
      await sendAlertEmail({
        type: "SOS Alert",
        location: "User's Current Location",
        details: "Emergency! Immediate help is required.",
        recipientEmail: "cppavithra05@gmail.com", // Replace with dynamic recipient if needed
      });

      console.log("SOS Email sent successfully!");

      // **Trigger Bluetooth Alert**
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"],
      });

      console.log("Connected to device:", device.name);
      alertNearbyDevices();
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
};

  const sendPushNotification = async () => {
    // Replace with your backend API endpoint
    try {
      const response = await fetch('https://your-server.com/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'SOS Alert! Help is needed nearby!',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
      console.log('Push notification sent successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const alertNearbyDevices = () => {
    // This is a mock function to represent sending an alert to nearby devices
    // In a real-world scenario, this could involve writing data to a Bluetooth GATT service
    alert('Alert sent to nearby devices via Bluetooth!');
  };

  const handleCall = (number) => {
    // Logic to handle phone call
    alert(`Calling ${number}`);
  };

  return (
    <div className="container">
<button id="startRecording" style={{ display: "none" }}>Start Recording</button>
      <button className="button" onClick={handleClick}>
        {playing ? 'STOP' : 'SOS'}
      </button>
      <div className="contacts">
        <h3 className="priorities-heading">Your Priorities</h3>
        {contacts.length > 0 ? (
          contacts.map((contact, index) => (
            <div key={index} className="contact-bubble">
              <img src={defaultProfilePic} alt="Profile" className="contact-image" />
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-number">{contact.phone}</div>
              </div>
              <img
                src={callIcon}
                alt="Call"
                className="call-icon"
                onClick={() => handleCall(contact.phone)}
              />
            </div>
          ))
        ) : (
          <p>No contacts found.</p>
        )}
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

export default SOSButton;
