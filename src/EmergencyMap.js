
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EmergencyMap.css';
import homeIcon from './images/home.png';
import { sendAlertEmail } from "./emailService";
import navigationIcon from './images/navigation.jpg';
import profileIcon from './images/profile.png';
import otherAlertsIcon from "./images/other_alerts.png"; // Replace with actual image path
import { startVideoRecording } from "./recordvideo.js";
import safetyIcon from "./images/safety.png"; // Replace with actual image path
import { Link } from 'react-router-dom'; 


const EmergencyMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Define different sets of nodes for each location
  const locations = {
    location1: [
      { id: 1, lat: 11.0471595, lng: 76.9975678 },
      { id: 2, lat: 11.0469945, lng: 76.9968388 },
      { id: 3, lat: 11.0459246, lng: 76.9965063 }
    ],
    location2: [
      { id: 4, lat: 11.0456369, lng: 76.9952298 },
      { id: 5, lat: 11.0453909, lng: 76.9941377 },
      { id: 6, lat: 11.0458314, lng: 76.993623 }
    ],
    location3: [
      { id: 7, lat: 11.0464149, lng: 76.9934809 },
      { id: 8, lat: 11.046658, lng: 76.9934231 },
      { id: 9, lat: 11.0466754, lng: 76.9932618 }
    ]
  };

  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentNodes, setCurrentNodes] = useState([]);

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -20],
  });

  const handleLocationChange = (e) => {
    const locationId = e.target.value;
    setSelectedLocation(locationId);
    setCurrentNodes(locations[locationId] || []);
  };

  useEffect(() => {
    // Initialize the map if not already done
    if (!mapInstanceRef.current && mapRef.current) {
      // Initialize map at a generic location or the first location's coordinates
      const initialCoords = { lat: 11.0471595, lng: 76.9975678 };
      mapInstanceRef.current = L.map(mapRef.current).setView([initialCoords.lat, initialCoords.lng], 14);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && currentNodes.length > 0) {
      // Clear existing markers and polylines
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add polyline connecting all nodes
      const polylinePoints = currentNodes.map(node => [node.lat, node.lng]);
      L.polyline(polylinePoints, { color: 'blue', weight: 2, opacity: 0.6 })
        .addTo(mapInstanceRef.current);

      // Add markers for each node
      currentNodes.forEach((node) => {
        L.marker([node.lat, node.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`Node ${node.id}`)
          .on('mouseover', function(e) {
            this.openPopup();
          })
          .on('mouseout', function(e) {
            this.closePopup();
          });
      });
    }
  }, [currentNodes]); // Run when currentNodes changes

  return (
    <div className="emergency-container">
      <header>
        <button className="back-btn" onClick={() => navigate("/home")}>🏠</button>
        <h1 className="medbay-title">GET THE SAFEST PATH</h1>
      </header>
      <div className="map-container">
        <h2 className="map-title">Select Destination</h2>
        <select onChange={handleLocationChange} value={selectedLocation}>
          <option value="">Select a Location</option>
          <option value="location1">Location 1</option>
          <option value="location2">Location 2</option>
          <option value="location3">Location 3</option>
        </select>
        <div ref={mapRef} id="emergency-map" style={{ height: "500px", width: "100%" }}></div>
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

export default EmergencyMap;

