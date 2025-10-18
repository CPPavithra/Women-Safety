import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SOSbutton.css'; // Your CSS file
import homeIcon from './images/home.png';
import { sendAlertEmail } from "./emailService";
import navigationIcon from './images/navigation.jpg';
import profileIcon from './images/profile.png';
import otherAlertsIcon from "./images/other_alerts.png";
import { startVideoRecording } from "./recordvideo.js";
import safetyIcon from "./images/safety.png";
import { Link } from 'react-router-dom'; // Consider using NavLink for active styling
import Navbar from './NavBar'; 
// Path to the siren sound file
import sirenSound from './siren.mp3';

// Dummy image paths
import defaultProfilePic from './images/man.png';
import callIcon from './images/call.png';

const SOSButton = () => {
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const newAudio = new Audio(sirenSound);
    setAudio(newAudio);
    return () => {
      newAudio.pause();
      newAudio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('https://she-curity.onrender.com/api/get-profile');
        setContacts(response.data.contacts || []);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        alert('Failed to fetch profile data.');
      }
    };
    fetchContacts();
  }, []);

  
const handleClick = async () => {
  if (!audio) return;

  const isNowPlaying = !playing;
  setPlaying(isNowPlaying);

  if (isNowPlaying) {
    audio.play();
    alert("SOS! Help is on the way!");

    try {
      startVideoRecording();
      
      await sendAlertEmail({
        type: "SOS Alert",
        location: "User's Current Location", // You'll want to replace this with real location data
        details: "Emergency! Immediate help is required.",
        recipientEmail: "cppavithra05@gmail.com", 
      });

      console.log("SOS Email sent successfully!");

      // WARNING: This bluetooth call is a blocking popup and may have
      // poor browser support (e.g., won't work on Safari/iPhone).
      // Consider making this a separate, optional feature.
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"],
      });

      console.log("Connected to device:", device.name);
      alertNearbyDevices();
    } catch (error) {
      console.error("Error during SOS actions:", error);
    }
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
};

  const sendPushNotification = async () => {
    // This function is defined but not currently called.
    try {
      const response = await fetch('https://your-server.com/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'SOS Alert! Help is needed nearby!',
        }),
      });

      if (!response.ok) throw new Error('Failed to send notification');
      console.log('Push notification sent successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const alertNearbyDevices = () => {
    alert('Alert sent to nearby devices via Bluetooth!');
  };

  const handleCall = (number) => {
    alert(`Calling ${number}`);
    // For a real app, you'd use:
    // window.location.href = `tel:${number}`;
  };

  return (
    <div className="container">
      {/* This button is hidden, but you call startVideoRecording. Is this intended? */}
      <button id="startRecording" style={{ display: "none" }}>Start Recording</button>
      
      {/* **CHANGE 1:** Added the `playing` class dynamically.
      */}
      <button 
        className={playing ? 'button playing' : 'button'} 
        onClick={handleClick}
      >
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
              {/* **CHANGE 2:** Wrapped the icon in a <button> for better styling and accessibility.
              */}
              <button className="call-button" onClick={() => handleCall(contact.phone)}>
                <img
                  src={callIcon}
                  alt="Call"
                  className="call-icon"
                />
              </button>
            </div>
          ))
        ) : (
          <p>No contacts found.</p>
        )}
      </div>
<Navbar />
    </div>

  );
};

export default SOSButton;
