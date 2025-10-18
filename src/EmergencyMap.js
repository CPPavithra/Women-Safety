import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EmergencyMap.css';
import Navbar from './NavBar'; // Import the new Navbar component

// SVG icon for the back button
const BackIcon = () => (
  <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
  </svg>
);
const EmergencyMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Define different sets of nodes for each location
  const locations = {
    location1: [
  { "id": 1, "lat": 12.820776, "lng": 80.037650 },
  { "id": 2, "lat": 12.820914, "lng": 80.037716 },
  { "id": 3, "lat": 12.820736, "lng": 80.037647 },
  { "id": 4, "lat": 12.820580, "lng": 80.037602 },
  { "id": 5, "lat": 12.821016, "lng": 80.037810 },
  { "id": 6, "lat": 12.821010, "lng": 80.037790 },
  { "id": 7, "lat": 12.820210, "lng": 80.036780 },
  { "id": 8, "lat": 12.820183, "lng": 80.037063 },
  { "id": 9, "lat": 12.819426, "lng": 80.036827 },
  { "id": 10, "lat": 12.819287, "lng": 80.036718 },
  { "id": 11, "lat": 12.819068, "lng": 80.037101 },
 { "id": 12, "lat": 12.818893, "lng": 80.037392 },
 { "id": 13, "lat": 12.818901, "lng": 80.037583 },
 { "id": 14, "lat": 12.8186978, "lng": 80.037959 },
 { "id": 15, "lat": 12.818621, "lng": 80.038574 },
 { "id": 16, "lat": 12.818453, "lng": 80.038955 },
 { "id": 17, "lat": 12.818309, "lng": 80.039214 }

    ],
    location2: [
   { "id": 18, "lat": 12.820776, "lng": 80.037650 },
  { "id": 19, "lat": 12.820914, "lng": 80.037716 },
  { "id": 20, "lat": 12.820736, "lng": 80.037647 },
  { "id": 21, "lat": 12.820580, "lng": 80.037602 },
  { "id": 22, "lat": 12.821016, "lng": 80.037810 },
  { "id": 23, "lat": 12.821010, "lng": 80.037790 },
  { "id": 24, "lat": 12.821300, "lng": 80.038000 },
  { "id": 25, "lat": 12.821700, "lng": 80.038400 },
  { "id": 26, "lat": 12.822305, "lng": 80.038767 },
  { "id": 27, "lat": 12.822100, "lng": 80.039100 },
  { "id": 28, "lat": 12.821700, "lng": 80.039400 },
  { "id": 29, "lat": 12.821200, "lng": 80.039700 },
  { "id": 30, "lat": 12.820794, "lng": 80.041226 },
  { "id": 31, "lat": 12.820500, "lng": 80.041000 },
  { "id": 32, "lat": 12.820000, "lng": 80.040700 },
  { "id": 33, "lat": 12.819500, "lng": 80.040300 },
  { "id": 34, "lat": 12.819000, "lng": 80.040000 },
  { "id": 35, "lat": 12.818600, "lng": 80.039700 },
  { "id": 36, "lat": 12.818294, "lng": 80.039396 },
  { "id": 37, "lat": 12.818309, "lng": 80.039214 }
    ],
    location3:
[
  { "id": 38, "lat": 12.820776, "lng": 80.037650 },
  { "id": 39, "lat": 12.820914, "lng": 80.037716 },
  { "id": 40, "lat": 12.820736, "lng": 80.037647 },
  { "id": 41, "lat": 12.820580, "lng": 80.037602 },
  { "id": 42, "lat": 12.821016, "lng": 80.037810 },
  { "id": 43, "lat": 12.821010, "lng": 80.037790 },
  { "id": 44, "lat": 12.820210, "lng": 80.036780 },
  { "id": 45, "lat": 12.820183, "lng": 80.037063 },
  { "id": 46, "lat": 12.819426, "lng": 80.036827 },
  { "id": 47, "lat": 12.819287, "lng": 80.036718 },
  { "id": 48, "lat": 12.819068, "lng": 80.037101 },
 { "id": 49, "lat": 12.818893, "lng": 80.037392 },
 { "id": 50, "lat": 12.818901, "lng": 80.037583 },
 { "id": 51, "lat": 12.8186978, "lng": 80.037959 },
 { "id": 52, "lat": 12.818621, "lng": 80.038574 },
 { "id": 53, "lat": 12.818453, "lng": 80.038955 },
 { "id": 54, "lat": 12.818309, "lng": 80.039214 },
 { "id": 55, "lat": 12.818242, "lng": 80.039603 },
 { "id": 56, "lat": 12.817945, "lng": 80.039998 },
 { "id": 57, "lat": 12.818225, "lng": 80.040181 },
 { "id": 58, "lat": 12.818767, "lng": 80.040620 },
 { "id": 59, "lat": 12.818607, "lng": 80.040897 },
 { "id": 60, "lat": 12.818593, "lng": 80.041109 }

],

  };

const [selectedLocation, setSelectedLocation] = useState('');
  const [currentNodes, setCurrentNodes] = useState([]);

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png", // This icon is fine
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
      const initialCoords = { lat: 12.8471595, lng: 80.0375678 };
      mapInstanceRef.current = L.map(mapRef.current).setView([initialCoords.lat, initialCoords.lng], 14);

      // --- Use a Dark Mode Tile Layer ---
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors & © CartoDB'
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
      L.polyline(polylinePoints, { color: '#007BFF', weight: 3, opacity: 0.7 }) // Brighter blue
        .addTo(mapInstanceRef.current);

      // Add markers for each node
      currentNodes.forEach((node) => {
        L.marker([node.lat, node.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`Node ${node.id}`)
          .on('mouseover', function (e) {
            this.openPopup();
          })
          .on('mouseout', function (e) {
            this.closePopup();
          });
      });

      // Fit map to bounds of the polyline
      if (polylinePoints.length > 0) {
        mapInstanceRef.current.fitBounds(polylinePoints);
      }
    }
  }, [currentNodes, customIcon]); // Added customIcon dependency

  return (
    <div className="emergency-container">
      <header>
        <button className="back-btn" onClick={() => navigate("/")}> {/* Navigate to home or -1 */}
          <BackIcon />
        </button>
        <h1 className="header-title">GET THE SAFEST PATH</h1>
      </header>
      
      <div className="map-container">
        <h2 className="map-title">Select Destination</h2>
        <select onChange={handleLocationChange} value={selectedLocation}>
          <option value="">Select a Location</option>
          <option value="location1">Location 1-Mapped</option>
          <option value="location2">Location 2-Mapped</option>
          <option value="location3">Location 3-Mapped</option>
        </select>
        <div ref={mapRef} id="emergency-map"></div>
      </div>

      {/* Renders the new, consistent Navbar */}
      <Navbar />
    </div>
  );
};

export default EmergencyMap;
