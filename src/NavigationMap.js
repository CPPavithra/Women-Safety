import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EmergencyMap.css';

const EmergencyMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Markers data array
  const markersData = [
  { id: 1, lat: 11.0471595, lng: 76.9975678 },
  { id: 2, lat: 11.0469945, lng: 76.9968388 },
  { id: 3, lat: 11.0459246, lng: 76.9965063 },
  { id: 4, lat: 11.0456369, lng: 76.9952298 },
  { id: 5, lat: 11.0453909, lng: 76.9941377 },
  { id: 6, lat: 11.0458314, lng: 76.993623 },
  { id: 7, lat: 11.0464149, lng: 76.9934809 },
  { id: 8, lat: 11.046658, lng: 76.9934231 },
  { id: 9, lat: 11.0466754, lng: 76.9932618 },
  { id: 10, lat: 11.0463817, lng: 76.9923289 },
  { id: 11, lat: 11.0475849, lng: 76.9920513 },
  { id: 12, lat: 11.0479569, lng: 76.9919631 },
  { id: 13, lat: 11.048046, lng: 76.9923739 },
  { id: 14, lat: 11.0491254, lng: 76.9921065 },
  { id: 15, lat: 11.051264, lng: 76.9915748 },
  { id: 16, lat: 11.0513355, lng: 76.9915543 },
  { id: 17, lat: 11.0519717, lng: 76.9931446 },
  { id: 18, lat: 11.0526596, lng: 76.9936475 },
  { id: 19, lat: 11.0535966, lng: 76.9941493 },
  { id: 20, lat: 11.0570478, lng: 76.9959042 },
  { id: 21, lat: 11.0576838, lng: 76.9962656 },
  { id: 22, lat: 11.0555174, lng: 76.9952823 },
  { id: 23, lat: 11.0553821, lng: 76.9960616 }

  ];

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -20],
  });

  useEffect(() => {
    // Only initialize if map doesn't exist
    if (!mapInstanceRef.current && mapRef.current) {
      // Calculate center coordinates
      const centerCoords = {
        lat: (Math.max(...markersData.map(m => m.lat)) + Math.min(...markersData.map(m => m.lat))) / 2,
        lng: (Math.max(...markersData.map(m => m.lng)) + Math.min(...markersData.map(m => m.lng))) / 2
      };

      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView([centerCoords.lat, centerCoords.lng], 12);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add polyline connecting all points
      const polylinePoints = markersData.map(marker => [marker.lat, marker.lng]);
      L.polyline(polylinePoints, { color: 'blue', weight: 2, opacity: 0.6 })
        .addTo(mapInstanceRef.current);

      // Add markers
      markersData.forEach((marker) => {
        L.marker([marker.lat, marker.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`Node ${marker.id}`)
          .on('mouseover', function(e) {
            this.openPopup();
          })
          .on('mouseout', function(e) {
            this.closePopup();
          });
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array since we want this to run once

  const handleRequestAccept = () => {
    navigate('/navigation', {
      state: {
        startCoords: markersData[0],
        endCoords: markersData[markersData.length - 1],
      },
    });
  };

  return (
    <div className="emergency-container">
<header>
<button className="back-btn" onClick={() => navigate("/home")}>🏠</button>
      <h1 className="medbay-title">MEDBAY</h1>
</header>
      <div className="map-container">
        <h2 className="map-title">Map View</h2>
        <div ref={mapRef} id="emergency-map" style={{ height: "500px", width: "100%" }}></div>
      </div>
      <h2 className="destination-title">TIME TILL DESTINATION</h2>
      <div className="metrics">
        <p className="distance">2 km</p>
        <p className="time">10 mins</p>
      </div>
      <p className="path-type">FASTEST AND SHORTEST PATH</p>
      <p className="alert-message">--alerted nearby cars to vacate--</p>
      <div className="notification-buttons">{/* Notification buttons */}</div>
      <div className="destination-status">{/* Destination status */}</div>
      <p className="path-type">LOCATION: KG Speciality Medical Centre</p>
    </div>

  );
};

export default EmergencyMap;
